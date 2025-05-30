import { Component, inject } from '@angular/core';
import { ProductFormComponent } from '../../../../shared/components/product-form/product-form.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  handleSubmit(product: any): void {
    this.productService.addProduct(product).subscribe(() => {
      this.alertService.show('success', 'Producto creado correctamente');
      this.router.navigate(['/products']);
    });
  }
}
