import { Component } from './base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/Events';
import { Events, IBasketView } from '../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _itemIndex: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(Events.ENTER_ORDER_INFO);
			});
		}
		this.items = [];
	}

	set items(items: HTMLElement[]) {
			if (items.length) {
				this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста'
			}));
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	setEmpty() {
		this._list.replaceChildren(
			createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			})
		);
		this.setDisabled(this._button, true);
	}
}
