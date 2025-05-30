import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProductComponent } from './edit-product.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductFormComponent } from '../../../../shared/components/product-form/product-form.component';
import { IProduct } from '../../models/product.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let productService: ProductService;
  let router: Router;

  const mockProduct: IProduct = {
    id: '123',
    name: 'Producto Test',
    description: 'Descripcion',
    logo: 'logo.png',
    date_release: new Date('2025-01-01'),
    date_revision: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditProductComponent,
        ProductFormComponent,
        HttpClientTestingModule,
      ],
      providers: [
        ProductService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load product by id on init', () => {
    jest
      .spyOn(productService, 'getProductById')
      .mockReturnValue(of(mockProduct));
    jest.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(component.product).toEqual(mockProduct);
  });

  it('should call updateProduct and navigate on submit', () => {
    jest
      .spyOn(productService, 'updateProduct')
      .mockReturnValue(of(mockProduct));
    const routerSpy = jest.spyOn(router, 'navigate');

    component.handleSubmit(mockProduct);

    expect(productService.updateProduct).toHaveBeenCalledWith(mockProduct);
    expect(routerSpy).toHaveBeenCalledWith(['/products']);
  });
});
