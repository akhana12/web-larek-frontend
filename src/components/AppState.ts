import {
	IProduct,
	IAppState,
	IBasketState,
	Events,
	IOrder,
	FormErrors, ErrorText,
} from '../types';
import { Model } from './base/Model';
import {Product} from './Product';

export class AppState extends Model<IAppState> {
	catalog: Product[] = [];
	basket: IBasketState = {
		items: [],
		total: 0,
	};
	order: IOrder = {
		orderForm: {
			payment: 'online',
			address: '',
		},
		contactForm: {
			email: '',
			phone: '',
		},
	};
	formErrors: FormErrors = {};

	addToBasket(product: IProduct) {
		this.basket.items.push(product);
		this.basket.total += product.price;
		this.emitChanges(Events.UPDATE_BASKET, { basket: this.basket });
	}

	isItemInBasket(item: IProduct) {
		return this.basket.items.some((basketItem) => basketItem.id === item.id);
	}

	getTotalItemsInBasket() {
		return this.basket.items.length;
	}

	getTotalBasketPrice() {
		return this.basket.total;
	}

	removeFromBasket(product: IProduct) {
		this.basket.items = this.basket.items.filter((item) => {
			return item.id !== product.id;
		});
		this.basket.total -= product.price;
		this.emitChanges(Events.UPDATE_BASKET, { basket: this.basket });
	}

	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.emitChanges(Events.UPDATE_BASKET, { basket: this.basket });
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges(Events.UPDATE_CATALOG, { catalog: this.catalog });
	}

	setOrderData(data: Partial<IOrder>) {
		this.order = {
			...this.order,
			orderForm: {
				...this.order.orderForm,
				...data.orderForm,
			},
			contactForm: {
				...this.order.contactForm,
				...data.contactForm,
			},
		};
	}

	clearOrderData() {
		this.setOrderData({
			orderForm: {
				payment: 'online',
				address: '',
			},
			contactForm: {
				email: '',
				phone: '',
			},
		});

		this.clearBasket();
	}

	validateAddress(): boolean {
		const errors: typeof this.formErrors = {};
		const addressRegex = /^[а-яА-ЯёЁ0-9][а-яА-ЯёЁ0-9\s.,-]{8,}[а-яА-ЯёЁ0-9]$/;

		if (!this.order.orderForm.address) {
			errors.address = ErrorText.EMPTY_ADDRESS;
		} else if (
			!addressRegex.test(this.order.orderForm.address)
		) {
			errors.address = ErrorText.INVALID_ADDRESS;
		}

		this.formErrors = errors;
		this.events.emit(Events.FORM_ERRORS, this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateCustomerData(): boolean {
		const errors: typeof this.formErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

		if (!this.order.contactForm.email) {
			errors.email = ErrorText.EMPTY_EMAIL;
		} else if (!emailRegex.test(this.order.contactForm.email)) {
			errors.email = ErrorText.INVALID_EMAIL;
		}

		if (!this.order.contactForm.phone) {
			errors.phone = ErrorText.EMPTY_PHONE;
		} else if (!phoneRegex.test(this.order.contactForm.phone)) {
			errors.phone = ErrorText.INVALID_PHONE;
		}

		this.formErrors = errors;
		this.events.emit(Events.FORM_ERRORS, this.formErrors);

		return Object.keys(errors).length === 0;
	}
}