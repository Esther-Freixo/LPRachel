# Changelog

Mudanças notáveis do site da Professora Esther.

## [Não lançado] — refino visual, responsividade e testes

### Adicionado
- **Webfonts** (Cormorant Garamond + Inter) carregadas no `index.html`. Antes não eram incluídas e os títulos serifados caíam em Times New Roman para qualquer visitante.
- **Acessibilidade**: `prefers-reduced-motion` (desliga reveal/float/scroll suave), `:focus-visible`, `text-wrap: balance/pretty` nos títulos/parágrafos e cor de seleção.
- **Timeline da home** redesenhada (`TimelineEditorial`): linha central, marcos alternando os lados, título em destaque e data como sobrelinha, nó ativo com glow, conector e progresso na linha. Versão anterior preservada em `StickyTimelineClassic`.
- **Lab** em `/lab/timeline` (não linkado) comparando variações de design da timeline.
- **Testes**:
  - Unit (web, vitest): `getEventStatus` extraído para `src/lib/agenda.js`.
  - E2E (web, Playwright): smoke das páginas públicas (sem erro JS / sem overflow), mobile, health da API, autenticação e CRUD completo do admin.

### Corrigido
- **Hero da home**: o split de 2 colunas passou de `md` para `lg` (tablet/meia-tela ganha layout empilhado, fim do aperto) e a altura passou a seguir o conteúdo (fim do vazio em telas altas).
- **Admin**: tabelas de Publicações e Agenda viram cards empilhados no mobile (ações antes ficavam cortadas).
- **Contato**: `<select>` usa `defaultValue` em vez de `selected` no `<option>` (remove warning do React).
- **Testes da API**: isolados no banco `rachel_test` (o singleton Prisma apontava para o banco de dev, quebrando 6 asserts).

### Infra/Bug de carregamento
- `useScrollProgress` reanexa o efeito quando os dados chegam após a montagem (a timeline não aparecia quando o fetch resolvia depois do mount).
