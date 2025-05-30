import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
    expect(component.form.get('logo')?.value).toBe('');
    expect(component.form.get('date_release')?.value).toBe('');
    expect(component.form.get('date_revision')?.value).toBe('');
  });

  it('should patch the form when initialProduct input changes', () => {
    const initialProduct = {
      id: '999',
      name: 'Editado',
      description: 'Producto editado',
      logo: 'edit.png',
      date_release: new Date('2025-06-01'),
      date_revision: new Date('2026-06-01'),
    };

    component.initialProduct = initialProduct;
    component.ngOnChanges({
      initialProduct: {
        currentValue: initialProduct,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.form.get('name')?.value).toBe('Editado');
    expect(component.form.get('id')?.value).toBe('999');
  });

  it('should mark id as valid if it passes validation', fakeAsync(() => {
    const idControl = component.form.get('id');
    idControl?.setValue('validID');
    tick(500);
    fixture.detectChanges();
    expect(idControl?.valid).toBe(true);
  }));

  it('should emit formSubmit event when form is valid and submitted', fakeAsync(() => {
    const spy = jest.spyOn(component.formSubmit, 'emit');

    component.form.setValue({
      id: 'validID',
      name: 'Producto válido',
      description: 'Una buena descripción del producto',
      logo: 'logo.png',
      date_release: '2025-05-30',
      date_revision: '',
    });

    component.form.updateValueAndValidity();
    tick(500);

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(component.form.value);
  }));

  it('should NOT emit formSubmit event when form is invalid', () => {
    const spy = jest.spyOn(component.formSubmit, 'emit');
    component.form.get('name')?.setValue('');
    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should reset the form on reset', () => {
    component.form.patchValue({
      id: '123',
      name: 'Producto',
      description: 'Desc',
      logo: 'logo.png',
      date_release: '2025-06-10',
      date_revision: '2026-06-10',
    });

    component.onReset();

    expect(component.form.get('id')?.value).toBeFalsy();
    expect(component.form.get('name')?.value).toBeFalsy();
    expect(component.form.get('description')?.value).toBeFalsy();
    expect(component.form.get('logo')?.value).toBeFalsy();
    expect(component.form.get('date_release')?.value).toBeFalsy();
    expect(component.form.get('date_revision')?.value).toBeFalsy();
  });
});
