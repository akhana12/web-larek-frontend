// Тип с доступными методами запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'

// Интерфейс ответа от API, содержащий список товаров
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	sendOrder: (
		orderData: Partial<PlaceOrderRequest>
	) => Promise<PlaceOrderResponse>;
}

export interface IPage {
	catalog: HTMLElement[];
	locked: boolean;
}

// Тип с категориями товаров
export type ProductCategory =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';

// Тип со способами оплаты
export type PaymentType = 'online' | 'upon-receipt';

export interface ApiResponse {
	total: number;
	items: IProduct[];
}

// Интерфейс товара
export interface IProduct {
	id: string;
	category: ProductCategory;
	title: string;
	image: string;
	price: number;
	description?: string;
}

// Интерфейс формы контактных данных
export interface IContactForm {
	phone: string;
	email: string;
}

// Интерфейс формы способа оплаты и адреса
export interface IOrderForm {
	payment: PaymentType;
	address: string;
}

// Интерфейс заказа
export interface IOrder {
	orderForm: IOrderForm;
	contactForm: IContactForm;
}

// Интерфейс состояния корзины
export interface IBasketState {
	items: IProduct[];
	total: number;
}

// Интерфейс отображения корзины
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IModalData {
	content: HTMLElement;
}

export interface ISuccessData {
	total: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	category: string;
	title: string;
	image?: string;
	price: number;
	about?: string;
	index?: number;
}

// Состояние приложения
export interface IAppState {
	catalog: IProduct[];
	basket: IBasketState;
	orderData: (IOrderForm & IContactForm) | null;
}

export type PlaceOrderRequest = {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export type PlaceOrderResponse = {
	id: string[];
	total: number;
}

/* События */

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export enum Events {
	UPDATE_CATALOG = 'card:catalog:update',
	SELECT_PRODUCT = 'card:select',
	OPEN_MODAL = 'modal:open',
	CLOSE_MODAL = 'modal:close',
	OPEN_BASKET = 'basket:open',
	ADD_TO_BASKET = 'basket:product:add',
	REMOVE_FROM_BASKET = 'basket:remove',
	UPDATE_BASKET = 'basket:update',
	ENTER_ORDER_INFO = 'order:info:change',
	CHANGE_DELIVERY_ADDRESS = 'order.address:change',
	ENTER_CONTACT_INFO = 'order:contact:change',
	CHANGE_EMAIL = 'contacts.email:change',
	CHANGE_PHONE_NUMBER = 'contacts.phone:change',
	SEND_ORDER = 'order:send',
	COMPLETE_ORDER = 'order:complete',
	PREPARE_FOR_NEW_PURCHASES = 'order:prepare',
	FORM_ERRORS = 'formErrors:change'
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IFormData extends IContactForm, IOrderForm {}
export type FormErrors = Partial<Record<keyof IFormData, string>>;

export enum ErrorText {
	EMPTY_ADDRESS = 'Введите адрес доставки',
	INVALID_ADDRESS = 'Некорректный формат адреса',
	EMPTY_EMAIL = 'Введите e-mail',
	INVALID_EMAIL = 'Некорректный формат e-mail',
	EMPTY_PHONE = 'Введите телефон',
	INVALID_PHONE = 'Неверный формат номера телефона'
}
