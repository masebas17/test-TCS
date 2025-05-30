import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductFormComponent } from '../../../../shared/components/product-form/product-form.component';

import { IProduct } from '../../models/product.model';
import { AlertService } from '../../../../shared/services/alert.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productService: ProductService;
  let router: Router;
  let alertService: AlertService;

  const mockProduct: IProduct = {
    id: '789',
    name: 'Nuevo Producto',
    description: 'Descripción nueva',
    logo: 'logo-nuevo.png',
    date_release: new Date('2025-01-01'),
    date_revision: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateProductComponent,
        ProductFormComponent,
        HttpClientTestingModule,
      ],
      providers: [
        ProductService,
        AlertService,
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call addProduct and navigate on handleSubmit', () => {
    jest.spyOn(productService, 'addProduct').mockReturnValue(of(mockProduct));
    const alertSpy = jest.spyOn(alertService, 'show');
    const routerSpy = jest.spyOn(router, 'navigate');

    component.handleSubmit(mockProduct);

    expect(productService.addProduct).toHaveBeenCalledWith(mockProduct);
    expect(alertSpy).toHaveBeenCalledWith(
      'success',
      'Producto creado correctamente'
    );
    expect(routerSpy).toHaveBeenCalledWith(['/products']);
  });
});
