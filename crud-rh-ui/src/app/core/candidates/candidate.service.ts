// Serviço de acesso à API de candidatos.
// Centraliza chamadas HTTP e padroniza tipos/params.

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate, Pagination, CandidateStatus } from './candidate';
// import { environment } from '../../../environments/environment'; // se tiver env

// Parâmetros aceitos pela listagem (batem com o backend)
type ListParams = {
  search?: string;
  page?: number;
  status?: CandidateStatus;
  per_page?: number;
};

@Injectable({ providedIn: 'root' })
export class CandidateService {
  private http = inject(HttpClient);
  // Base da API (ajuste para usar environment quando existir)
  private base = '/api/candidates'; // environment.apiUrl + '/candidates'

  /**
   * Lista candidatos com paginação/filtro/busca.
   * - Só envia parâmetros definidos (evita querystring poluída).
   */
  list(params: ListParams): Observable<Pagination<Candidate>> {
    let httpParams = new HttpParams();
    if (params.search)   httpParams = httpParams.set('search', params.search);
    if (params.status)   httpParams = httpParams.set('status', params.status);
    if (params.page)     httpParams = httpParams.set('page', String(params.page));
    if (params.per_page) httpParams = httpParams.set('per_page', String(params.per_page));

    return this.http.get<Pagination<Candidate>>(this.base, { params: httpParams });
  }

  /** Busca candidato por id (detalhe). */
  get(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.base}/${id}`);
  }

  /** Cria candidato. */
  create(payload: Candidate): Observable<Candidate> {
    return this.http.post<Candidate>(this.base, payload);
  }

  /** Atualiza candidato (parcial). */
  update(id: number, payload: Partial<Candidate>): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.base}/${id}`, payload);
  }

  /** Remove candidato. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
