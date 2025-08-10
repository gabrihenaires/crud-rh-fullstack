// Lista de candidatos com busca inteligente, paginação e ações (CRUD via dialogs).

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CandidateService } from '../../core/candidates/candidate.service';
import { Candidate } from '../../core/candidates/candidate';
import { CandidateDialogComponent } from './candidate-dialog.component';
import { CandidateStatusDialogComponent } from './candidate-status-dialog.component';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatPaginatorModule, MatFormFieldModule, MatInputModule,
    MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
})
export class CandidateListComponent implements OnInit {
  // DI
  private api   = inject(CandidateService);
  private dialog= inject(MatDialog);
  private snack = inject(MatSnackBar);

  // Colunas (caso use MatTable em outro momento)
  displayedColumns = ['name','email','cpf','status','actions'];

  // Signals para estado reativo simples
  data      = signal<Candidate[]>([]);
  total     = signal(0);
  pageSize  = signal(10);
  pageIndex = signal(0);
  search    = '';

  ngOnInit() { this.load(); }

  /** Carrega página atual, respeitando per_page. */
  load(page: number = 1) {
    this.api.list({ search: this.search, page, per_page: this.pageSize() }).subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.total.set(res.meta.total);
        this.pageIndex.set(res.meta.current_page - 1);
        this.pageSize.set(res.meta.per_page);
      },
      error: () => this.snack.open('Falha ao carregar candidatos', 'Fechar', { duration: 3000 }),
    });
  }

  /** Handler de paginação do Material (se usar MatPaginator). */
  onPage(e: PageEvent) { this.load(e.pageIndex + 1); }

  /**
   * Busca "inteligente":
   * - identifica tokens de status no termo (ex.: "aprovado", "reprovado", "em analise")
   * - remove os tokens de status e envia o restante como busca textual
   * - sempre reseta para a página 1 ao realizar nova busca
   */
  applySearch() {
    const raw = (this.search || '').trim();

    // normaliza acentos/múltiplos espaços (busca mais robusta)
    const normalize = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
    const norm = normalize(raw).toLowerCase();

    // mapeia status no termo
    const detectStatus = (t: string): Candidate['status'] | null => {
      if (!t) return null;
      if (/(^|\b)(aprov|aprovado|aprovada|ok|apv)\b/.test(t)) return 'aprovado';
      if (/(^|\b)(reprov|reprovado|reprovada|negado|recusado)\b/.test(t)) return 'reprovado';
      if (/(^|\b)(em analise|analise|pendente)\b/.test(t)) return 'em_analise';
      return null;
    };

    // remove palavras de status, sobrando apenas a parte "livre" pra busca textual
    const stripStatusWords = (t: string) =>
      t
        .replace(/\b(aprovado|aprovada|aprov|ok|apv)\b/g, '')
        .replace(/\b(reprovado|reprovada|reprov|negado|recusado)\b/g, '')
        .replace(/\b(em analise|analise|pendente)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const status = detectStatus(norm);
    const remaining = stripStatusWords(norm);

    const params: any = { page: 1, per_page: this.pageSize() };
    if (status) params.status = status;
    if (!status) params.search = this.search;      // mantém input original (com acentos)
    else if (remaining) params.search = remaining; // envia só o que sobrou

    this.api.list(params).subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.total.set(res.meta.total);
        this.pageIndex.set(res.meta.current_page - 1);
        this.pageSize.set(res.meta.per_page);
      },
      error: () => this.snack.open('Falha ao carregar candidatos', 'Fechar', { duration: 3000 }),
    });
  }

  /** Abre dialog de criação/edição. */
  edit(row: Candidate | null) {
    const ref = this.dialog.open(CandidateDialogComponent, {
      width: '720px',
      panelClass: 'candidate-modal-panel',
      backdropClass: 'candidate-modal-backdrop',
      data: row ? { mode: 'edit', value: row } : { mode: 'create' },
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      if (row?.id) {
        // update
        this.api.update(row.id, result).subscribe({
          next: () => { this.snack.open('Candidato atualizado!', 'OK', { duration: 2000 }); this.load(this.pageIndex() + 1); },
          error: (err) => this.snack.open(err?.error?.message || 'Erro ao atualizar', 'Fechar', { duration: 3000 }),
        });
      } else {
        // create
        this.api.create(result as Candidate).subscribe({
          next: () => { this.snack.open('Candidato criado!', 'OK', { duration: 2000 }); this.load(1); },
          error: (err) => {
            const msg = typeof err?.error === 'object' && err?.error?.message ? err.error.message : 'Erro ao criar';
            this.snack.open(msg, 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  /** Confirma e remove. */
  remove(row: Candidate) {
    if (!confirm(`Excluir ${row.name}?`)) return;
    this.api.delete(row.id!).subscribe({
      next: () => { this.snack.open('Candidato excluído!', 'OK', { duration: 2000 }); this.load(this.pageIndex() + 1); },
      error: () => this.snack.open('Erro ao excluir', 'Fechar', { duration: 3000 }),
    });
  }

  /** Abre dialog de alteração de status. */
  status(row: Candidate) {
    const ref = this.dialog.open(CandidateStatusDialogComponent, {
      width: '560px',
      backdropClass: 'candidate-modal-backdrop',
      panelClass: 'status-modal-panel',
      data: { id: row.id!, current: row.status }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.api.update(row.id!, { status: result }).subscribe({
        next: () => { this.snack.open('Status atualizado!', 'OK', { duration: 2000 }); this.load(this.pageIndex() + 1); },
        error: () => this.snack.open('Erro ao alterar status', 'Fechar', { duration: 3000 })
      });
    });
  }

  // Controles de paginação "Prev/Next" do layout custom
  prevPage() {
    const p = this.pageIndex();
    if (p > 0) this.load(p);
  }

  nextPage() {
    const current = this.pageIndex() + 1;
    const canNext = (current * this.pageSize()) < this.total();
    if (canNext) this.load(current + 1);
  }

  /** Só mostra WhatsApp pra aprovados com telefone. */
  hasWhatsApp(row: Candidate): boolean {
    return row.status === 'aprovado' && !!row.phone;
  }

  /** Formata link do WhatsApp com DDI 55 se faltar. */
  toWaLink(phone?: string | null): string {
    if (!phone) return '';
    let d = phone.replace(/\D/g, '');
    if (!d.startsWith('55')) d = '55' + d;
    return `https://wa.me/${d}`;
  }

  /** trackBy pro *ngFor (evita re-render desnecessário). */
  trackById = (_: number, row: Candidate) => row.id ?? row.email;
}
