import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IProduct } from '../../../features/products/models/product.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  releaseDateValidator,
  revisionDateValidator,
} from '../validators/product-date.validators';
import { Router } from '@angular/router';
import { uniqueIdValidator } from '../validators/unique-id.validator';
import { ProductService } from '../../../features/products/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() initialProduct?: IProduct;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSubmit = new EventEmitter<IProduct>();

  form!: FormGroup;
  private productForm = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);

  today: string = new Date().toLocaleDateString('sv-SE');

  get oneYearFromRelease(): string {
    const release = this.form?.get('date_release')?.value;
    if (!release) return '';
    const date = new Date(release);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialProduct'] && this.initialProduct && this.form) {
      this.form.patchValue(this.initialProduct);
    }
  }

  private buildForm(): FormGroup {
    return this.productForm.group(
      {
        id: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          this.mode === 'create'
            ? [uniqueIdValidator(this.productService)]
            : [],
        ],
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        description: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(200),
          ],
        ],
        logo: ['', Validators.required],
        date_release: ['', [Validators.required, releaseDateValidator]],
        date_revision: ['', Validators.required],
      },
      { validators: revisionDateValidator }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }

  onReset(): void {
    this.form.reset();
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
