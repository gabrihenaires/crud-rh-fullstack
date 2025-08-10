# Gestão de Candidatos

Aplicação full-stack (Laravel + Angular) para cadastro, listagem, busca e alteração de status de candidatos.

## 🔧 Tech stack

- **Backend:** Laravel 11 (API REST, validação, paginação)
- **Banco:** MySQL/PostgreSQL/SQLite (compatível)
- **Frontend:** Angular 17 (standalone, Angular Material, Signals)
- **Estilo:** UI custom (Inter), componentes Material estilizados


## ▶️ Como rodar (backend)

1) **Requisitos**
- PHP 8.2+
- Composer
- Extensões PDO + driver do seu banco
- (Opcional) MySQL/Postgres rodando local

2) **Instalação**
```bash
cd api
cp .env.example .env
composer install
php artisan key:generate
Banco

Atualize .env com credenciais do seu banco.

Rode as migrações:

bash

php artisan migrate
Servir a API

bash

php artisan serve
A API sobe em http://127.0.0.1:8000.

🔗 Endpoints principais
GET /api/candidates — lista com paginação
Parâmetros: page, per_page (1..100), search, status (em_analise|aprovado|reprovado)

POST /api/candidates — cria

GET /api/candidates/{id} — detalhe

PUT /api/candidates/{id} — atualiza

DELETE /api/candidates/{id} — remove

🔍 Busca “inteligente”
No front a busca identifica tokens como aprovado/reprovado/em analise.
Se o usuário digitar “aprovado joão”, a chamada vai com status=aprovado e search=joao.

▶️ Como rodar (frontend)
Requisitos

Node 18+

PNPM/NPM/Yarn (ex.: npm)

Instalação

bash

cd web
npm i
Executar

bash

npm start
A aplicação sobe em http://localhost:4200.

O front espera a API em http://127.0.0.1:8000.
Se quiser outro host/base, ajuste CandidateService.base.

🧪 Scripts úteis
Backend (Laravel)
bash

php artisan serve                # sobe API
php artisan migrate              # aplica migrações
php artisan migrate:fresh        # recria schema
php artisan tinker               # REPL
Frontend (Angular)
bash

npm start                        # dev server
npm run build                    # build de produção
npm run lint                     # lint (se configurado)
🗂️ Convenções
Commits: estilo feat:, fix:, refactor:, docs:, chore:

Código: Prettier + EditorConfig (arquivos abaixo)

Angular:

Components standalone

Services isolam HTTP

Signals para estado simples

trackBy em *ngFor

Laravel:

Requests para validação (StoreCandidateRequest, UpdateCandidateRequest)

Controller fino

Paginação via paginate()

Pesquisa compatível com Postgres (ILIKE) e fallback case-insensitive

📁 Variáveis de ambiente (Laravel)
Exemplo mínimo do .env:

makefile

APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:GERADO_PELO_KEY_GENERATE
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=candidates_db
DB_USERNAME=root
DB_PASSWORD=

# Para Postgres:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=candidates_db
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
🧯 Troubleshooting
CORS ao chamar /api: execute o front em localhost:4200 e o Laravel em 127.0.0.1:8000.
Se precisar, instale e configure fruitcake/laravel-cors, ou use proxy no Angular.

Busca por status não retorna: confirme que o campo status no banco está em_analise|aprovado|reprovado (sem espaço/acentos) e que o front está mapeando corretamente.

Máscara de CPF/telefone: a diretiva só formata; a validação de CPF é por regex (formato), não checagem de dígitos.

🔒 Segurança (pontos a evoluir)
Autenticação/Autorização (ex.: Laravel Sanctum)

Rate limit por IP/rota

DTO/Resources para respostas da API

Logs estruturados

Testes (Feature + E2E)