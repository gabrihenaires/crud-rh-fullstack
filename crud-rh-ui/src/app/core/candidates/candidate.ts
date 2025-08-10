// Tipos compartilhados pelo app (modelo + paginação da API)

export type CandidateStatus = 'em_analise' | 'aprovado' | 'reprovado';

export interface Candidate {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  phone?: string | null;
  status?: CandidateStatus;  // default no backend = 'em_analise'
  created_at?: string;
  updated_at?: string;
}

// Estrutura de paginação compatível com Laravel paginator
export interface Pagination<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}
