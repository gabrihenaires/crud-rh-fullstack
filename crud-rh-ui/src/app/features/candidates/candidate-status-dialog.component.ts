// Dialog de alteração de status com visual custom do select.

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Candidate } from '../../core/candidates/candidate';

type Status = 'em_analise' | 'aprovado' | 'reprovado';
type StatusData = { id: number; current: Candidate['status'] };

@Component({
  selector: 'app-candidate-status-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './candidate-status-dialog.component.html',
  styleUrls: ['./candidate-status-dialog.component.scss'],
})
export class CandidateStatusDialogComponent {
  // Valor atual (caso não venha, assume em_analise)
  status: Status = 'em_analise';

  // Mapa label -> status (usado no trigger)
  labelMap: Record<Status, string> = {
    em_analise: 'Em análise',
    aprovado: 'Aprovado',
    reprovado: 'Reprovado',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StatusData,
    private ref: MatDialogRef<CandidateStatusDialogComponent>,
  ) {
    this.status = (data?.current ?? 'em_analise') as Status;
  }

  /** Converte status para label humana (cobre null/undefined). */
  statusLabel(s: Status | null | undefined): string {
    const key = (s ?? 'em_analise') as Status;
    return this.labelMap[key];
  }

  // Pode ser usado pra hack de layout quando o painel abre
  selectOpen = false;
  onSelectOpen(open: boolean) {
    this.selectOpen = open;
  }

  save()  { this.ref.close(this.status); }
  close() { this.ref.close(null); }
}
