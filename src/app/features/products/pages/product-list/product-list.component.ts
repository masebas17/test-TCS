import { Component, HostListener, inject, OnInit } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  searchTerm = '';
  openDropdownId: string | null = null;
  showConfirm = false;
  pendingDeleteProduct: IProduct | null = null;
  isLoading = true;
  skeletonArray = Array(5);

  ngOnInit(): void {
    this.productService.loadProducts().subscribe((data) => {
      this.products = data;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    if (!Array.isArray(this.products)) {
      this.filteredProducts = [];
      return;
    }

    const filtered = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredProducts = filtered.slice(0, this.pageSize);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilters();
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = Number(select.value);
    this.pageSize = value;
    this.applyFilters();
  }

  navigateToAdd(): void {
    this.router.navigate(['/products/add-product']);
  }

  toggleDropdown(id: string): void {
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  onEdit(id: string): void {
    this.router.navigate(['/products/edit-product', id]);
  }

  onDelete(product: IProduct): void {
    this.pendingDeleteProduct = product;
    this.showConfirm = true;
  }

  resetModal(): void {
    this.showConfirm = false;
    this.pendingDeleteProduct = null;
  }

  cancelDelete(): void {
    this.pendingDeleteProduct = null;
    this.resetModal();
  }

  deleteConfirmed(): void {
    if (this.pendingDeleteProduct) {
      const productId = this.pendingDeleteProduct.id;
      this.productService.deleteProduct(productId).subscribe(() => {
        this.products = this.products.filter((p) => p.id !== productId);
        this.alertService.show(
          'success',
          `El Producto "${this.pendingDeleteProduct?.name}" fue eliminado correctamente`
        );
        this.applyFilters();
        this.resetModal();
      });
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.openDropdownId = null;
    }
  }
}
