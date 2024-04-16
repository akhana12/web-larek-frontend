import {
	Events,
	IContactInfo,
	IProduct,
	ProductCategory,
	PlaceOrderResponse,
	IBasketView,
	IFormData,
	CatalogChangeEvent
} from './types';

import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';

import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { Card } from './components/Card';
import './scss/styles.scss';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ContactInfo, OrderInfo } from './components/Form';
import { SuccessModal } from './components/common/Success';

// Глобальные контейнеры
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Шаблоны
const templates = {
	successModalTemplate: ensureElement<HTMLTemplateElement>('#success'),
	cardTemplate: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreviewModalTemplate: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardBasketTemplate: ensureElement<HTMLTemplateElement>('#card-basket'),
	basketTemplate: ensureElement<HTMLTemplateElement>('#basket'),
	orderDetailsFormTemplate: ensureElement<HTMLTemplateElement>('#order'),
	customerDataFormTemplate: ensureElement<HTMLTemplateElement>('#contacts'),
};

// Переиспользуемые части интерфейса
const basket: Basket = new Basket(cloneTemplate(templates.basketTemplate), events);
const orderForm: OrderInfo = new OrderInfo(cloneTemplate(templates.orderDetailsFormTemplate), events);
const customerDataForm: ContactInfo = new ContactInfo(cloneTemplate(templates.customerDataFormTemplate), events);
const successModal: SuccessModal = new SuccessModal(cloneTemplate(templates.successModalTemplate), events);


// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

// Получение товаров от сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Обновление каталога
events.on<CatalogChangeEvent>(Events.UPDATE_CATALOG, () => {
	page.gallery = appData.catalog.map((item) => {
		const card = new Card<ProductCategory>(
			'card',
			cloneTemplate(templates.cardTemplate),
			{
				onClick: () => events.emit(Events.SELECT_PRODUCT, item),
			}
		);
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открытие карточки товара
events.on<IProduct>(Events.SELECT_PRODUCT, (item) => {
	const card = new Card<IProduct>(
		'card',
		cloneTemplate(templates.cardPreviewModalTemplate),
		{
			onClick: () => {
				events.emit(Events.ADD_TO_BASKET, item);
				card.disableButton();
			},
		}
	);
	if (appData.isItemInBasket(item)) {
		card.disableButton();
	}
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			about: item.description,
		}),
	});
	page.locked = true;
});

// Открытие корзины
events.on(Events.OPEN_BASKET, () => {
	modal.render({
		content: basket.render({
			items: appData.basket.items.map((item) => {
				// Создаем экземпляр класса Card для каждого элемента корзины
				const cardItem = new Card<IBasketView>(
					'card',
					cloneTemplate(templates.cardBasketTemplate),
					{
						onClick: () => {
							cardItem.remove();
							events.emit(Events.REMOVE_FROM_BASKET, item);
						},
					}
				);
				return cardItem.render({
					title: item.title,
					price: item.price,
				});
			}),
			total: appData.getTotalBasketPrice(),
		}),
	});
});

// Добавление товара в корзину
events.on(Events.ADD_TO_BASKET, (item: IProduct) => {
	// Передали товар в модель данных корзины
	appData.addToBasket(item);
	modal.close();
});

// Удаление товара из корзины
events.on(Events.REMOVE_FROM_BASKET, (productToRemove: IProduct) => {
	appData.removeFromBasket(productToRemove);
	if (appData.basket.items.length === 0) {
		basket.setEmpty();
	}
});

// Изменение корзины
events.on(Events.UPDATE_BASKET, () => {
	basket.updateBasket();
	basket.total = appData.getTotalBasketPrice();
	page.counter = appData.getTotalItemsInBasket();
});

// Вввод адреса и способа оплаты заказа
events.on(Events.ENTER_ORDER_INFO, () => {
	modal.close();
	console.log(orderForm.render)
	modal.render({
		content: orderForm.render({
			valid: appData.validateAddress(),
			errors: [],
		}),
	});
});


// Ввод контактных данных
events.on(Events.ENTER_CONTACT_INFO, () => {
	modal.close();
	console.log(orderForm.render)
	modal.render({
		content: customerDataForm.render({
			valid: appData.validateCustomerData(),
			errors: [],
		}),
	});
});

// Валидируем значения в форме
events.on(Events.FORM_ERRORS, (errors: Partial<IFormData>) => {
	// Обработчик изменений ошибок в форме
	if (errors.address) {
		// Проверяем наличие ошибок в адресе доставки
		orderForm.valid = false;
		orderForm.errors = errors.address;
	} else {
		orderForm.valid = true;
		orderForm.errors = '';
	}

	if (errors.email || errors.phone) {
		// Проверяем наличие ошибок в email и телефоне
		customerDataForm.valid = false;
		customerDataForm.errors = Object.values({
			phone: errors.phone,
			email: errors.email,
		})
			.filter((i) => !!i)
			.join('; ');
	} else {
		customerDataForm.valid = true;
		customerDataForm.errors = '';
	}
});

// Изменение поля в форме
events.on(
	/^(contacts\.(phone|email)|order\.address):change/,
	(data: { field: keyof IContactInfo; value: string }) => {
		if (!['email', 'phone'].includes(data.field)) {
			// Обработчик изменения адреса или контактной информации
			appData.setOrderData({
				orderInfo: {
					...appData.order.orderInfo,
					address: data.value,
				},
			});
		} else {
			const newData: Partial<IContactInfo> = {
				[data.field]: data.value,
			};
			appData.setOrderData({
				customerInfo: {
					...appData.order.customerInfo,
					...newData,
				},
			});
		}
	}
);

// Обработчик изменения адреса доставки
events.on(Events.CHANGE_DELIVERY_ADDRESS, () => {
	appData.validateAddress();
});

// Обработчик изменения номера телефона
events.on(Events.CHANGE_PHONE_NUMBER, () => {
	appData.validateCustomerData();
});

// Обработчик изменения адреса электронной почты
events.on(Events.CHANGE_EMAIL, () => {
	appData.validateCustomerData();
});

// Обработчик закрытия модального окна
events.on(Events.CLOSE_MODAL, () => {
	page.locked = false;
});

// Обработчик размещения заказа
events.on(Events.SEND_ORDER, () => {
	appData.setOrderData({
		customerInfo: {
			email: appData.order.customerInfo.email,
			phone: appData.order.customerInfo.phone,
		},
	});

	api
		.sendOrder({
			payment: appData.order.orderInfo.payment,
			email: appData.order.customerInfo.email,
			phone: appData.order.customerInfo.phone,
			address: appData.order.orderInfo.address,
			total: appData.getTotalBasketPrice(),
			items: appData.basket.items.map((item) => item.id),
		})
		.then((res: PlaceOrderResponse) => {
			successModal.total = res.total;
			events.emit(Events.COMPLETE_ORDER);
		});

	modal.close();
	modal.render({
		content: successModal.render(),
	});
});

// Обработчик завершения заказа
events.on(Events.COMPLETE_ORDER, () => {
	appData.clearOrderData();
	basket.setEmpty();
	orderForm.clearInputs();
	customerDataForm.clearInputs();
});

// Обработчик подготовки к новым покупкам
events.on(Events.PREPARE_FOR_NEW_PURCHASES, () => {
	basket.setEmpty();
	modal.close();
});