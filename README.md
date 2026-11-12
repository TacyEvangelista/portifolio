# My World — site com vídeo controlado pelo scroll

## Rodar localmente
Abra um terminal na pasta e rode:
    python3 -m http.server 8000
Acesse http://localhost:8000 (evite abrir o index.html direto com file://).

## Publicar no GitHub Pages
1. Crie um repositório e envie todos os arquivos (index.html, style.css, script.js, assets/).
2. Settings → Pages → Source: "Deploy from a branch" → branch main, pasta /(root) → Save.
3. O site ficará em https://SEU-USUARIO.github.io/NOME-DO-REPO/

## Ajustes
- Duração da rolagem: `--scroll-length` em style.css (500vh = rolagem mais curta/rápida; aumente para mais suave).
- Cor de fundo das laterais: `--bg` (hoje o marrom escuro da arte).
- Até 1024px usa `assets/my-world-mobile.mp4`; acima de 1024px usa `assets/my-world-desktop.mp4` (só um é baixado).
- A pasta `fontes/` guarda os originais e não é usada pelo site (pode ficar fora do repositório).

## Links clicáveis
Os ícones de contato do vídeo têm áreas clicáveis invisíveis (script.js → LINKS e HOTSPOTS).
Para ativar o Instagram, preencha `instagram: ''` em LINKS com o endereço do perfil.
