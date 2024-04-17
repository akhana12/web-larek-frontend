import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';
import { Events, IPage } from '../types';

export class Page extends Component<IPage> {
	protected _gallery: HTMLElement;
	protected _basket: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');

		this._basket.addEventListener('click', () => {
			this.events.emit(Events.OPEN_BASKET);
		});
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked')
	}
}
