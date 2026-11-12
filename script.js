(() => {
  const video = document.getElementById('vid');
  const track = document.getElementById('track');
  const hint = document.getElementById('hint');
  const bar = document.querySelector('#progress span');

  // Até 1024px (celulares e tablets): vídeo vertical. Acima de 1024px: vídeo horizontal.
  const SOURCES = {
    mobile:  { src: 'assets/my-world-mobile.mp4',  poster: 'assets/poster.jpg', w: 390,  h: 844,  showAt: 1.4 },
    desktop: { src: 'assets/my-world-desktop.mp4', poster: '',                  w: 1920, h: 1080, showAt: 11.0 }
  };

  // Links reais. Deixe '' para não criar a área clicável daquele ícone.
  const LINKS = {
    instagram: '',   // <- falta o link do Instagram
    linkedin:  'https://www.linkedin.com/in/tacyalmeida/',
    email:     'mailto:ta7478421@gmail.com'
  };

  // Caixas clicáveis em pixels do vídeo (x, y, largura, altura), medidas no quadro final de cada vídeo.
  // Nos dois vídeos os ícones ficam parados depois que aparecem (showAt = segundo em que já estão visíveis).
  const HOTSPOTS = {
    mobile: [
      { id: 'instagram', label: 'Instagram', box: [44, 574, 44, 45] },
      { id: 'linkedin',  label: 'LinkedIn',  box: [44, 628, 44, 44] },
      { id: 'email',     label: 'E-mail',    box: [44, 684, 44, 44] }
    ],
    desktop: [
      { id: 'instagram', label: 'Instagram', box: [140, 274, 114, 118] },
      { id: 'linkedin',  label: 'LinkedIn',  box: [110, 518, 114, 118] },
      { id: 'email',     label: 'E-mail',    box: [125, 680, 127, 132] }
    ]
  };
  const stage = document.getElementById('stage');
  const hot = document.getElementById('hotspots');
  const mq = window.matchMedia('(min-width: 1025px)');
  const modeNow = () => (mq.matches ? 'desktop' : 'mobile');

  let mode = null, duration = 0, target = 0, current = 0, ticking = false, lastSet = -1;

  const progress = () => {
    const max = track.offsetHeight - window.innerHeight;
    const top = -track.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, max > 0 ? top / max : 0));
  };

  const onScroll = () => {
    const p = progress();
    target = p * duration;                       // currentTime = scrollProgress * duration
    bar.style.width = (p * 100) + '%';
    hint.classList.toggle('hide', p > 0.02);
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  // Posiciona a camada de áreas clicáveis exatamente sobre a imagem do vídeo (object-fit: contain).
  const layoutHotspots = () => {
    if (!mode) return;
    const { w, h } = SOURCES[mode];
    const sw = stage.clientWidth, sh = stage.clientHeight;
    const k = Math.min(sw / w, sh / h);
    hot.style.width = (w * k) + 'px';
    hot.style.height = (h * k) + 'px';
    hot.style.left = ((sw - w * k) / 2) + 'px';
    hot.style.top = ((sh - h * k) / 2) + 'px';
  };

  const renderHotspots = () => {
    hot.textContent = '';
    const { w, h } = SOURCES[mode];
    HOTSPOTS[mode].forEach(({ id, label, box: [x, y, bw, bh] }) => {
      const href = LINKS[id];
      if (!href) return;
      const a = document.createElement('a');
      a.href = href;
      a.setAttribute('aria-label', label);
      if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      a.style.cssText = `left:${x / w * 100}%;top:${y / h * 100}%;width:${bw / w * 100}%;height:${bh / h * 100}%`;
      hot.appendChild(a);
    });
    layoutHotspots();
  };

  // Só aceita cliques quando o ícone já apareceu no vídeo.
  const syncHotspots = () => {
    hot.classList.toggle('on', !!mode && duration > 0 && current >= SOURCES[mode].showAt);
  };

  const update = () => {
    current += (target - current) * 0.2;
    if (Math.abs(target - current) < 0.001) current = target;
    syncHotspots();
    if (duration && Math.abs(current - lastSet) > 1 / 60 && video.readyState >= 1) {
      video.currentTime = current; lastSet = current;
    }
    if (current !== target) requestAnimationFrame(update); else ticking = false;
  };

  // Define o src somente do vídeo do modo atual; não faz nada se o modo não mudou.
  const selectSource = () => {
    const next = modeNow();
    if (next === mode) return;
    mode = next;
    duration = 0; lastSet = -1; current = 0;
    video.pause();
    video.removeAttribute('src');
    video.load();                                // cancela o download anterior
    if (SOURCES[mode].poster) video.poster = SOURCES[mode].poster;
    else video.removeAttribute('poster');
    video.src = SOURCES[mode].src;
    video.load();
    hot.classList.remove('on');
    renderHotspots();
  };

  // Só atualiza currentTime depois dos metadados; recalcula duração e sincroniza com o scroll atual.
  video.addEventListener('loadedmetadata', () => {
    duration = video.duration || 0;
    video.pause();
    current = progress() * duration;
    lastSet = -1;
    layoutHotspots();
    onScroll();
    syncHotspots();
  });

  mq.addEventListener('change', selectSource);   // troca só ao cruzar 1024px/1025px
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { layoutHotspots(); onScroll(); });

  // iOS/Safari: "destrava" o vídeo no primeiro toque
  window.addEventListener('touchstart', () => {
    video.play().then(() => video.pause()).catch(() => {});
  }, { once: true, passive: true });

  selectSource();
})();
