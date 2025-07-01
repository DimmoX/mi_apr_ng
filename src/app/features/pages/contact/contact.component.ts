import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
/**
 * Componente de Contacto
 * @description Permite a los usuarios enviar mensajes al equipo de soporte.
 * Incluye un formulario con campos para nombre, email, teléfono, asunto y mensaje.
 */
export class ContactComponent {
  contactForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Inicializa el formulario de contacto con validaciones
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+56[0-9]{9}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  /**
   * @desc Maneja el envío del formulario de contacto.
   * Valida los campos y muestra un mensaje de éxito o error.
   */
  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      this.snackBar.open('Mensaje enviado correctamente. Te contactaremos pronto.', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.contactForm.reset();
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos correctamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
  /**
   * @desc obtiene los mensajes de error para un campo específico del formulario.
   * @param field - Nombre del campo del formulario (ej. 'name', 'email', 'phone', 'subject', 'message').
   * @returns Mensaje de error correspondiente al campo
   */
  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato de teléfono inválido (+56XXXXXXXXX)';
    }
    return '';
  }
}
