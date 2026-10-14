(() => {
  const dateNode = document.querySelector("[data-current-date]");
  if (!dateNode) return;

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  let displayedDate = "";

  const updateDate = () => {
    const today = formatter.format(new Date());
    if (today === displayedDate) return;
    dateNode.textContent = ` — ${today}`;
    displayedDate = today;
  };

  updateDate();
  // Atualiza na virada do dia, inclusive ao voltar a uma aba suspensa.
  window.setInterval(updateDate, 1000);
  window.addEventListener("pageshow", updateDate);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateDate();
  });
})();
