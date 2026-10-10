# cassiopereira.com.br

Landing page estática pessoal (HTML + CSS puro, sem framework).

## Estrutura

| Arquivo | Papel |
|---|---|
| `index.html` | Fonte com placeholders `__TELEFONE_PRINCIPAL__` |
| `style.css` | Estilos |
| `.env` | `TELEFONE_PRINCIPAL` (local, **não** commitado) |
| `build.mjs` | Injeta o telefone do `.env` e gera `public/` |
| `public/` | Versão pronta para produção (**commitada**) |
| `update.sh` | Roda no droplet: `git pull` + copia `public/` → site servido |

## Fluxo de atualização

1. **No PC:** edite `index.html` / `style.css`
2. **No PC:** `node build.mjs`
3. **No PC:** `git add -A && git commit -m "..." && git push`
4. **No droplet:** `bash /opt/saas/projetos/cassiopereira/repo/update.sh`

O droplet **não precisa de Node** — o build acontece no PC; o `public/`
contém o HTML final com o telefone já injetado.

## Deploy inicial (quando o repo ainda não está no droplet)

```bash
cd /opt/saas/projetos/cassiopereira
git clone https://github.com/cassiogpereira/cassiopereira.git repo
bash repo/update.sh
```
