import {
	IProduct,
	PlaceOrderRequest,
	PlaceOrderResponse,
	ILarekAPI,
	ApiListResponse
} from '../types';
import { Api } from './base/Api';



export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	sendOrder(requestBody: PlaceOrderRequest): Promise<PlaceOrderResponse> {
		return this.post('/order', requestBody).then(
			(order: PlaceOrderResponse) => order
		);
	}
}
