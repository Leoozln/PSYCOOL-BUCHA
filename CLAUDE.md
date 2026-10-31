# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PsyCool is an academic project: a web platform connecting patients and psychologists (scheduling, professional profiles, payments). It is a monorepo with two independent apps and no root `package.json`:

- `backend/` — Node.js (CommonJS) + Express 5 + Sequelize 6 on PostgreSQL
- `frontend/` — React 19 + Vite + react-router-dom 7 (ESM)

UI text, API error messages, identifiers and commit messages are in Portuguese; keep that convention.

## Commands

Backend (no npm scripts exist; `npm test` is a placeholder that fails):

```bash
cd backend && npm install
node src/index.js            # API on http://localhost:3000; Swagger UI at /swagger
```

Frontend:

```bash
cd frontend && npm install
npm run dev                  # Vite dev server on http://localhost:5173
npm run build
npm run lint                 # eslint .
```

There is no test suite in either app (`frontend/docs/*.md` are empty placeholders). The root `README.md` is outdated on setup: it says to run `npm install` and `node index.js` from the root, but dependencies live in `backend/package.json` and the entrypoint is `backend/src/index.js`.

## Environment and database

- The backend loads `.env` from the **repo root** (`backend/src/index.js` resolves `../../.env`), not from `backend/`. It is gitignored and must define `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`. There is no `.env.example` yet.
- `backend/src/config/database.js` (Sequelize) always connects with SSL (`rejectUnauthorized: false`) because the team shares one **Supabase** database (see `docs/guia-supabase-psycool.md`). Everyone sees the same data, so avoid bulk `UPDATE`/`DELETE`. Connection errors can echo `.env` contents — redact before pasting them anywhere.
- `backend/src/db.js` is a separate raw `pg` Pool with hard-coded local credentials. It is `require`d in `index.js` but no controller uses it; Sequelize is the real data path.
- The schema is **not** managed by Sequelize (no `sync`/migrations). It lives in the database, defined by `backend/src/db/psycool_banco.sql`, which despite the extension is a binary `pg_dump` custom-format archive (`PGDMP`) — restore with `pg_restore`, don't try to read or edit it as text.
- The database contains logic that the Node code relies on or ignores:
  - Trigger `trigger_criptografar_senha_usuario` bcrypt-hashes `usuario.senha_usuario` on INSERT/UPDATE (skips values already starting with `$2a$`/`$2b$`). **Pass plaintext passwords to `Usuario.create/update`; do not hash in Node.**
  - Functions `autenticar_usuario`, `cadastrar_empresa`, `validar_convenio_cliente` exist but are not called from the backend yet (no login endpoint exists).

## Backend architecture

Request flow is routes → controllers → models, in numbered folders under `backend/src/`: `1models/`, `2controllers/`, `3routes/`.

- `1models/index.js` is the single place where **all associations are declared**. Controllers must import models from `'../1models'` (the index), never from an individual model file, otherwise associations aren't registered.
- Foreign-key column names are non-standard and domain-specific (e.g. `id_cliente_consultado`, `id_psicologo_responsavel`, `convenio_cliente`, `avaliacao_psicologo`); check `1models/index.js` before writing includes. Models use `timestamps: false` and explicit `tableName`.
- `Psicologo` shares its primary key with `Usuario` (`id_psicologo` = `usuario.id_usuario`, `tipo_usuario: 'Psicologo'`). `psicologoController.inserir` creates both rows inside one `sequelize.transaction`; follow that pattern for other user-backed entities (`Cliente`, `Empresa`).
- Each entity has the same 5-handler CRUD controller (`listar`, `buscar`, `inserir`, `atualizar`, `excluir`) with a repeated try/catch that logs and returns `500 { erro: message }`; missing records return `404 { erro: '... não encontrado!' }`. Routes are mounted in `src/index.js` as `/usuario`, `/cliente`, `/psicologo`, `/empresa`, `/agenda`, `/anotacao`, `/avaliacao`, `/consulta`, `/pagamento`.
- Adding an entity means: model → register + associate in `1models/index.js` → controller → route file → `app.use(...)` in `src/index.js`.
- Swagger: `swagger/swagger.js` builds the OpenAPI object by hand-spreading `paths` from per-entity files. Only `usuarioSwagger.js` is wired in (the variable is misleadingly named `cargoSwagger`); other entities are undocumented.
- CORS allows only `http://localhost:5173`. Express also serves the raw `frontend/` directory statically (source files, not the Vite build).

## Frontend architecture

- Layout: `src/components/<Name>/<Name>.jsx` + `.css`, `src/pages/<Name>/<Name>.jsx` + `.css`, routed with `BrowserRouter` in `src/App.jsx`. Most components and pages are still empty stubs (e.g. `Home`, `CadastroEmpresa`, `Button`, `Card`); `Button`'s files are spelled `Buton.*`.
- `src/App.jsx` is a work in progress and does not currently run as-is: it uses `Header`, `Footer`, `Home`, `Pessoas`, `Cargos` without importing them (template leftovers), and imports `./pages/CadastroPsicologo` as a directory although that folder has no `index` file. Fix imports/routes before expecting the app to render.
- The only implemented feature is `pages/CadastroPsicologo/CadastroPsicologo.jsx`: a registration form with CRP/phone masks that POSTs to a hard-coded `http://localhost:3000/psicologo` using the backend field names (`nome_psicologo`, `email_usuario`, `senha_usuario`, `crp_psicologo`, …). `frontend/script_cadastro-psicologo.js` and `frontend/backup-original/` are the earlier vanilla-JS version of the same page.
- ESLint uses the flat config in `frontend/eslint.config.js` (js recommended + react-hooks + react-refresh).

## Workflow

Work happens on `branch_<name>` branches merged into `main` through pull requests; `.github/CODEOWNERS` assigns everything to `@Leoozln`. Commits use a conventional prefix with a Portuguese message (e.g. `docs: ...`, `fix: ...`).
