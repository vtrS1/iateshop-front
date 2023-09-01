import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductEvent } from 'src/app/models/enums/Products/ProductEvent';
import { GetCategoriesResponse } from 'src/app/models/interfaces/Categories/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { CreateProductRequest } from 'src/app/models/interfaces/Products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/Products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/Products/request/SaleProductRequest';
import { GetAllProductsResponse } from 'src/app/models/interfaces/Products/response/GetAllProductsResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  categoriesDatas: Array<GetCategoriesResponse> = [];
  selectedCategory: Array<{ name: string; code: string }> = [];
  productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };
  productSelectedDatas!: GetAllProductsResponse;
  productsDatas: Array<GetAllProductsResponse> = [];
  saleProductSelected!: GetAllProductsResponse;

  addProductAction = ProductEvent.ADD_PRODUCT_ACTION;
  editProductAction = ProductEvent.EDIT_PRODUCT_ACTION;
  saleProductAction = ProductEvent.SALE_PRODUCT_ACTION;

  addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
  });

  saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;
    if (
      this.productAction?.event?.action === this.editProductAction &&
      this.productAction.productDatas
    ) {
      this.getProductSelectedDatas(this.productAction?.event.id as string);
    }
    this.productAction?.event?.action === this.saleProductAction &&
      this.getProductsDatas();
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            response.length > 0 && (this.categoriesDatas = response);
          }
        },
      });
  }

  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productDatas;
    if (allProducts) {
      const productFiltered = allProducts.filter(
        (element) => element?.id === productId
      );

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
        });
      }
    }
  }

  getProductsDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.productsDtService.setProductsDatas(this.productsDatas);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount),
      };

      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            response &&
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 3000,
              });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 3000,
            });
            this.addProductForm.reset();
          },
        });

      this.addProductForm.reset();
    }
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction.event.id,
        amount: this.editProductForm.value.amount as number,
      };

      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            response &&
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto editado com sucesso!',
                life: 3000,
              });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 3000,
            });
            this.editProductForm.reset();
          },
        });
    }
  }

  handleSubmitSaleProduct(): void {
    if (this.saleProductForm?.value && this.saleProductForm.valid) {
      const requestDatas: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number,
        product_id: this.saleProductForm.value?.product_id as string,
      };

      this.productsService
        .saleProduct(requestDatas)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Venda efetuada com sucesso!',
                life: 3000,
              });
              this.saleProductForm.reset();
              this.getProductsDatas();
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao vender produto!',
              life: 3000,
            });
            this.saleProductForm.reset();
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
