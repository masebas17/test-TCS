import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ProductService } from '../../../features/products/services/product.service';

export function uniqueIdValidator(
  productService: ProductService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return productService.verifyId(control.value).pipe(
      map((exists: boolean) => (exists ? { idTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
