import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';

export const productsRoutes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'add-product', component: CreateProductComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
];
