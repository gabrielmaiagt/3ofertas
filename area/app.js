// Área de membros em formato de app. O conteúdo de cada área vem de window.AREA (definido no index.html da área).
(() => {
  const A = window.AREA;
  if (!A) return;

  // Textos fixos da interface. A área escolhe o idioma em window.AREA.lang ("pt" é o padrão).
  const STRINGS = {
    pt: {
      ytModuleTitle: "Aulas complementares",
      ytModuleDesc: "Tutoriais gratuitos do YouTube selecionados para você praticar",
      channel: "Canal",
      types: { pdf: "Material", video: "Aula", yt: "Vídeo", text: "Leitura" },
      lockedMeta: "Disponível no plano completo",
      soonMeta: "Liberado em breve",
      unlock: "Desbloquear por",
      installTitle: "Instale o app",
      installText: "na tela inicial do celular para acessar com um toque.",
      installBtn: "Instalar",
      yourContent: "Seu conteúdo",
      bonus: "Bônus",
      bonusSub: "Materiais extras para produzir e vender mais.",
      noBonus: "Nenhum bônus neste plano.",
      lessonsTitle: "Aulas complementares",
      lessonsSub: "Vídeos gratuitos do YouTube, de outros criadores, que selecionamos para complementar o seu material.",
      credit: "Os vídeos pertencem aos seus respectivos canais e são exibidos pelo player oficial do YouTube.",
      help: "Ajuda",
      howTo: "Como usar esta área",
      howToItems: [
        "Toque em uma aula para assistir ou abrir o material.",
        "Marque como concluída para acompanhar seu progresso.",
        'No celular, use "Adicionar à tela inicial" para abrir como app.',
      ],
      needHelp: "Precisa de ajuda?",
      supportText: "Responda o e-mail de acesso que você recebeu após a compra e nossa equipe te ajuda.",
      supportBtn: "Falar com o suporte",
      lesson: "Aula",
      back: "Voltar",
      nav: "Navegação",
      tabs: { inicio: "Início", bonus: "Bônus", aulas: "Aulas", ajuda: "Ajuda" },
      progress: (n, t, p) => `${n} de ${t} concluídas · ${p}%`,
      ytFrom: (c) => `Vídeo do canal <strong>${c}</strong> no YouTube.`,
      soonText: "Este material está sendo preparado e será liberado em breve nesta área.",
      openMaterial: "Abrir material",
      watch: "Assistir aula",
      print: "Imprimir ou salvar em PDF",
      markDone: "Marcar como concluída",
      unmark: "Concluída ✓ (desmarcar)",
      iosHint: 'No iPhone: toque em Compartilhar e depois em "Adicionar à Tela de Início".',
    },
    es: {
      ytModuleTitle: "Clases complementarias",
      ytModuleDesc: "Tutoriales gratuitos de YouTube seleccionados para que practiques",
      channel: "Canal",
      types: { pdf: "Material", video: "Clase", yt: "Video", text: "Lectura" },
      lockedMeta: "Disponible en el plan completo",
      soonMeta: "Disponible muy pronto",
      unlock: "Desbloquear por",
      installTitle: "Instala la app",
      installText: "en la pantalla de inicio de tu celular para entrar con un toque.",
      installBtn: "Instalar",
      yourContent: "Tu contenido",
      bonus: "Bonos",
      bonusSub: "Materiales extra para producir y vender más.",
      noBonus: "No hay bonos en este plan.",
      lessonsTitle: "Clases complementarias",
      lessonsSub: "Videos gratuitos de YouTube, de otras creadoras, que seleccionamos para complementar tu material.",
      credit: "Los videos pertenecen a sus respectivos canales y se muestran con el reproductor oficial de YouTube.",
      help: "Ayuda",
      howTo: "Cómo usar esta área",
      howToItems: [
        "Toca una clase para verla o abrir el material.",
        "Márcala como terminada para seguir tu avance.",
        'En el celular, usa "Agregar a la pantalla de inicio" para abrirla como app.',
      ],
      needHelp: "¿Necesitas ayuda?",
      supportText: "Responde el correo de acceso que recibiste después de tu compra y nuestro equipo te ayuda.",
      supportBtn: "Hablar con soporte",
      lesson: "Clase",
      back: "Regresar",
      nav: "Navegación",
      tabs: { inicio: "Inicio", bonus: "Bonos", aulas: "Clases", ajuda: "Ayuda" },
      progress: (n, t, p) => `${n} de ${t} terminadas · ${p}%`,
      ytFrom: (c) => `Video del canal <strong>${c}</strong> en YouTube.`,
      soonText: "Este material se está preparando y estará disponible muy pronto en esta área.",
      openMaterial: "Abrir material",
      watch: "Ver clase",
      print: "Imprimir o guardar en PDF",
      markDone: "Marcar como terminada",
      unmark: "Terminada ✓ (desmarcar)",
      iosHint: 'En iPhone: toca Compartir y después "Agregar a pantalla de inicio".',
    },
  };
  const T = STRINGS[A.lang] || STRINGS.pt;

  const root = document.documentElement.style;
  if (A.colors) Object.entries(A.colors).forEach(([k, v]) => root.setProperty(`--${k}`, v));

  const storeKey = `area:${A.key}`;
  const load = () => { try { return JSON.parse(localStorage.getItem(storeKey) || "{}"); } catch { return {}; } };
  const save = (d) => { try { localStorage.setItem(storeKey, JSON.stringify(d)); } catch {} };
  let done = load();

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ytId = (url) => (String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];

  // Aulas do YouTube passadas em A.youtube viram um módulo próprio na aba "Aulas".
  const ytModule = A.youtube && A.youtube.length ? [{
    id: "youtube", tab: "aulas", icon: "▶️",
    title: T.ytModuleTitle,
    desc: T.ytModuleDesc,
    lessons: A.youtube.map((v, i) => ({ id: `yt-${i}`, type: "yt", yt: v.yt, title: v.title, meta: `${T.channel}: ${v.channel}`, channel: v.channel })),
  }] : [];
  const modules = [...A.modules, ...ytModule];
  const lessonsAll = modules.filter((m) => !m.locked).flatMap((m) => m.lessons);
  const byId = Object.fromEntries(modules.flatMap((m) => m.lessons.map((l) => [l.id, l])));

  const typeIcon = { pdf: "📄", video: "🎬", yt: "▶", text: "📝" };
  const typeClass = { pdf: "is-pdf", yt: "is-yt" };
  const isSoon = (l) => (l.type === "pdf" || l.type === "video") && !l.url && !l.html;

  const lessonRow = (l, locked) => `
    <button class="lesson ${done[l.id] ? "is-done" : ""} ${isSoon(l) ? "is-soon" : ""}" data-lesson="${esc(l.id)}" ${locked ? "disabled" : ""}>
      <span class="lesson__type ${typeClass[l.type] || ""}">${locked ? "🔒" : typeIcon[l.type] || "•"}</span>
      <span class="lesson__body">
        <span class="lesson__title">${esc(l.title)}</span>
        <span class="lesson__meta">${locked ? T.lockedMeta : isSoon(l) ? T.soonMeta : esc(l.meta || T.types[l.type] || "")}</span>
      </span>
      ${locked ? "" : '<span class="lesson__check">✓</span>'}
    </button>`;

  const moduleCard = (m) => `
    <article class="module ${m.locked ? "is-locked" : ""}">
      <div class="module__head">
        <div class="module__icon" aria-hidden="true">${m.icon || "📚"}</div>
        <div><h3>${esc(m.title)}</h3><p>${esc(m.desc || "")}</p></div>
      </div>
      ${m.lessons.map((l) => lessonRow(l, m.locked)).join("")}
      ${m.locked && A.upgrade ? `
        <div class="locked">
          <p>${esc(A.upgrade.text)}</p>
          <a class="button" href="${esc(A.upgrade.url)}" target="_blank" rel="noopener">${T.unlock} ${esc(A.upgrade.price)}</a>
        </div>` : ""}
    </article>`;

  const renderTab = (tab) => modules.filter((m) => (m.tab || "inicio") === tab).map(moduleCard).join("");

  document.documentElement.lang = A.lang === "es" ? "es-MX" : "pt-BR";
  document.body.innerHTML = `
    <div class="app">
      <header class="top">
        <div class="top__brand">${A.icon ? `<img src="${esc(A.icon)}" alt="">` : ""}${esc(A.brand)}</div>
        <h1>${esc(A.title)}</h1>
        <p>${esc(A.subtitle || "")}</p>
        <div class="progress">
          <div class="progress__bar"><span data-progress></span></div>
          <div class="progress__label" data-progress-label></div>
        </div>
      </header>

      <section class="view is-active" data-view="inicio">
        <div class="install" data-install>
          <p><strong>${T.installTitle}</strong> ${T.installText}</p>
          <button type="button" data-install-btn>${T.installBtn}</button>
        </div>
        <h2 class="section-title">${T.yourContent}</h2>
        ${renderTab("inicio")}
      </section>

      <section class="view" data-view="bonus">
        <h2 class="section-title">${T.bonus}</h2>
        <p class="section-sub">${T.bonusSub}</p>
        ${renderTab("bonus") || `<p class="section-sub">${T.noBonus}</p>`}
      </section>

      <section class="view" data-view="aulas">
        <h2 class="section-title">${T.lessonsTitle}</h2>
        <p class="section-sub">${T.lessonsSub}</p>
        ${renderTab("aulas")}
        <p class="credit">${T.credit}</p>
      </section>

      <section class="view" data-view="ajuda">
        <h2 class="section-title">${T.help}</h2>
        <div class="help">
          <h3>${T.howTo}</h3>
          <ul>${T.howToItems.map((i) => `<li>${i}</li>`).join("")}</ul>
          <h3>${T.needHelp}</h3>
          <p>${esc(A.supportText || T.supportText)}</p>
          ${A.supportUrl ? `<a class="button" href="${esc(A.supportUrl)}" target="_blank" rel="noopener">${T.supportBtn}</a>` : ""}
        </div>
      </section>
    </div>

    <div class="player" data-player role="dialog" aria-modal="true" aria-label="${T.lesson}">
      <div class="player__bar">
        <button type="button" data-close aria-label="${T.back}">←</button>
        <h2 data-player-title></h2>
      </div>
      <div class="player__body" data-player-body></div>
    </div>

    <nav class="tabbar" aria-label="${T.nav}">
      <div class="tabbar__inner">
        <button class="tab is-active" data-tab="inicio"><span>🏠</span>${T.tabs.inicio}</button>
        <button class="tab" data-tab="bonus"><span>🎁</span>${T.tabs.bonus}</button>
        <button class="tab" data-tab="aulas"><span>▶️</span>${T.tabs.aulas}</button>
        <button class="tab" data-tab="ajuda"><span>💬</span>${T.tabs.ajuda}</button>
      </div>
    </nav>`;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const updateProgress = () => {
    const total = lessonsAll.length;
    const n = lessonsAll.filter((l) => done[l.id]).length;
    const pct = total ? Math.round((n / total) * 100) : 0;
    $("[data-progress]").style.width = `${pct}%`;
    $("[data-progress-label]").textContent = T.progress(n, total, pct);
    $$("[data-lesson]").forEach((b) => b.classList.toggle("is-done", !!done[b.dataset.lesson]));
  };

  const showTab = (tab) => {
    $$(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === tab));
    $$(".view").forEach((v) => v.classList.toggle("is-active", v.dataset.view === tab));
    scrollTo(0, 0);
  };
  $$(".tab").forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));

  const player = $("[data-player]");
  const closePlayer = () => {
    player.classList.remove("is-open");
    $("[data-player-body]").innerHTML = "";
    document.body.style.overflow = "";
  };
  $("[data-close]").addEventListener("click", closePlayer);

  const openLesson = (l) => {
    const yt = l.type === "yt" ? l.yt : ytId(l.url || "");
    let media = "";
    if (yt) {
      media = `<div class="player__frame"><iframe src="https://www.youtube-nocookie.com/embed/${esc(yt)}?rel=0" title="${esc(l.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    let text = l.text ? `<p class="player__text">${esc(l.text)}</p>` : "";
    if (l.html) text += `<article class="article">${l.html}</article>`;
    if (l.type === "yt") text += `<p class="player__text">${T.ytFrom(esc(l.channel))}</p>`;
    let actions = "";
    if (isSoon(l)) {
      actions += `<p class="player__text">${T.soonText}</p>`;
    } else if (l.url && !yt) {
      actions += `<a class="button" href="${esc(l.url)}" target="_blank" rel="noopener">${l.type === "pdf" ? T.openMaterial : T.watch}</a>`;
    }
    if (l.html) {
      actions += `<button class="button button--ghost" type="button" onclick="window.print()">${T.print}</button>`;
    }
    if (!isSoon(l)) {
      actions += `<button class="button ${done[l.id] ? "button--ghost" : ""}" type="button" data-done>${done[l.id] ? T.unmark : T.markDone}</button>`;
    }
    $("[data-player-title]").textContent = l.title;
    $("[data-player-body]").innerHTML = `${media}${text}<div class="player__actions">${actions}</div>`;
    const btn = $("[data-done]");
    if (btn) btn.addEventListener("click", () => {
      done[l.id] ? delete done[l.id] : (done[l.id] = Date.now());
      save(done);
      updateProgress();
      closePlayer();
    });
    player.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lesson]");
    if (b && !b.disabled) openLesson(byId[b.dataset.lesson]);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closePlayer(); });

  // Instalação como app (Android/Chrome) e dica para iPhone.
  let deferred;
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    $("[data-install]").classList.add("is-visible");
  });
  $("[data-install-btn]").addEventListener("click", async () => {
    if (deferred) { deferred.prompt(); deferred = null; $("[data-install]").classList.remove("is-visible"); return; }
    alert(T.iosHint);
  });
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !navigator.standalone;
  if (ios) $("[data-install]").classList.add("is-visible");

  // Sem módulos na aba "Aulas", a aba some e as outras se reorganizam.
  if (!modules.some((m) => m.tab === "aulas")) {
    $('[data-tab="aulas"]').remove();
    $('[data-view="aulas"]').remove();
    $(".tabbar__inner").style.gridTemplateColumns = "repeat(3, 1fr)";
  }

  updateProgress();
})();
