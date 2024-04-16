import { Model } from './base/Model';
import { IProduct, ProductCategory } from '../types';
import { IEvents } from './base/Events';

export class Product extends Model<IProduct> {
	id: string;
	category: ProductCategory;
	title: string;
	image: string;
	price: number;
	about: string;

	constructor(data: Partial<IProduct>, events: IEvents) {
		super(data, events);
		this.id = data.id || '';
		this.category = data.category || 'другое';
		this.title = data.title || '';
		this.image = data.image || '';
		this.price = data.price || 0;
		this.about = data.description || '';
	}
}