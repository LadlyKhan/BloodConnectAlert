/* BloodConnect Alert: shared page shell (demo banner, header, mobile tab bar).
   Usage on any page, after the Tailwind scripts:
     <script src="js/layout.js"></script>
     <script>BC.renderShell({ role: "donor", page: "donor-home", userName: "Tanvir Ahmed" });</script>
   Links follow the approved navigation (Day 1 handoff, section 6) and page map (section 5).
   Pages that do not exist yet will show "not found" until they are built. */
(function () {
  window.BC = window.BC || {};

  // Each link: [page key, label, Font Awesome icon]. A key may end in #section.
  const NAV = {
    donor: { home: "donor-home", main: [
      ["donor-home", "Home", "fa-house"], ["donor-alerts", "Alerts", "fa-bell"],
      ["donor-profile", "Profile", "fa-user"], ["donor-history", "History", "fa-clock-rotate-left"]] },
    requester: { home: "requester-home", main: [
      ["requester-home", "Home", "fa-house"], ["request-new", "New request", "fa-circle-plus"],
      ["requester-home#my", "My requests", "fa-list"]] },
    verifier: { home: "verifier-home", main: [
      ["verifier-home", "Queue", "fa-inbox"], ["verifier-home#active", "Active requests", "fa-list-check"],
      ["matching", "Matching", "fa-users"], ["shortage-dashboard", "Dashboard", "fa-chart-column"]] },
    hospital: { home: "hospital-home", main: [
      ["hospital-home", "Home", "fa-house"], ["stock-search", "Stock search", "fa-magnifying-glass"],
      ["inquiry-history", "Inquiries", "fa-comments"]] },
    bank: { home: "bank-home", main: [
      ["bank-home", "Home", "fa-house"], ["donations", "Donations", "fa-droplet"],
      ["inventory", "Inventory", "fa-box-archive"], ["inquiry-inbox", "Inquiries", "fa-envelope-open-text"]],
      more: [["thresholds", "Thresholds", "fa-sliders"], ["shortage-dashboard", "Dashboard", "fa-chart-column"]] },
    admin: { home: "admin-home", main: [
      ["admin-home", "Home", "fa-house"], ["users", "Users", "fa-users"],
      ["facilities", "Facilities", "fa-hospital"], ["audit-log", "Audit", "fa-clipboard-list"]],
      more: [["configuration", "Configuration", "fa-gear"], ["shortage-dashboard", "Dashboard", "fa-chart-column"]] }
  };
  const ROLE_LABEL = { donor: "Donor", requester: "Requester", verifier: "Verifier",
    hospital: "Hospital", bank: "Blood Bank", admin: "Admin" };

  const href = (key) => key.includes("#") ? key.replace("#", ".html#") : key + ".html";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const RING = "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-1";

  BC.renderShell = function (opts) {
    const role = opts.role, cfg = NAV[role], page = opts.page || "";
    const userName = opts.userName || "Demo User";
    const homeHref = cfg ? href(cfg.home) : "index.html";
    const main = cfg ? cfg.main : [];
    const more = (cfg && cfg.more) || [];

    const deskLink = ([key, label, icon]) => {
      const active = key === page;
      return `<a href="${href(key)}" ${active ? 'aria-current="page"' : ""} class="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${RING} ${active ? "text-brand-800 bg-brand-50" : "text-slate-700 hover:bg-slate-100"}"><i class="fa-solid ${icon} text-xs" aria-hidden="true"></i>${esc(label)}</a>`;
    };
    const menuLink = ([key, label, icon]) => {
      const active = key === page;
      return `<a href="${href(key)}" ${active ? 'aria-current="page"' : ""} class="flex items-center gap-2 px-4 py-2.5 text-sm ${active ? "text-brand-800 bg-brand-50 font-semibold" : "text-slate-700 hover:bg-slate-50"} ${RING}"><i class="fa-solid ${icon} w-4 text-center" aria-hidden="true"></i>${esc(label)}</a>`;
    };
    const tabLink = ([key, label, icon]) => {
      const active = key === page;
      return `<a href="${href(key)}" ${active ? 'aria-current="page"' : ""} class="flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[11px] font-medium ${active ? "text-brand-800" : "text-slate-500"} ${RING}"><i class="fa-solid ${icon} text-lg" aria-hidden="true"></i><span>${esc(label)}</span></a>`;
    };

    const moreDesktop = more.length ? `
      <div class="relative">
        <button type="button" id="bc-more-btn" aria-expanded="false" aria-controls="bc-more-menu" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-all ${RING}">
          <i class="fa-solid fa-ellipsis text-xs" aria-hidden="true"></i>More<i class="fa-solid fa-chevron-down text-[10px]" aria-hidden="true"></i></button>
        <div id="bc-more-menu" hidden class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">${more.map(menuLink).join("")}</div>
      </div>` : "";

    const moreMobile = more.length ? `
      <button type="button" id="bc-more-btn-m" aria-expanded="false" aria-controls="bc-more-sheet" class="flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[11px] font-medium text-slate-500 ${RING}">
        <i class="fa-solid fa-ellipsis text-lg" aria-hidden="true"></i><span>More</span></button>` : "";
    const sheet = more.length ? `
      <div id="bc-more-sheet" hidden class="lg:hidden fixed bottom-[57px] right-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">${more.map(menuLink).join("")}</div>` : "";

    const banner = `
      <div class="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm font-medium" role="note">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div class="flex items-center gap-2"><i class="fa-solid fa-triangle-exclamation text-amber-600 flex-shrink-0" aria-hidden="true"></i>
            <span><strong>Simulated demonstration platform.</strong> Reported availability is not a reservation. No medical decisions or screening are made here. SMS and email are simulated.</span></div>
          <span class="bg-amber-200/60 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold whitespace-nowrap">Demo data</span>
        </div>
      </div>`;

    const header = `
      <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <a href="${homeHref}" class="flex items-center gap-2.5 group ${RING} rounded-lg" aria-label="BloodConnect Alert home">
              <div class="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center shadow-md shadow-brand-800/20 group-hover:bg-brand-900 transition-colors"><i class="fa-solid fa-heart-pulse text-xl" aria-hidden="true"></i></div>
              <div><span class="text-xl font-bold font-heading text-slate-900 leading-none block">BloodConnect<span class="text-brand-800">Alert</span></span>
                <span class="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wide uppercase">Emergency Coordination</span></div>
            </a>
            <nav class="hidden lg:flex items-center space-x-1" aria-label="Main navigation">${main.map(deskLink).join("")}${moreDesktop}</nav>
            <div class="flex items-center gap-3">
              <button type="button" aria-label="Notifications" class="relative w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center ${RING}"><i class="fa-regular fa-bell" aria-hidden="true"></i></button>
              <div class="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div class="w-9 h-9 rounded-full bg-brand-100 text-brand-800 text-sm font-bold flex items-center justify-center" aria-hidden="true">${esc(initials(userName))}</div>
                <div class="hidden md:block leading-tight"><div class="text-sm font-semibold text-slate-900" id="bc-user-name"></div><div class="text-xs text-slate-500">${esc(ROLE_LABEL[role] || "Visitor")}</div></div>
              </div>
            </div>
          </div>
        </div>
      </header>`;

    const tabbar = main.length ? `
      <nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-1px_4px_rgba(15,23,42,0.06)]" aria-label="Main navigation">
        <div class="grid" style="grid-template-columns: repeat(${main.length + (more.length ? 1 : 0)}, minmax(0, 1fr))">${main.map(tabLink).join("")}${moreMobile}</div>
      </nav>${sheet}` : "";

    document.body.insertAdjacentHTML("afterbegin", banner + header);
    document.body.insertAdjacentHTML("beforeend", tabbar);
    document.getElementById("bc-user-name").textContent = userName;   // safe: no HTML injection
    if (main.length) document.body.classList.add("pb-20", "lg:pb-0"); // room for the tab bar

    // "More" menus: open/close, Escape, click outside
    [["bc-more-btn", "bc-more-menu"], ["bc-more-btn-m", "bc-more-sheet"]].forEach(([b, m]) => {
      const btn = document.getElementById(b), menu = document.getElementById(m);
      if (!btn || !menu) return;
      const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
      btn.addEventListener("click", (e) => { e.stopPropagation(); const open = menu.hidden; menu.hidden = !open; btn.setAttribute("aria-expanded", String(open)); });
      document.addEventListener("click", close);
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); btn.focus(); } });
    });
  };
})();