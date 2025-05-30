import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IProduct } from '../../models/product.model';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, HttpClientTestingModule],
      providers: [ProductService, AlertService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    alertService = TestBed.inject(AlertService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Desc 1',
        logo: 'logo1.png',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ] as IProduct[];
    jest
      .spyOn(productService, 'loadProducts')
      .mockReturnValue(of(mockProducts));

    component.ngOnInit();

    expect(component.products).toEqual(mockProducts);
  });

  it('should filter products by search term', () => {
    component.products = [
      { id: '1', name: 'Tarjeta de Crédito' },
      { id: '2', name: 'Préstamo Personal' },
      { id: '3', name: 'Cuenta de Ahorros' },
    ] as any;
    component.searchTerm = 'tarjeta';
    component.applyFilters();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toContain('Tarjeta');
  });

  it('should update pageSize when onPageSizeChange is called', () => {
    const event = { target: { value: '10' } } as unknown as Event;
    component.onPageSizeChange(event);
    expect(component.pageSize).toBe(10);
  });

  it('should set pendingDeleteProduct and show confirm modal on delete', () => {
    const mockProduct = { id: '1', name: 'Producto Test' } as IProduct;

    component.onDelete(mockProduct);

    expect(component.pendingDeleteProduct).toEqual(mockProduct);
    expect(component.pendingDeleteProduct?.name).toBe('Producto Test');
    expect(component.showConfirm).toBe(true);
  });

  it('should reset deletion state when cancelDelete is called', () => {
    component.pendingDeleteProduct = { id: '1', name: 'Test' } as IProduct;
    component.pendingDeleteProduct.name = 'Test';
    component.showConfirm = true;

    component.cancelDelete();

    expect(component.pendingDeleteProduct).toBeNull();
    expect(component.showConfirm).toBe(false);
  });

  it('should call deleteProduct with the correct ID', () => {
    const mockProduct = { id: '123', name: 'Test Product' } as IProduct;
    component.pendingDeleteProduct = mockProduct;
    jest.spyOn(productService, 'deleteProduct').mockReturnValue(of(undefined));

    component.deleteConfirmed();

    expect(productService.deleteProduct).toHaveBeenCalledWith('123');
  });

  it('should remove the product from the list after deletion', () => {
    const mockProduct = { id: '123', name: 'Test Product' } as IProduct;
    component.products = [
      mockProduct,
      { id: '456', name: 'Otro Producto' } as IProduct,
    ];
    component.pendingDeleteProduct = mockProduct;
    jest.spyOn(productService, 'deleteProduct').mockReturnValue(of(undefined));

    component.deleteConfirmed();

    expect(component.products.some((p) => p.id === '123')).toBe(false);
  });

  it('should show a success alert with product name after deletion', () => {
    const mockProduct = { id: '123', name: 'Test Product' } as IProduct;
    component.pendingDeleteProduct = mockProduct;
    jest.spyOn(productService, 'deleteProduct').mockReturnValue(of(undefined));
    const alertSpy = jest.spyOn(alertService, 'show');

    component.deleteConfirmed();

    expect(alertSpy).toHaveBeenCalledWith(
      'success',
      'El Producto "Test Product" fue eliminado correctamente'
    );
  });

  it('should apply filters and reset modal after deletion', () => {
    const mockProduct = { id: '123', name: 'Test Product' } as IProduct;
    component.pendingDeleteProduct = mockProduct;
    jest.spyOn(productService, 'deleteProduct').mockReturnValue(of(undefined));
    const filterSpy = jest.spyOn(component, 'applyFilters');
    const resetSpy = jest.spyOn(component, 'resetModal');

    component.deleteConfirmed();

    expect(filterSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should open dropdown when productId is different', () => {
    component.openDropdownId = null;

    component.toggleDropdown('123');

    expect(component.openDropdownId).toBe('123');
  });

  it('should close dropdown when productId is the same', () => {
    component.openDropdownId = '123';

    component.toggleDropdown('123');

    expect(component.openDropdownId).toBeNull();
  });
});
