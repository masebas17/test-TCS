import { Component, inject, OnInit } from '@angular/core';
import { ProductFormComponent } from '../../../../shared/components/product-form/product-form.component';
import { IProduct } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {
  product?: IProduct;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe((product) => {
        if (product) {
          this.product = product;
        } else {
          this.router.navigate(['/products']);
        }
      });
    }
  }

  handleSubmit(updatedProduct: IProduct): void {
    this.productService.updateProduct(updatedProduct).subscribe(() => {
      this.alertService.show('success', 'Producto editado correctamente');
      this.router.navigate(['/products']);
    });
  }
}
