/* ═══════════════════════════════════════════════════════════════
   VER Assignment Engine  v2.0
   Pure localStorage — no backend required.
   Director-gated: only Casey (director:true) can create assignments.
   Everyone else sees assigned chips read-only.

   Public API:
     AssignEngine.initDirectorChip(user, pickerFn) — wire sidebar chip
     AssignEngine.open(context)                    — open tray (director only)
     AssignEngine.renderQueue(el)                  — render My Queue
     AssignEngine.getAll()                         — return all assignments
   ═══════════════════════════════════════════════════════════════ */
(function(global) {
  'use strict';

  var STORAGE_KEY = 'ver-assignments';

  var CHECK_TYPES = [
    { id:'intake', label:'Stakeholder Intake Review', icon:'📥', color:'#F43F5E' },
    { id:'finops', label:'FinOps Check',              icon:'💰', color:'#34D399' },
    { id:'saas',   label:'Duplicate SaaS Check',      icon:'🔍', color:'#A855F7' },
    { id:'risk',   label:'Risk Review',               icon:'🛡', color:'#FBBF24' },
    { id:'spend',  label:'Spend Analysis',            icon:'📊', color:'#E879F9' },
    { id:'sow',    label:'SOW Review',                icon:'📄', color:'#FB7185' },
    { id:'rate',   label:'Rate Validation',           icon:'⏱', color:'#C084FC' }
  ];

  var TEAM_MEMBERS = [
    { id:'debs',   name:'Debs',   role:'Manager',     emoji:'🌟', color:'#C026D3' },
    { id:'erin',   name:'Erin',   role:'Sr. Manager', emoji:'⭐', color:'#A855F7' },
    { id:'mahesh', name:'Mahesh', role:'Sr. Manager', emoji:'💫', color:'#E879F9' },
    { id:'aditya', name:'Aditya', role:'Sr. Manager', emoji:'✨', color:'#E8A598' },
    { id:'justin', name:'Justin', role:'Sr. Analyst', emoji:'🌠', color:'#C084FC' }
  ];

  /* ── Storage ── */
  function _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e) { return []; }
  }
  function _save(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch(e) {}
  }
  function _uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /* ── Director check ── */
  function _isDirector() {
    try {
      var u = JSON.parse(localStorage.getItem('ver-team-user'));
      return !!(u && u.director);
    } catch(e) { return false; }
  }
  function _currentUserId() {
    try {
      var u = JSON.parse(localStorage.getItem('ver-team-user'));
      return u && u.id ? u.id : null;
    } catch(e) { return null; }
  }

  /* ── Wire sidebar user chip for director profile switching ──
     Call this from _applyUser on every page after updating the chip text.
     Dynamically injects "Switch profile →" link for the director.          */
  function _initDirectorChip(u, pickerFn) {
    var chipEl = document.getElementById('sb-user-chip');
    if (!chipEl) return;

    // Clean up any previously injected switch link
    var old = document.getElementById('_ver_switch_link');
    if (old) old.remove();

    if (u && u.director) {
      chipEl.style.cursor = 'pointer';
      chipEl.onclick = function(e) { e.stopPropagation(); if (pickerFn) pickerFn(); };

      var sw = document.createElement('div');
      sw.id = '_ver_switch_link';
      sw.textContent = 'Switch profile →';
      sw.style.cssText = 'font-size:8.5px;color:#FB7185;font-weight:700;margin-top:3px;letter-spacing:0.04em;';
      // Append inside the text column (sibling of sb-user-name/role)
      var nameEl = document.getElementById('sb-user-name');
      if (nameEl && nameEl.parentElement) {
        nameEl.parentElement.appendChild(sw);
      } else {
        chipEl.appendChild(sw);
      }
    } else {
      chipEl.style.cursor = 'default';
      chipEl.onclick = null;
    }
  }

  /* ── Inject tray HTML + styles once ── */
  function _injectTray() {
    if (document.getElementById('assign-overlay')) return;

    var css = [
      /* overlay + tray */
      '.assign-overlay{position:fixed;inset:0;z-index:800;background:rgba(7,4,17,0.72);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:flex-end;}',
      '.assign-overlay.hidden{display:none;}',
      '.assign-tray{width:400px;height:100vh;background:linear-gradient(180deg,#1C1030 0%,#150D28 60%,#110B22 100%);border-left:1px solid rgba(244,63,94,0.18);display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,0.5);animation:traySlide 0.3s cubic-bezier(0.16,1,0.3,1) both;}',
      '@keyframes traySlide{from{transform:translateX(400px)}to{transform:translateX(0)}}',
      /* header */
      '.at-header{padding:20px 22px 16px;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;position:relative;}',
      '.at-title{font-size:15px;font-weight:900;color:rgba(255,255,255,0.96);margin-bottom:2px;}',
      '.at-sub{font-size:11px;color:rgba(255,255,255,0.50);}',
      '.at-close{position:absolute;top:16px;right:16px;background:none;border:none;color:rgba(255,255,255,0.46);font-size:20px;cursor:pointer;padding:2px 7px;border-radius:6px;line-height:1;}',
      '.at-close:hover{background:rgba(244,63,94,0.12);color:rgba(255,255,255,0.92);}',
      /* body */
      '.at-body{flex:1;overflow-y:auto;padding:18px 22px;scrollbar-width:thin;scrollbar-color:rgba(244,63,94,0.2) transparent;}',
      '.at-body::-webkit-scrollbar{width:4px;}',
      '.at-body::-webkit-scrollbar-thumb{background:rgba(244,63,94,0.18);border-radius:99px;}',
      /* labels */
      '.at-label{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.13em;color:rgba(255,255,255,0.40);margin-bottom:7px;margin-top:16px;}',
      '.at-label:first-child{margin-top:0;}',
      /* context chip */
      '.at-context-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:8px;background:rgba(244,63,94,0.09);border:1px solid rgba(244,63,94,0.22);font-size:11px;font-weight:700;color:rgba(255,255,255,0.86);}',
      /* check type grid */
      '.at-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}',
      '.at-check-btn{padding:9px 10px;border-radius:9px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.034);cursor:pointer;text-align:left;font-family:inherit;transition:background 0.15s,border-color 0.15s;display:flex;align-items:center;gap:7px;}',
      '.at-check-btn:hover{background:rgba(244,63,94,0.08);border-color:rgba(244,63,94,0.28);}',
      '.at-check-btn.selected{background:rgba(244,63,94,0.16);border-color:rgba(244,63,94,0.55);}',
      '.at-check-icon{font-size:14px;flex-shrink:0;}',
      '.at-check-label{font-size:10px;font-weight:700;color:rgba(255,255,255,0.86);}',
      /* member grid */
      '.at-member-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}',
      '.at-member-btn{padding:10px 8px;border-radius:9px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.034);cursor:pointer;text-align:center;font-family:inherit;transition:background 0.15s,border-color 0.15s,transform 0.15s;}',
      '.at-member-btn:hover{transform:translateY(-1px);}',
      '.at-member-btn.selected{border-width:2px;}',
      '.at-member-emoji{font-size:22px;display:block;margin-bottom:4px;}',
      '.at-member-name{font-size:10.5px;font-weight:800;color:rgba(255,255,255,0.92);}',
      '.at-member-role{font-size:8px;color:rgba(255,255,255,0.44);}',
      /* inputs */
      '.at-input{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:8px;padding:8px 12px;color:rgba(255,255,255,0.92);font-family:inherit;font-size:12px;}',
      '.at-input:focus{outline:none;border-color:rgba(244,63,94,0.5);}',
      '.at-input::placeholder{color:rgba(255,255,255,0.26);}',
      'textarea.at-input{resize:vertical;min-height:60px;line-height:1.5;}',
      /* footer */
      '.at-footer{padding:14px 22px;border-top:1px solid rgba(255,255,255,0.06);flex-shrink:0;}',
      '.at-save-btn{width:100%;padding:12px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:800;letter-spacing:0.04em;background:linear-gradient(135deg,#F43F5E,#C026D3);color:#fff;box-shadow:0 0 22px rgba(244,63,94,0.28);transition:opacity 0.15s,transform 0.15s;}',
      '.at-save-btn:hover{opacity:0.88;transform:translateY(-1px);}',
      '.at-save-btn:disabled{opacity:0.30;cursor:not-allowed;transform:none;}',
      /* My Queue */
      '.aq-empty{font-size:12px;color:rgba(255,255,255,0.36);padding:20px 0;text-align:center;}',
      '.aq-item{display:flex;align-items:flex-start;gap:11px;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.028);margin-bottom:8px;transition:background 0.15s;}',
      '.aq-item:hover{background:rgba(255,255,255,0.046);}',
      '.aq-icon{font-size:17px;flex-shrink:0;margin-top:1px;}',
      '.aq-body{flex:1;min-width:0;}',
      '.aq-title{font-size:11.5px;font-weight:700;color:rgba(255,255,255,0.92);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;}',
      '.aq-meta{font-size:10px;color:rgba(255,255,255,0.48);line-height:1.5;}',
      '.aq-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px;}',
      '.aq-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:99px;font-size:8.5px;font-weight:700;border:1px solid;}',
      '.aq-due{font-size:9px;font-weight:700;padding:2px 8px;border-radius:99px;flex-shrink:0;white-space:nowrap;}',
      '.aq-due.overdue{background:rgba(244,63,94,0.15);color:#FB7185;}',
      '.aq-due.today{background:rgba(251,191,36,0.15);color:#FBBF24;}',
      '.aq-due.upcoming{background:rgba(52,211,153,0.11);color:#34D399;}',
      '.aq-resolve-btn{background:none;border:1px solid rgba(255,255,255,0.10);border-radius:6px;color:rgba(255,255,255,0.38);font-size:10px;padding:3px 8px;cursor:pointer;flex-shrink:0;font-family:inherit;transition:background 0.15s,color 0.15s,border-color 0.15s;align-self:flex-start;}',
      '.aq-resolve-btn:hover{background:rgba(52,211,153,0.10);color:#34D399;border-color:rgba(52,211,153,0.28);}',
      /* Row buttons */
      '.row-assign-btn{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;border:1px solid rgba(244,63,94,0.35);background:rgba(244,63,94,0.08);color:#FB7185;font-size:9px;font-weight:700;cursor:pointer;font-family:inherit;transition:background 0.15s,transform 0.12s;white-space:nowrap;}',
      '.row-assign-btn:hover{background:rgba(244,63,94,0.18);transform:translateY(-1px);}',
      '.row-assign-chips{display:flex;flex-direction:column;gap:3px;margin-top:4px;}',
      '.row-assignee-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 7px 2px 5px;border-radius:99px;font-size:8.5px;font-weight:700;border:1px solid;white-space:nowrap;}',
      '@media(max-width:640px){.assign-tray{width:100vw;}}',
      /* light-mode tray overrides */
      'body.light-mode .assign-overlay{background:rgba(255,220,230,0.55);}',
      'body.light-mode .assign-tray{background:linear-gradient(180deg,#FDE8EE 0%,#FCDDE7 60%,#FDE8EE 100%);border-left:1px solid #F5C6D3;box-shadow:-8px 0 40px rgba(244,63,94,0.12);}',
      'body.light-mode .at-header{border-bottom-color:#F5C6D3;}',
      'body.light-mode .at-title{color:#1A0818;}',
      'body.light-mode .at-sub{color:#7A4055;}',
      'body.light-mode .at-close{color:#7A4055;}',
      'body.light-mode .at-close:hover{background:rgba(244,63,94,0.10);color:#1A0818;}',
      'body.light-mode .at-label{color:#B06080;}',
      'body.light-mode .at-context-chip{background:rgba(244,63,94,0.08);border-color:rgba(244,63,94,0.25);color:#1A0818;}',
      'body.light-mode .at-check-btn{background:#FFF8FA;border-color:#F5C6D3;}',
      'body.light-mode .at-check-btn:hover{background:rgba(244,63,94,0.08);border-color:rgba(244,63,94,0.28);}',
      'body.light-mode .at-check-btn.selected{background:rgba(244,63,94,0.14);border-color:rgba(244,63,94,0.50);}',
      'body.light-mode .at-check-label{color:#1A0818;}',
      'body.light-mode .at-member-btn{background:#FFF8FA;border-color:#F5C6D3 !important;}',
      'body.light-mode .at-member-btn:hover{background:rgba(244,63,94,0.06);}',
      'body.light-mode .at-member-name{color:#1A0818;}',
      'body.light-mode .at-member-role{color:#7A4055;}',
      'body.light-mode .at-input{background:#FFF0F4;border-color:#F5C6D3;color:#1A0818;}',
      'body.light-mode .at-input::placeholder{color:#B06080;}',
      'body.light-mode .at-input:focus{border-color:rgba(244,63,94,0.50);}',
      'body.light-mode .at-footer{border-top-color:#F5C6D3;}',
      'body.light-mode .aq-item{background:#FFF8FA;border-color:#F5C6D3;}',
      'body.light-mode .aq-title{color:#1A0818;}',
      'body.light-mode .aq-meta{color:#7A4055;}',
      'body.light-mode .aq-empty{color:#B06080;}',
      'body.light-mode .aq-resolve-btn{border-color:#F5C6D3;color:#B06080;}',
      /* mid-mode tray overrides */
      'body.mid-mode .assign-overlay{background:rgba(10,15,28,0.65);}',
      'body.mid-mode .assign-tray{background:linear-gradient(180deg,#1A2540 0%,#172035 60%,#141B2E 100%);border-left:1px solid rgba(255,255,255,0.12);}',
      'body.mid-mode .at-header{border-bottom-color:rgba(255,255,255,0.10);}',
      'body.mid-mode .at-footer{border-top-color:rgba(255,255,255,0.10);}',
      'body.mid-mode .at-check-btn{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.12);}',
      'body.mid-mode .at-member-btn{background:rgba(255,255,255,0.05);}',
      'body.mid-mode .at-input{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.14);}'
    ].join('');

    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    var html = '<div class="assign-overlay hidden" id="assign-overlay" onclick="_assignOverlayClick(event)">'
      + '<div class="assign-tray">'
      +   '<div class="at-header">'
      +     '<div class="at-title">&#43; Assign Task</div>'
      +     '<div class="at-sub" id="at-sub">Delegate a check to a team member</div>'
      +     '<button class="at-close" onclick="AssignEngine.close()">&#215;</button>'
      +   '</div>'
      +   '<div class="at-body">'
      +     '<div class="at-label">Stakeholder Request</div>'
      +     '<div class="at-context-chip" id="at-context-chip">—</div>'
      +     '<div class="at-label">Requested By</div>'
      +     '<input type="text" class="at-input" id="at-requested-by" placeholder="e.g. Pillar 4 PM, Finance – TJ, Legal…">'
      +     '<div class="at-label">Check Type</div>'
      +     '<div class="at-check-grid" id="at-check-grid"></div>'
      +     '<div class="at-label">Assign To</div>'
      +     '<div class="at-member-grid" id="at-member-grid"></div>'
      +     '<div class="at-label">Due Date</div>'
      +     '<input type="date" class="at-input" id="at-due-date">'
      +     '<div class="at-label">Notes <span style="font-weight:500;text-transform:none;letter-spacing:0;color:rgba(255,255,255,0.26);">(optional)</span></div>'
      +     '<textarea class="at-input" id="at-note" placeholder="Add context, data links, or specific instructions…"></textarea>'
      +   '</div>'
      +   '<div class="at-footer"><button class="at-save-btn" id="at-save-btn" onclick="AssignEngine.save()" disabled>Save Assignment</button></div>'
      + '</div></div>';

    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);
  }

  /* ── Tray state ── */
  var _trayCtx = null;
  var _selCheck = null;
  var _selMember = null;

  function _assignOverlayClick(e) {
    if (e.target.id === 'assign-overlay') AssignEngine.close();
  }

  function _open(ctx) {
    if (!_isDirector()) {
      _showNotDirectorToast();
      return;
    }
    _trayCtx   = ctx;
    _selCheck  = null;
    _selMember = null;

    var overlay = document.getElementById('assign-overlay');
    overlay.classList.remove('hidden');

    document.getElementById('at-context-chip').textContent = ctx.label || ctx.vendor || '—';
    document.getElementById('at-sub').textContent = ctx.vendor ? ctx.vendor : 'Delegate a check to a team member';
    document.getElementById('at-requested-by').value = ctx.requestedBy || '';
    document.getElementById('at-note').value = '';

    // Default due: +3 business days
    var d = new Date();
    d.setDate(d.getDate() + 3);
    document.getElementById('at-due-date').value = d.toISOString().slice(0, 10);

    // Render check type grid
    document.getElementById('at-check-grid').innerHTML = CHECK_TYPES.map(function(c) {
      return '<button class="at-check-btn" data-check="' + c.id + '" onclick="AssignEngine._pickCheck(\'' + c.id + '\')">'
        + '<span class="at-check-icon">' + c.icon + '</span>'
        + '<span class="at-check-label">' + c.label + '</span>'
        + '</button>';
    }).join('');

    // Render member grid
    document.getElementById('at-member-grid').innerHTML = TEAM_MEMBERS.map(function(m) {
      return '<button class="at-member-btn" data-member="' + m.id + '" '
        + 'onclick="AssignEngine._pickMember(\'' + m.id + '\')" '
        + 'style="border-color:' + m.color + '22;">'
        + '<span class="at-member-emoji">' + m.emoji + '</span>'
        + '<div class="at-member-name">' + m.name + '</div>'
        + '<div class="at-member-role">' + m.role + '</div>'
        + '</button>';
    }).join('');

    if (ctx.checkType) _pickCheck(ctx.checkType);
    _updateBtn();
  }

  function _pickCheck(id) {
    _selCheck = id;
    document.querySelectorAll('.at-check-btn').forEach(function(b) {
      b.classList.toggle('selected', b.getAttribute('data-check') === id);
    });
    _updateBtn();
  }

  function _pickMember(id) {
    _selMember = id;
    var m = TEAM_MEMBERS.find(function(x) { return x.id === id; });
    document.querySelectorAll('.at-member-btn').forEach(function(b) {
      var sel = b.getAttribute('data-member') === id;
      b.classList.toggle('selected', sel);
      if (sel && m) b.style.borderColor = m.color;
      else {
        var bm = TEAM_MEMBERS.find(function(x) { return x.id === b.getAttribute('data-member'); });
        b.style.borderColor = bm ? bm.color + '22' : 'rgba(255,255,255,0.08)';
      }
    });
    _updateBtn();
  }

  function _updateBtn() {
    var btn = document.getElementById('at-save-btn');
    if (btn) btn.disabled = !(_selCheck && _selMember);
  }

  function _save() {
    if (!_selCheck || !_selMember || !_trayCtx) return;
    var check  = CHECK_TYPES.find(function(c) { return c.id === _selCheck; });
    var member = TEAM_MEMBERS.find(function(m) { return m.id === _selMember; });
    var all = _load();
    all.push({
      id:           _uid(),
      contextId:    _trayCtx.id || _trayCtx.label,
      label:        _trayCtx.label,
      vendor:       _trayCtx.vendor  || '',
      page:         _trayCtx.page    || window.location.pathname.split('/').pop(),
      checkId:      _selCheck,
      checkLabel:   check  ? check.label   : _selCheck,
      checkIcon:    check  ? check.icon    : '📋',
      checkColor:   check  ? check.color   : '#F43F5E',
      memberId:     _selMember,
      memberName:   member ? member.name   : _selMember,
      memberEmoji:  member ? member.emoji  : '👤',
      memberColor:  member ? member.color  : '#888',
      requestedBy:  document.getElementById('at-requested-by').value.trim(),
      due:          document.getElementById('at-due-date').value || '',
      note:         document.getElementById('at-note').value.trim(),
      status:       'open',
      createdBy:    _currentUserId() || 'casey',
      createdAt:    new Date().toISOString()
    });
    _save(all);
    AssignEngine.close();
    _refreshAllBadges();
    var qc = document.getElementById('assign-queue-container');
    if (qc) _renderQueue(qc);
    _toast('✓ Assigned to ' + (member ? member.name : _selMember));
  }

  function _close() {
    var o = document.getElementById('assign-overlay');
    if (o) o.classList.add('hidden');
    _trayCtx = _selCheck = _selMember = null;
  }

  function _toast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:900;padding:10px 20px;'
      + 'background:linear-gradient(135deg,#F43F5E,#C026D3);color:#fff;border-radius:99px;'
      + 'font-size:12px;font-weight:800;box-shadow:0 0 24px rgba(244,63,94,0.38);pointer-events:none;'
      + 'animation:rise 0.3s cubic-bezier(0.16,1,0.3,1) both;';
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 2400);
  }

  function _showNotDirectorToast() {
    _toast('Only Casey can assign tasks');
  }

  /* ── Row badge wiring ── */
  function _getOpen(contextId) {
    return _load().filter(function(a) { return a.contextId === contextId && a.status === 'open'; });
  }

  function _refreshAllBadges() {
    document.querySelectorAll('[data-assign-id]').forEach(function(cell) {
      var cid = cell.getAttribute('data-assign-id');
      var open = _getOpen(cid);
      var btn   = cell.querySelector('.row-assign-btn');
      var chips = cell.querySelector('.row-assign-chips');
      if (btn) btn.textContent = '+ ' + (open.length ? 'Add' : 'Assign');
      if (chips) {
        chips.innerHTML = open.map(function(a) {
          return '<span class="row-assignee-chip" style="background:' + a.memberColor + '18;color:' + a.memberColor + ';border-color:' + a.memberColor + '40;">'
            + a.memberEmoji + ' ' + a.memberName
            + '<span style="opacity:0.55;margin-left:3px;">· ' + a.checkLabel + '</span>'
            + '</span>';
        }).join('');
      }
    });
  }

  /* ── wireTable: append an Assign cell to each tr in rowDefs ── */
  function _wireTable(ignored, rowDefs) {
    var director = _isDirector();
    rowDefs.forEach(function(def) {
      if (!def.tr) return;
      var open = _getOpen(def.contextId);
      var chips = open.map(function(a) {
        return '<span class="row-assignee-chip" style="background:' + a.memberColor + '18;color:' + a.memberColor + ';border-color:' + a.memberColor + '40;">'
          + a.memberEmoji + ' ' + a.memberName
          + '<span style="opacity:0.55;margin-left:3px;">· ' + a.checkLabel + '</span>'
          + '</span>';
      }).join('');

      var ctxJson = JSON.stringify({ id: def.contextId, label: def.label, vendor: def.vendor || '', checkType: def.checkType || '' })
        .replace(/"/g, '&quot;');

      var td = document.createElement('td');
      td.setAttribute('data-assign-id', def.contextId);
      td.style.whiteSpace = 'nowrap';

      if (director) {
        td.innerHTML = '<div style="display:flex;flex-direction:column;gap:3px;">'
          + '<button class="row-assign-btn" onclick="AssignEngine._openFromBtn(this)" data-context="' + ctxJson + '">+ ' + (open.length ? 'Add' : 'Assign') + '</button>'
          + '<div class="row-assign-chips">' + chips + '</div>'
          + '</div>';
      } else {
        td.innerHTML = '<div class="row-assign-chips">' + (chips || '<span style="font-size:10px;color:rgba(255,255,255,0.28);">—</span>') + '</div>';
      }
      def.tr.appendChild(td);
    });
  }

  function _openFromBtn(btn) {
    try {
      var ctx = JSON.parse(btn.getAttribute('data-context').replace(/&quot;/g, '"'));
      AssignEngine.open(ctx);
    } catch(e) {}
  }

  /* ── My Queue renderer ── */
  function _renderQueue(container) {
    if (!container) return;
    var all   = _load();
    var uid   = _currentUserId();
    var open  = all.filter(function(a) { return a.status === 'open'; });
    var mine  = open.filter(function(a) { return a.memberId === uid; });
    var others = open.filter(function(a) { return a.memberId !== uid; });
    var today = new Date().toISOString().slice(0, 10);

    if (!open.length) {
      container.innerHTML = '<div class="aq-empty">🎉 No open assignments — all clear!</div>';
      var pill = document.getElementById('queue-count-pill');
      if (pill) pill.textContent = 'All clear';
      return;
    }

    // Update count pill
    var pill = document.getElementById('queue-count-pill');
    if (pill) pill.textContent = open.length + (open.length === 1 ? ' open' : ' open');

    function _dueClass(d) {
      if (!d) return '';
      return d < today ? 'overdue' : d === today ? 'today' : 'upcoming';
    }
    function _dueText(d) {
      if (!d) return '';
      if (d < today) return 'Overdue';
      if (d === today) return 'Due today';
      var diff = Math.round((new Date(d) - new Date(today)) / 86400000);
      return 'Due in ' + diff + 'd';
    }

    function _item(a) {
      var dc = _dueClass(a.due);
      return '<div class="aq-item">'
        + '<div class="aq-icon">' + a.checkIcon + '</div>'
        + '<div class="aq-body">'
        +   '<div class="aq-title">' + (a.vendor || a.label) + (a.vendor && a.label !== a.vendor ? ' · ' + a.label : '') + '</div>'
        +   '<div class="aq-meta">' + a.checkLabel + (a.requestedBy ? ' · From: ' + a.requestedBy : '') + (a.note ? ' · ' + a.note.slice(0, 55) + (a.note.length > 55 ? '…' : '') : '') + '</div>'
        +   '<div class="aq-chips">'
        +     '<span class="aq-chip" style="background:' + a.memberColor + '18;color:' + a.memberColor + ';border-color:' + a.memberColor + '33;">' + a.memberEmoji + ' ' + a.memberName + '</span>'
        +     (a.requestedBy ? '<span class="aq-chip" style="background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.52);border-color:rgba(255,255,255,0.10);">📋 ' + a.requestedBy + '</span>' : '')
        +   '</div>'
        + '</div>'
        + (a.due ? '<span class="aq-due ' + dc + '">' + _dueText(a.due) + '</span>' : '')
        + '<button class="aq-resolve-btn" onclick="AssignEngine.resolve(\'' + a.id + '\', this)" title="Mark done">✓</button>'
        + '</div>';
    }

    var html = '';
    if (mine.length) {
      html += '<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.13em;color:rgba(255,255,255,0.36);margin-bottom:8px;">My Assignments</div>';
      html += mine.map(_item).join('');
    }
    if (others.length) {
      html += '<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.13em;color:rgba(255,255,255,0.28);margin-top:' + (mine.length ? '16px' : '0') + ';margin-bottom:8px;">Team Queue</div>';
      html += others.map(_item).join('');
    }
    container.innerHTML = html;
  }

  function _resolve(id, btn) {
    var all = _load().map(function(a) {
      return a.id === id ? Object.assign({}, a, { status: 'resolved', resolvedAt: new Date().toISOString() }) : a;
    });
    _save(all);
    var item = btn && btn.closest('.aq-item');
    if (item) {
      item.style.cssText += 'opacity:0.3;transition:opacity 0.35s;pointer-events:none;';
      setTimeout(function() {
        var qc = document.getElementById('assign-queue-container');
        if (qc) _renderQueue(qc);
        _refreshAllBadges();
      }, 380);
    }
    _toast('✓ Resolved');
  }

  /* ── Public API ── */
  var AssignEngine = {
    open:             _open,
    close:            _close,
    save:             _save,
    resolve:          _resolve,
    getAll:           _load,
    renderQueue:      _renderQueue,
    wireTable:        _wireTable,
    initDirectorChip: _initDirectorChip,
    _pickCheck:       _pickCheck,
    _pickMember:      _pickMember,
    _openFromBtn:     _openFromBtn,
    _refreshAllBadges:_refreshAllBadges,
    CHECK_TYPES:      CHECK_TYPES,
    TEAM_MEMBERS:     TEAM_MEMBERS
  };

  global.AssignEngine         = AssignEngine;
  global._assignOverlayClick  = _assignOverlayClick;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { _injectTray(); _refreshAllBadges(); });
  } else {
    _injectTray(); _refreshAllBadges();
  }

}(window));
