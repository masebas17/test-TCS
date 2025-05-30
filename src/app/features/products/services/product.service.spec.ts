import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { IProduct } from '../models/product.model';

const BASE_URL = 'http://localhost:3002/bp/products';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    const dummyProducts: IProduct[] = [
      {
        id: '1',
        name: 'Producto A',
        description: 'Desc A',
        logo: 'logo.png',
        date_release: new Date('2025-06-01'),
        date_revision: new Date('2026-06-01'),
      },
      {
        id: '2',
        name: 'Producto B',
        description: 'Desc B',
        logo: 'logo2.png',
        date_release: new Date('2025-06-10'),
        date_revision: new Date('2026-06-10'),
      },
    ];

    service.loadProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${BASE_URL}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should add a new product via POST', () => {
    const newProduct: IProduct = {
      id: '3',
      name: 'Producto C',
      description: 'Desc C',
      logo: 'logo3.png',
      date_release: new Date('2025-07-01'),
      date_revision: new Date('2026-07-01'),
    };

    service.addProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(`${BASE_URL}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(newProduct);
  });

  it('should delete the product via DELETE', () => {
    const id = '1';

    service.deleteProduct(id).subscribe((res) => {
      expect(typeof res).toBe('object');
    });

    const req = httpMock.expectOne(`${BASE_URL}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should verify if a product ID exists via GET', () => {
    const id = 'abc123';
    const exists = true;

    service.verifyId(id).subscribe((result) => {
      expect(result).toBe(exists);
    });

    const req = httpMock.expectOne(`${BASE_URL}/verification/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(exists);
  });

  it('should update a product', () => {
    const updatedProduct: IProduct = {
      id: '1',
      name: 'Updated',
      description: '',
      logo: '',
      date_release: new Date(),
      date_revision: new Date(),
    };

    service.updateProduct(updatedProduct).subscribe((res) => {
      expect(res).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${BASE_URL}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should check for existing ID', () => {
    const response = { exists: true };

    service.verifyId('EXIST123').subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${BASE_URL}/verification/EXIST123`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('should return a product by ID from the list', () => {
    const mockProducts: IProduct[] = [
      {
        id: '1',
        name: 'A',
        description: '',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: '2',
        name: 'B',
        description: '',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];

    let result: IProduct | undefined;

    service.getProductById('2').subscribe((p) => (result = p));

    const req = httpMock.expectOne(`${BASE_URL}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });

    expect(result).toEqual(mockProducts[1]);
  });

  it('should return undefined if product ID is not found', () => {
    const mockProducts: IProduct[] = [
      {
        id: '1',
        name: 'A',
        description: '',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];

    let result: IProduct | undefined;

    service.getProductById('999').subscribe((p) => (result = p));

    const req = httpMock.expectOne(`${BASE_URL}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });

    expect(result).toBeUndefined();
  });
});
