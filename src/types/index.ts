// интерфейс товара
export interface IProduct {
	_id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number|null;
}

// интерфейс списка товаров
export interface IProductList {
	items: IProduct [];
	setItems (items: IProduct[]): void; // чтобы установить после загрузки из апи
	getProduct(id: string): IProduct; // чтобы получить при рендере списков
}

// интерфейс заказа
export interface IOrder {
	items: IProduct[];
	total: number;
	email: string;
	phone: string;
	payment: string;
	address: string;
	addItem(item: IProduct): void;
	removeItem(id: string): void;
	clearItems(): void;
	calculateTotal(): number;
}

// тип для карточки товара в списке
export type ProductCart = Pick<IProduct, Exclude<keyof IProduct, 'description'>>;

// тип для модального окна товара
export type ProductInfo = IProduct;

// тип для модального окна корзины
export type CartInfo = Pick<IOrder, 'items' | 'total'>

// тип для модального окна выбора способа оплаты и ввода адреса доставки
export type PaymentAndAddressForm = Pick<IOrder, 'payment' | 'address'>

// тип для модального окна ввода контактных данных
export type ContactForm = Pick<IOrder, 'email' | 'phone'>

// тип для модального окна успешного оформления заказа
export type SuccessInfo = Pick<IOrder, 'total'>