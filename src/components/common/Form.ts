import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Events, IContactForm, IOrderForm, PaymentType, IFormState } from '../../types';



export class Form<T> extends Component<IFormState> {
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

export class OrderForm extends Form<IOrderForm> {
	protected _onlineButton?: HTMLButtonElement;
	protected _uponReceiptButton?: HTMLButtonElement;
	protected _paymentMethod: PaymentType = 'online';
	protected _deliveryAddress: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._onlineButton = ensureElement<HTMLButtonElement>(
			'.order__buttons button[name="card"]',
			container
		);
		this._uponReceiptButton = ensureElement<HTMLButtonElement>(
			'.order__buttons button[name="cash"]',
			container
		);
		this._deliveryAddress = ensureElement<HTMLInputElement>(
			'.form__input',
			container
		);

		// кнопка "Онлайн" активна по дефолту
		if (this._onlineButton) {
			this.setActive(this._onlineButton);
		}

		// обработчики событий для кнопок способа оплаты
		if (this._onlineButton) {
			this._onlineButton.addEventListener('click', () => {
				this._paymentMethod = 'online';
				this.onPaymentMethodChange();
				this.setActive(this._onlineButton);
			});
		}

		if (this._uponReceiptButton) {
			this._uponReceiptButton.addEventListener('click', () => {
				this._paymentMethod = 'upon-receipt';
				this.onPaymentMethodChange();
				this.setActive(this._uponReceiptButton);
			});
		}

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(Events.ENTER_CONTACT_INFO, {
				paymentMethod: this._paymentMethod,
				address: this._deliveryAddress.value,
			});
		});
	}

	// Метод для обработки изменения способа оплаты
	protected onPaymentMethodChange() {
		this.events.emit(`${this.container.name}.paymentMethod:change`, {
			paymentMethod: this._paymentMethod,
		});
	}

	// Метод для установки активной кнопки способа оплаты
	protected setActive(button: HTMLButtonElement) {
		if (button === this._onlineButton) {
			this.toggleClass(this._onlineButton, 'button_alt-active', true)
			this.toggleClass(this._uponReceiptButton, 'button_alt-active', false)
		} else {
			this.toggleClass(this._onlineButton, 'button_alt-active', false)
			this.toggleClass(this._uponReceiptButton, 'button_alt-active', true)
		}
	}

	clearInputs() {
		this._deliveryAddress.value = '';
	}
}

export class ContactForm extends Form<IContactForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneNumberInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = this.container.elements.namedItem('email') as HTMLInputElement;

		this._phoneNumberInput = this.container.elements.namedItem('phone') as HTMLInputElement;

		this._phoneNumberInput.addEventListener('input', this.maskInput.bind(this));
		this._phoneNumberInput.value = '+7';

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(Events.SEND_ORDER);
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	private maskInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let keyCode: number;
		if (event instanceof KeyboardEvent) keyCode = event.keyCode;
		const pos = target.selectionStart || 0;
		if (pos < 3) event.preventDefault();

		const matrix = '+7 (___) ___-__-__';
		let i = 0;
		const val = target.value.replace(/\D/g, '');
		let new_value = matrix.replace(/[_\d]/g, (a) =>
			i < val.length ? val.charAt(i++) : a
		);
		i = new_value.indexOf('_');
		if (i !== -1 && i < 5) i = 3;
		new_value = new_value.slice(0, i !== -1 ? i : undefined);

		const regPattern =
			'^' +
			matrix
				.substr(0, target.value.length)
				.replace(/_+/g, (a) => `\\d{1,${a.length}}`)
				.replace(/[+()]/g, '\\$&') +
			'$';
		const isValid = new RegExp(regPattern).test(target.value);
		if (
			!isValid ||
			target.value.length < 5 ||
			(keyCode && keyCode > 47 && keyCode < 58)
		) {
			target.value = new_value;
		}
	}

	clearInputs() {
		this._phoneNumberInput.value = '+7';
		this._emailInput.value = '';
	}
}
