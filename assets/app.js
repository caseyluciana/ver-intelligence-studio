(function () {
  var data = window.VER_DATA || {};
  var accentMap = {
    green: "#14895a",
    amber: "#b7791f",
    red: "#c2412d",
    blue: "#4f46e5",
    gray: "#667085"
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function money(value) {
    return "$" + Number(value || 0).toFixed(1) + "M";
  }

  function pct(value, max) {
    if (!max) return 0;
    return Math.max(3, Math.min(100, Math.round((value / max) * 100)));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setActiveNav(page) {
    all("[data-nav]").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-nav") === page);
    });
  }

  function initialsChip(item) {
    var color = accentMap[item.status] || "#087f7a";
    return '<div class="logo-chip" style="--accent:' + color + '">' + escapeHtml(item.initials || item.vendor.slice(0, 2)) + "</div>";
  }

  function badgeClass(status) {
    if (status === "Urgent" || status === "Critical" || status === "Action Required") return "red";
    if (status === "Watch" || status === "Monitor" || status === "Planning") return "amber";
    if (status === "Healthy" || status === "Long Range") return "green";
    return "blue";
  }

  function renderKpis(container, items) {
    if (!container) return;
    container.innerHTML = items.map(function (item) {
      return '<article class="kpi-card" style="--accent:' + item.color + '">' +
        '<span>' + escapeHtml(item.label) + '</span>' +
        '<strong>' + escapeHtml(item.value) + '</strong>' +
        '<p>' + escapeHtml(item.note) + '</p>' +
      '</article>';
    }).join("");
  }

  function portfolioMetrics() {
    var contracted = data.pillars.reduce(function (sum, p) { return sum + p.spend; }, 0);
    var hidden = data.pillars.reduce(function (sum, p) { return sum + p.hidden; }, 0);
    var activeSpend = data.engagements.reduce(function (sum, e) { return sum + e.spend; }, 0);
    var urgent = data.renewals.filter(function (r) { return r.filterGroup === "urgent" || r.filterGroup === "critical"; }).length;
    return { contracted: contracted, hidden: hidden, activeSpend: activeSpend, urgent: urgent };
  }

  function renderHome() {
    var m = portfolioMetrics();
    renderKpis($("#home-kpis"), [
      { label: "Contracted Portfolio", value: money(m.contracted), note: "Across nine DET pillars", color: "#087f7a" },
      { label: "Hidden Cost Exposure", value: money(m.hidden), note: "Benchmark-modeled estimate", color: "#d95f4b" },
      { label: "Active Engagements", value: data.engagements.length, note: money(m.activeSpend) + " in visible work", color: "#4f46e5" },
      { label: "Renewal Pressure", value: m.urgent, note: "Urgent or critical decisions", color: "#b7791f" }
    ]);

    var health = 82;
    var hScore = $("#home-health-score");
    var hBar = $("#home-health-bar");
    if (hScore) hScore.textContent = health + "%";
    if (hBar) hBar.style.width = health + "%";

    var spotlight = $("#home-spotlight");
    if (spotlight) {
      spotlight.innerHTML = data.engagements.slice(0, 4).map(function (e) {
        return '<a class="mini-row" href="page_exec.html#' + escapeHtml(e.id) + '">' +
          initialsChip(e) +
          '<div><h4>' + escapeHtml(e.vendor) + '</h4><p>' + escapeHtml(e.name) + '</p></div>' +
          '<span class="badge ' + e.status + '">' + escapeHtml(e.value) + '</span>' +
        '</a>';
      }).join("");
    }

    var teaser = $("#renewal-teaser");
    if (teaser) {
      teaser.innerHTML = data.renewals.slice().sort(function (a, b) { return a.days - b.days; }).slice(0, 4).map(function (r) {
        return '<a class="mini-row" href="page_renewal.html#' + escapeHtml(r.id) + '">' +
          '<div class="logo-chip" style="--accent:#087f7a">' + escapeHtml(r.initials) + '</div>' +
          '<div><h4>' + escapeHtml(r.vendor) + '</h4><p>' + escapeHtml(r.days) + ' days - ' + escapeHtml(r.category) + '</p></div>' +
          '<span class="badge ' + badgeClass(r.status) + '">' + escapeHtml(r.status) + '</span>' +
        '</a>';
      }).join("");
    }

    renderPortfolioBars($("#portfolio-bars"));
  }

  function renderPortfolioBars(container) {
    if (!container) return;
    var maxSpend = Math.max.apply(null, data.pillars.map(function (p) { return p.spend; }));
    container.innerHTML = data.pillars.map(function (p) {
      return '<div class="bar-row">' +
        '<strong>' + escapeHtml(p.name) + '</strong>' +
        '<div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--pct:' + pct(p.spend, maxSpend) + '%;--bar-color:' + p.color + '"></div></div>' +
        '<span>' + money(p.spend) + '</span>' +
        '<span>' + escapeHtml(p.risk) + '</span>' +
      '</div>';
    }).join("");
  }

  function renderExec() {
    var m = portfolioMetrics();
    renderKpis($("#exec-kpis"), [
      { label: "Visible TCO", value: money(m.contracted + m.hidden), note: "Contracted plus modeled hidden cost", color: "#087f7a" },
      { label: "Hidden Cost", value: money(m.hidden), note: "Implementation, support, admin, and transition load", color: "#d95f4b" },
      { label: "Savings Story", value: "$9.0M", note: "NTT and Cognizant gains ready for leadership", color: "#14895a" },
      { label: "Risk Queue", value: m.urgent, note: "Urgent or critical renewal actions", color: "#b7791f" }
    ]);

    var pillarStrip = $("#pillar-strip");
    if (pillarStrip) {
      pillarStrip.innerHTML = data.pillars.map(function (p) {
        return '<article class="pillar-card" style="--accent:' + p.color + '">' +
          '<div class="card-topline"><h4>' + escapeHtml(p.name) + '</h4><span class="badge gray">' + escapeHtml(p.risk) + '</span></div>' +
          '<div class="card-meta"><span>' + money(p.spend) + ' spend</span><span>' + money(p.hidden) + ' hidden</span></div>' +
        '</article>';
      }).join("");
    }

    var grid = $("#exec-engagements");
    if (!grid) return;
    grid.innerHTML = data.engagements.map(function (e) {
      return '<article id="' + escapeHtml(e.id) + '" class="eng-card" style="--accent:' + (accentMap[e.status] || "#087f7a") + '">' +
        '<div class="card-topline">' +
          '<div style="display:flex;gap:12px;align-items:start">' + initialsChip(e) +
            '<div><h4>' + escapeHtml(e.vendor) + '</h4><p>' + escapeHtml(e.name) + '</p></div>' +
          '</div>' +
          '<span class="badge ' + e.status + '">' + escapeHtml(e.statusLabel) + '</span>' +
        '</div>' +
        '<div class="card-meta"><span>' + escapeHtml(e.value) + '</span><span>' + escapeHtml(e.pillar) + '</span><span>' + escapeHtml(e.expiry) + '</span></div>' +
        '<p>' + escapeHtml(e.detail) + '</p>' +
        '<div class="card-button-row"><button class="ghost-btn" type="button" data-modal="engagement" data-id="' + escapeHtml(e.id) + '">View Detail</button></div>' +
      '</article>';
    }).join("");
  }

  function renderRenewals(filter) {
    var selected = filter || "all";
    var list = $("#renewal-list");
    var count = $("#renewal-count");
    var urgentCount = $("#renewal-urgent-count");
    if (urgentCount) {
      urgentCount.textContent = data.renewals.filter(function (r) { return r.filterGroup === "urgent"; }).length + " urgent";
    }
    if (!list) return;

    var items = data.renewals.slice().sort(function (a, b) { return a.days - b.days; });
    if (selected !== "all") {
      items = items.filter(function (r) { return r.filterGroup === selected; });
    }
    if (count) count.textContent = items.length + " renewals";

    list.innerHTML = items.map(function (r) {
      return '<article id="' + escapeHtml(r.id) + '" class="renewal-card" style="--accent:' + (r.filterGroup === "urgent" ? "#c2412d" : r.filterGroup === "critical" ? "#b7791f" : "#087f7a") + '">' +
        '<div class="card-topline">' +
          '<div style="display:flex;gap:12px;align-items:start"><div class="logo-chip" style="--accent:#087f7a">' + escapeHtml(r.initials) + '</div>' +
          '<div><h4>' + escapeHtml(r.vendor) + '</h4><p>' + escapeHtml(r.category) + ' - ' + escapeHtml(r.pillar) + '</p></div></div>' +
          '<span class="badge ' + badgeClass(r.status) + '">' + escapeHtml(r.status) + '</span>' +
        '</div>' +
        '<div class="card-meta"><span>' + escapeHtml(r.days) + ' days</span><span>' + money(r.value) + '</span><span>' + escapeHtml(r.date) + '</span></div>' +
        '<p>' + escapeHtml(r.action) + '</p>' +
        '<div class="card-button-row"><button class="ghost-btn" type="button" data-modal="renewal" data-id="' + escapeHtml(r.id) + '">View Detail</button></div>' +
      '</article>';
    }).join("");
  }

  function renderGovernance() {
    var score = 78;
    var scoreEl = $("#governance-health-score");
    var barEl = $("#governance-health-bar");
    if (scoreEl) scoreEl.textContent = score + "%";
    if (barEl) {
      barEl.style.width = score + "%";
      barEl.style.background = score >= 80 ? "#34d399" : score >= 65 ? "#fbbf24" : "#fb7185";
    }

    renderKpis($("#governance-kpis"), [
      { label: "Governed Spend", value: money(data.governance.reduce(function (sum, g) { return sum + g.spend; }, 0)), note: "Across SOW-visible queue", color: "#087f7a" },
      { label: "CQBR Queue", value: data.governance.length, note: "Engagements under review", color: "#4f46e5" },
      { label: "Watch Items", value: data.governance.filter(function (g) { return g.status !== "Healthy"; }).length, note: "Needs follow-through", color: "#b7791f" },
      { label: "Healthy Pattern", value: "1", note: "Ready for repeatable story", color: "#14895a" }
    ]);

    var list = $("#governance-list");
    if (!list) return;
    list.innerHTML = data.governance.map(function (g) {
      return '<article id="' + escapeHtml(g.id) + '" class="governance-card" style="--accent:' + (g.status === "Healthy" ? "#14895a" : "#b7791f") + '">' +
        '<div class="card-topline">' +
          '<div style="display:flex;gap:12px;align-items:start"><div class="logo-chip" style="--accent:#4f46e5">' + escapeHtml(g.initials) + '</div>' +
          '<div><h4>' + escapeHtml(g.vendor) + '</h4><p>' + escapeHtml(g.engagement) + '</p></div></div>' +
          '<span class="badge ' + badgeClass(g.status) + '">' + escapeHtml(g.status) + '</span>' +
        '</div>' +
        '<div class="card-meta"><span>' + money(g.spend) + '</span><span>Last CQBR ' + escapeHtml(g.lastCqbr) + '</span><span>Release ' + escapeHtml(g.nextRelease) + '</span></div>' +
        '<p>' + escapeHtml(g.slaNote) + '</p>' +
        '<div class="card-button-row"><button class="ghost-btn" type="button" data-modal="governance" data-id="' + escapeHtml(g.id) + '">View Detail</button></div>' +
      '</article>';
    }).join("");
  }

  function metricTiles(items) {
    return '<div class="metric-grid two-col">' + items.map(function (item) {
      return '<div class="metric-tile"><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function openModal(title, subtitle, initials, color, body, footer) {
    var root = $("#modal-root");
    if (!root) return;
    root.innerHTML = '<div class="modal-backdrop" role="presentation">' +
      '<section class="modal-dialog" role="dialog" aria-modal="true" aria-label="' + escapeHtml(title) + '">' +
        '<header class="modal-header">' +
          '<div class="logo-chip" style="--accent:' + color + '">' + escapeHtml(initials) + '</div>' +
          '<div><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(subtitle) + '</p></div>' +
          '<button class="icon-btn" type="button" data-close-modal aria-label="Close detail">X</button>' +
        '</header>' +
        '<div class="modal-body">' + body + '</div>' +
        '<footer class="modal-footer">' + (footer || '<span></span><button class="ghost-btn" type="button" data-close-modal>Close</button>') + '</footer>' +
      '</section>' +
    '</div>';
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    var root = $("#modal-root");
    if (root) root.innerHTML = "";
    document.body.style.overflow = "";
  }

  function tcoLink(item) {
    var qs = new URLSearchParams({
      vendor: item.vendor + " - " + (item.name || item.category || item.engagement || ""),
      spend: String(item.spend || item.value || 0),
      pillar: item.pillar || "",
      type: item.type || "SOW",
      source: "hub"
    });
    return "page_tco.html?" + qs.toString();
  }

  function showEngagement(id) {
    var e = data.engagements.find(function (item) { return item.id === id; });
    if (!e) return;
    var color = accentMap[e.status] || "#087f7a";
    var body = metricTiles([
      { label: "Annual Value", value: e.value },
      { label: "Pillar", value: e.pillar },
      { label: "Contract Expiry", value: e.expiry },
      { label: "VER Status", value: e.statusLabel }
    ]) +
    '<div class="narrative-block" style="--accent:' + color + '"><h4>Engagement Detail</h4><p>' + escapeHtml(e.detail) + '</p></div>' +
    '<div class="narrative-block" style="--accent:#4f46e5"><h4>VER Advisory</h4><p>' + escapeHtml(e.advisory) + '</p></div>';
    openModal(e.vendor, e.name, e.initials, color, body,
      '<button class="ghost-btn" type="button" data-close-modal>Close</button><a class="primary-btn" href="' + tcoLink(e) + '">Open in Calculator</a>');
  }

  function showRenewal(id) {
    var r = data.renewals.find(function (item) { return item.id === id; });
    if (!r) return;
    var color = r.filterGroup === "urgent" ? "#c2412d" : r.filterGroup === "critical" ? "#b7791f" : "#087f7a";
    var body = metricTiles([
      { label: "Contract Value", value: money(r.value) },
      { label: "Days to Renewal", value: String(r.days) },
      { label: "Renewal Date", value: r.date },
      { label: "Priority Tier", value: r.tier }
    ]) +
    '<div class="narrative-block" style="--accent:' + color + '"><h4>Recommended Action</h4><p>' + escapeHtml(r.action) + '</p></div>' +
    '<div class="narrative-block" style="--accent:#4f46e5"><h4>Renewal Strategy</h4><p>' + escapeHtml(r.strategy) + '</p></div>';
    openModal(r.vendor, r.category, r.initials, color, body,
      '<button class="ghost-btn" type="button" data-close-modal>Close</button><a class="primary-btn" href="' + tcoLink(r) + '">Open in Calculator</a>');
  }

  function showGovernance(id) {
    var g = data.governance.find(function (item) { return item.id === id; });
    if (!g) return;
    var color = g.status === "Healthy" ? "#14895a" : "#b7791f";
    var rows = g.metrics.map(function (m) {
      return '<tr><td>' + escapeHtml(m.label) + '</td><td>' + escapeHtml(m.target) + '</td><td>' + escapeHtml(m.actual) + '</td><td>' + escapeHtml(m.state) + '</td></tr>';
    }).join("");
    var body = metricTiles([
      { label: "Annual Spend", value: money(g.spend) },
      { label: "VER Status", value: g.status },
      { label: "Last CQBR", value: g.lastCqbr },
      { label: "Next Release", value: g.nextRelease }
    ]) +
    '<div class="narrative-block" style="--accent:' + color + '"><h4>Scope</h4><p>' + escapeHtml(g.scope) + '</p></div>' +
    '<div class="narrative-block" style="--accent:#4f46e5"><h4>SLA Note</h4><p>' + escapeHtml(g.slaNote) + '</p></div>' +
    '<table class="metric-table"><thead><tr><th>Metric</th><th>Target</th><th>Actual</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<div class="narrative-block" style="--accent:#d95f4b"><h4>VER Advisory</h4><p>' + escapeHtml(g.advisory) + '</p></div>';
    openModal(g.vendor, g.engagement, g.initials, color, body,
      '<button class="ghost-btn" type="button" data-close-modal>Close</button><a class="primary-btn" href="' + tcoLink(g) + '">Open in Calculator</a>');
  }

  function initTco() {
    var form = $("#tco-form");
    if (!form) return;
    var params = new URLSearchParams(window.location.search);
    var vendor = $("#tco-vendor");
    var type = $("#tco-type");
    var pillar = $("#tco-pillar");
    var spend = $("#tco-spend");
    var factor = $("#tco-factor");
    var loaded = $("#tco-loaded-label");

    if (vendor) vendor.value = params.get("vendor") || "";
    if (type && params.get("type")) type.value = params.get("type");
    if (pillar) pillar.value = params.get("pillar") || "";
    if (spend) spend.value = params.get("spend") || "";
    if (loaded) loaded.textContent = params.get("vendor") ? "From Hub" : "Manual";

    function update() {
      var contracted = Number(spend && spend.value ? spend.value : 0);
      var factorVal = Number(factor && factor.value ? factor.value : 22);
      var hidden = contracted * (factorVal / 100);
      var total = contracted + hidden;
      var opportunity = hidden * 0.35;
      var signal = factorVal >= 28 ? "High" : factorVal >= 18 ? "Medium" : "Low";

      var factorLabel = $("#tco-factor-label");
      if (factorLabel) factorLabel.textContent = factorVal + "%";
      setText("#tco-contracted", money(contracted));
      setText("#tco-hidden", money(hidden));
      setText("#tco-total", money(total));
      setText("#tco-opportunity", money(opportunity));
      setText("#tco-signal", signal);
      renderAllocation(hidden);
    }

    all("input, select", form).forEach(function (el) {
      el.addEventListener("input", update);
      el.addEventListener("change", update);
    });
    update();
  }

  function setText(selector, value) {
    var el = $(selector);
    if (el) el.textContent = value;
  }

  function renderAllocation(hidden) {
    var board = $("#allocation-board");
    if (!board) return;
    var parts = [
      { label: "Implementation", pct: 30, color: "#087f7a" },
      { label: "Support/Admin", pct: 24, color: "#4f46e5" },
      { label: "Integration", pct: 18, color: "#d95f4b" },
      { label: "Change Load", pct: 16, color: "#b7791f" },
      { label: "Transition Risk", pct: 12, color: "#14895a" }
    ];
    board.innerHTML = parts.map(function (p) {
      return '<div class="allocation-row">' +
        '<strong>' + escapeHtml(p.label) + '</strong>' +
        '<div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--pct:' + p.pct + '%;--bar-color:' + p.color + '"></div></div>' +
        '<span>' + money(hidden * (p.pct / 100)) + '</span>' +
      '</div>';
    }).join("");
  }

  function wireEvents() {
    document.addEventListener("click", function (event) {
      var close = event.target.closest("[data-close-modal]");
      if (close) {
        closeModal();
        return;
      }

      if (event.target.classList.contains("modal-backdrop")) {
        closeModal();
        return;
      }

      var filterBtn = event.target.closest("[data-filter]");
      if (filterBtn) {
        all("[data-filter]").forEach(function (btn) { btn.classList.remove("active"); });
        filterBtn.classList.add("active");
        renderRenewals(filterBtn.getAttribute("data-filter"));
        return;
      }

      var modalBtn = event.target.closest("[data-modal]");
      if (!modalBtn) return;
      var type = modalBtn.getAttribute("data-modal");
      var id = modalBtn.getAttribute("data-id");
      if (type === "engagement") showEngagement(id);
      if (type === "renewal") showRenewal(id);
      if (type === "governance") showGovernance(id);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModal();
    });
  }

  function route() {
    var page = document.body.getAttribute("data-page") || "home";
    setActiveNav(page);
    if (page === "home") renderHome();
    if (page === "exec") renderExec();
    if (page === "renewal") renderRenewals("all");
    if (page === "governance") renderGovernance();
    if (page === "tco") initTco();
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireEvents();
    route();
  });
})();
