import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/Products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsDataTransferService {
  productsDataEmitter$ = new BehaviorSubject<any>(null);
  productsDatas: Array<GetAllProductsResponse> = [];

  setProductsDatas(productsDatas: Array<GetAllProductsResponse>): void {
    if (productsDatas) {
      this.productsDataEmitter$.next(productsDatas);
      this.getProductsDatas();
    }
  }

  getProductsDatas(): Array<GetAllProductsResponse> {
    this.productsDataEmitter$
      .pipe(
        take(1),
        map((data: Array<GetAllProductsResponse>) =>
          data.filter((product: GetAllProductsResponse) => product?.amount > 0)
        )
      )
      .subscribe({
        next: (products: Array<GetAllProductsResponse>) => {
          products && (this.productsDatas = products);
        },
      });
    return this.productsDatas;
  }
}
