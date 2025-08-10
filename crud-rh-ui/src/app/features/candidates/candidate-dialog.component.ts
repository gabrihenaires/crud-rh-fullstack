// Dialog de criação/edição de candidato.
// Mantém UI custom (Inter, animações) usando HTML/CSS próprios.

import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Candidate } from '../../core/candidates/candidate';
import { CpfMaskDirective } from '../../shared/masks/cpf-mask.directive';
import { PhoneMaskDirective } from '../../shared/masks/phone-mask.directive';

type DialogData = { mode: 'create' | 'edit'; value?: Candidate };

@Component({
  selector: 'app-candidate-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    CpfMaskDirective, PhoneMaskDirective,
  ],
  templateUrl: './candidate-dialog.component.html',
  styleUrls: ['./candidate-dialog.component.scss'],
})
export class CandidateDialogComponent {
  private fb = inject(FormBuilder);

  // Formulário reativo com validações
  form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf:   ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    phone: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ref: MatDialogRef<CandidateDialogComponent>,
  ) {
    // Se for edição, preenche valores
    if (data?.value) {
      this.form.patchValue({
        name: data.value.name ?? '',
        email: data.value.email ?? '',
        cpf: data.value.cpf ?? '',
        phone: data.value.phone ?? '',
      });
    }
  }

  /** Envia valores do form (somente se válidos). */
  save() {
    if (this.form.invalid) return;
    this.ref.close(this.form.value);
  }

  /** Fecha sem salvar. */
  close() {
    this.ref.close(null);
  }
}
