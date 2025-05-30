import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../models/product.model';
import { map, Observable } from 'rxjs';

interface ProductApiResponse {
  data: IProduct[];
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private baseUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos.
   * @returns Un observable que emite un array de productos.
   */

  getAll(): Observable<IProduct[]> {
    return this.http
      .get<ProductApiResponse>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  /**
   * Agrega un nuevo producto.
   * @param product El producto a agregar.
   * @returns Un observable que emite el producto agregado.
   */

  add(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.baseUrl, product);
  }

  /**
   * Verifica si un ID de producto ya existe.
   * @param id El ID del producto a verificar.
   * @returns Un observable que emite true si el ID existe, false en caso contrario.
   */

  checkIdExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }

  /**
   * Actualiza un producto existente.
   * @param product El producto con los datos actualizados.
   * @returns Un observable que emite el producto actualizado.
   */

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.baseUrl}/${product.id}`, product);
  }

  /**
   * Elimina un producto por su ID.
   * @param id El ID del producto a eliminar.
   * @returns Un observable que completa cuando la eliminación es exitosa.
   */

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
