import { Injectable } from '@angular/core';
import { ProductApiService } from './product-api.service';
import { IProduct } from '../models/product.model';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ProductApiService) {}

  loadProducts(): Observable<IProduct[]> {
    return this.api.getAll().pipe(
      catchError((error) => {
        console.error('Error al cargar productos', error);
        return throwError(() => error);
      })
    );
  }

  addProduct(product: IProduct): Observable<IProduct> {
    return this.api.add(product).pipe(
      catchError((error) => {
        console.error('Error al agregar producto', error);
        return throwError(() => error);
      })
    );
  }

  getProductById(id: string): Observable<IProduct | undefined> {
    return this.api
      .getAll()
      .pipe(map((products) => products.find((product) => product.id === id)));
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.api.updateProduct(product).pipe(
      catchError((error) => {
        console.error('Error al actualizar producto', error);
        return throwError(() => error);
      })
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.api.checkIdExists(id);
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete(id);
  }
}
