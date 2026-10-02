import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.html',
  styleUrls: ['./form-field.css'],
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() control!: AbstractControl;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() hint = '';

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
