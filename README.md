# 3 ofertas

Páginas de vendas estáticas das três ofertas, prontas para publicar na Netlify (publish directory = raiz do repositório, sem build).

| Oferta | Página de vendas | Back redirect |
|---|---|---|
| 80 Modelos de Laços Infantis | `/` | `/back/` |
| 50 Modelos de Capas de Bíblia em Tecido | `/capa-biblia/` | `/capa-biblia/back/` |
| Giradores de Vento em Crochê | `/girador-croche/` | `/girador-croche/back/` |

Upsell único dos 3 funis (Kit Divulgação da Artesã): `/upsell/`. Quem recusa vai para `/obrigado/`.

Domínio: https://superprodutos.netlify.app

Checkouts na Cakto, configurados em `assets/product-config*.js` de cada oferta. Imagens para cadastrar no painel da Cakto em `imagens-cakto/`.

## Áreas de membros (app)

| Oferta | Plano básico | Plano completo |
|---|---|---|
| Laço | `/area/laco/basico/` | `/area/laco/completo/` |
| Capa de Bíblia | `/area/capa-biblia/basico/` | `/area/capa-biblia/completo/` |
| Girador | `/area/girador/basico/` | `/area/girador/premium/` |

O conteúdo de cada área fica no `window.AREA` do `index.html` dela. Para liberar um material, cole o link (Drive, YouTube não listado etc.) no campo `"url"` da aula. Aula sem link aparece como "Liberado em breve".
