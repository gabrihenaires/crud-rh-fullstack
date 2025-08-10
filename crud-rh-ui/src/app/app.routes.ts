// Rotas simples: lista de candidatos como página inicial.

import { Routes } from '@angular/router';
import { CandidateListComponent } from './features/candidates/candidate-list.component';

export const routes: Routes = [
  { path: '', component: CandidateListComponent },
  // { path: '**', redirectTo: '' } // opcional: fallback
];
