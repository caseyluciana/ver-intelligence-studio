/**
 * VER Intelligence Hub — Shared Help Modal
 * Drop-in utility: works with both Inter/CSS-vars pages and Segoe UI/inline-vars pages.
 * Usage: HelpModal.open(config) — see bottom for config shape.
 */
(function(root){
  'use strict';

  var STYLE_ID = 'ver-help-modal-css';

  var CSS = [
    /* ── Overlay ── */
    '.hm-overlay{position:fixed;inset:0;z-index:9000;',
    '  display:flex;align-items:center;justify-content:center;',
    '  background:rgba(4,10,20,0.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);',
    '  opacity:0;transition:opacity 220ms ease;pointer-events:none;}',
    '.hm-overlay.hm-visible{opacity:1;pointer-events:auto;}',

    /* ── Modal box — light mode ── */
    '.hm-box{',
    '  width:min(680px,94vw);max-height:82vh;',
    '  background:#FFFFFF;',
    '  border:1px solid #E5E7EB;',
    '  border-radius:16px;',
    '  box-shadow:0 20px 60px rgba(0,0,0,0.14),0 4px 16px rgba(0,0,0,0.08);',
    '  display:flex;flex-direction:column;overflow:hidden;position:relative;',
    '  transform:translateY(18px) scale(0.97);',
    '  transition:transform 240ms cubic-bezier(0.16,1,0.3,1),opacity 220ms ease;',
    '  opacity:0;}',
    '.hm-overlay.hm-visible .hm-box{transform:translateY(0) scale(1);opacity:1;}',

    /* ── Header ── */
    '.hm-head{',
    '  display:flex;align-items:flex-start;justify-content:space-between;',
    '  padding:22px 24px 18px;',
    '  border-bottom:1px solid #F3F4F6;',
    '  background:#F9FAFB;}',
    '.hm-title-block{}',
    '.hm-eyebrow{',
    '  font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;',
    '  color:#9CA3AF;margin-bottom:4px;}',
    '.hm-title{font-size:18px;font-weight:800;color:#111827;line-height:1.2;}',
    '.hm-close{',
    '  width:30px;height:30px;border-radius:50%;background:#F3F4F6;',
    '  border:1px solid #E5E7EB;cursor:pointer;',
    '  display:flex;align-items:center;justify-content:center;flex-shrink:0;',
    '  font-size:14px;color:#6B7280;',
    '  transition:background 140ms ease,color 140ms ease;margin-top:2px;}',
    '.hm-close:hover{background:#E5E7EB;color:#111827;}',

    /* ── Body ── */
    '.hm-body{padding:22px 24px;overflow-y:auto;flex:1;background:#FFFFFF;}',
    '.hm-body::-webkit-scrollbar{width:4px;}',
    '.hm-body::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px;}',

    /* ── "What this tool does" callout ── */
    '.hm-what{',
    '  background:#F0FDF9;',
    '  border:1px solid rgba(13,148,136,0.25);',
    '  border-left:3px solid #0D9488;',
    '  border-radius:10px;padding:14px 16px;margin-bottom:18px;}',
    '.hm-what-label{',
    '  font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;',
    '  color:#0D9488;margin-bottom:5px;}',
    '.hm-what-text{font-size:13px;color:#1F2937;line-height:1.65;}',
    '.hm-what-text strong{color:#111827;}',

    /* ── Section headers ── */
    '.hm-section{margin-bottom:20px;}',
    '.hm-section:last-child{margin-bottom:0;}',
    '.hm-section-title{',
    '  font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;',
    '  color:#9CA3AF;margin-bottom:10px;',
    '  display:flex;align-items:center;gap:6px;}',
    '.hm-section-title::after{content:"";flex:1;height:1px;background:#F3F4F6;}',

    /* ── Steps ── */
    '.hm-steps{display:flex;flex-direction:column;gap:8px;}',
    '.hm-step{',
    '  display:flex;align-items:flex-start;gap:12px;',
    '  background:#F9FAFB;border-radius:8px;',
    '  padding:10px 12px;border:1px solid #F3F4F6;}',
    '.hm-step-num{',
    '  width:22px;height:22px;border-radius:50%;flex-shrink:0;',
    '  display:flex;align-items:center;justify-content:center;',
    '  font-size:11px;font-weight:800;background:rgba(13,148,136,0.12);',
    '  color:#0D9488;border:1px solid rgba(13,148,136,0.25);}',
    '.hm-step-text{font-size:13px;color:#374151;line-height:1.55;padding-top:2px;}',
    '.hm-step-text strong{color:#111827;font-weight:600;}',

    /* ── Tips grid ── */
    '.hm-tips{display:grid;grid-template-columns:1fr 1fr;gap:8px;}',
    '@media(max-width:520px){.hm-tips{grid-template-columns:1fr;}}',
    '.hm-tip{',
    '  background:#F9FAFB;border-radius:8px;',
    '  padding:10px 12px;border:1px solid #F3F4F6;}',
    '.hm-tip-icon{font-size:14px;margin-bottom:4px;}',
    '.hm-tip-title{font-size:11px;font-weight:700;color:#374151;margin-bottom:3px;}',
    '.hm-tip-body{font-size:12px;color:#6B7280;line-height:1.5;}',

    /* ── Glossary ── */
    '.hm-glossary{display:flex;flex-direction:column;gap:0;}',
    '.hm-gloss-row{',
    '  display:grid;grid-template-columns:180px 1fr;gap:12px;align-items:baseline;',
    '  padding:9px 0;border-bottom:1px solid #F3F4F6;}',
    '.hm-gloss-row:last-child{border-bottom:none;}',
    '.hm-gloss-term{',
    '  display:flex;align-items:center;gap:7px;',
    '  font-size:11px;font-weight:700;color:#111827;}',
    '.hm-gloss-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0;}',
    '.hm-gloss-def{font-size:12px;color:#4B5563;line-height:1.55;}',
    '@media(max-width:520px){.hm-gloss-row{grid-template-columns:1fr;gap:3px;}}',

    /* ── AI badge ── */
    '.hm-ai-badge{',
    '  display:flex;align-items:center;gap:8px;',
    '  background:rgba(124,58,237,0.06);',
    '  border:1px solid rgba(124,58,237,0.18);',
    '  border-left:3px solid #7C3AED;',
    '  border-radius:10px;padding:12px 14px;margin-top:14px;}',
    '.hm-ai-icon{font-size:18px;flex-shrink:0;}',
    '.hm-ai-text{font-size:12px;color:#374151;line-height:1.5;}',
    '.hm-ai-text strong{color:#6D28D9;font-weight:600;}',

    /* ── Footer ── */
    '.hm-foot{',
    '  padding:14px 24px;border-top:1px solid #F3F4F6;',
    '  background:#F9FAFB;',
    '  display:flex;align-items:center;justify-content:space-between;}',
    '.hm-foot-label{font-size:11px;color:#9CA3AF;}',
    '.hm-foot-close{',
    '  padding:6px 18px;border-radius:99px;',
    '  background:#0D9488;border:1px solid #0D9488;',
    '  font-size:12px;font-weight:700;color:#fff;cursor:pointer;',
    '  transition:background 140ms ease;}',
    '.hm-foot-close:hover{background:#0F766E;}',

    /* ── Portal light mode — applied via .hm-portal-light on .hm-box ── */
    '.hm-box.hm-portal-light{',
    '  background:linear-gradient(160deg,#FEE8F0 0%,#FDF0F6 60%,#FFF8FA 100%);',
    '  border-color:#F5C6D3;',
    '  box-shadow:0 20px 60px rgba(244,63,94,0.12),0 4px 16px rgba(192,38,211,0.08);}',
    '.hm-box.hm-portal-light::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;',
    '  background:linear-gradient(90deg,#F43F5E 0%,#C026D3 50%,#A855F7 100%);',
    '  border-radius:16px 16px 0 0;pointer-events:none;z-index:2;}',
    '.hm-box.hm-portal-light .hm-head{background:rgba(244,63,94,0.06);border-bottom-color:#F5C6D3;}',
    '.hm-box.hm-portal-light .hm-eyebrow{color:#C0143C;font-weight:800;}',
    '.hm-box.hm-portal-light .hm-title{color:#1A0818;}',
    '.hm-box.hm-portal-light .hm-close{background:rgba(26,8,24,0.06);border-color:#F5C6D3;color:#7A4055;}',
    '.hm-box.hm-portal-light .hm-close:hover{background:rgba(244,63,94,0.12);color:#C0143C;}',
    '.hm-box.hm-portal-light .hm-body{background:transparent;}',
    '.hm-box.hm-portal-light .hm-what{background:rgba(168,85,247,0.07);border-color:rgba(168,85,247,0.22);border-left-color:#A855F7;}',
    '.hm-box.hm-portal-light .hm-what-label{color:#6D28D9;}',
    '.hm-box.hm-portal-light .hm-what-text{color:#3D1028;}',
    '.hm-box.hm-portal-light .hm-what-text strong{color:#1A0818;}',
    '.hm-box.hm-portal-light .hm-section-title{color:#7A4055;}',
    '.hm-box.hm-portal-light .hm-section-title::after{background:#F5C6D3;}',
    '.hm-box.hm-portal-light .hm-step{background:#FFF0F4;border-color:#F5C6D3;}',
    '.hm-box.hm-portal-light .hm-step-num{background:rgba(244,63,94,0.10);color:#C0143C;border-color:rgba(244,63,94,0.24);}',
    '.hm-box.hm-portal-light .hm-step-text{color:#3D1028;}',
    '.hm-box.hm-portal-light .hm-step-text strong{color:#1A0818;}',
    '.hm-box.hm-portal-light .hm-tip{background:#FFF0F4;border-color:#F5C6D3;}',
    '.hm-box.hm-portal-light .hm-tip-title{color:#3D1028;}',
    '.hm-box.hm-portal-light .hm-tip-body{color:#7A4055;}',
    '.hm-box.hm-portal-light .hm-ai-badge{background:rgba(109,40,217,0.08);border-color:rgba(109,40,217,0.22);border-left-color:#6D28D9;}',
    '.hm-box.hm-portal-light .hm-ai-text{color:#3D1028;}',
    '.hm-box.hm-portal-light .hm-ai-text strong{color:#6D28D9;}',
    '.hm-box.hm-portal-light .hm-foot{background:rgba(244,63,94,0.05);border-top-color:#F5C6D3;}',
    '.hm-box.hm-portal-light .hm-foot-label{color:#B06080;}',
    '.hm-box.hm-portal-light .hm-foot-close{background:linear-gradient(90deg,#C0143C,#9A0DAF);border-color:transparent;color:#fff;}',
    '.hm-box.hm-portal-light .hm-foot-close:hover{opacity:0.88;}',

    /* ── Dark mode overrides — hub navy/teal palette — applied via .hm-dark on .hm-box ── */
    '.hm-box.hm-dark{',
    '  background:linear-gradient(160deg,#0F1E3C 0%,#0D1830 55%,#09101E 100%);',
    '  border-color:rgba(13,148,136,0.18);',
    '  box-shadow:0 32px 96px rgba(0,0,0,0.70),0 0 0 1px rgba(13,148,136,0.08),0 8px 24px rgba(0,0,0,0.50);}',
    '.hm-box.hm-dark::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;',
    '  background:linear-gradient(90deg,#0D9488 0%,#2563EB 60%,#7C3AED 100%);',
    '  border-radius:16px 16px 0 0;pointer-events:none;z-index:2;}',
    '.hm-box.hm-dark .hm-head{background:rgba(13,148,136,0.05);border-bottom-color:rgba(255,255,255,0.06);}',
    '.hm-box.hm-dark .hm-eyebrow{color:#5EEAD4;font-weight:800;}',
    '.hm-box.hm-dark .hm-title{color:rgba(255,255,255,0.96);}',
    '.hm-box.hm-dark .hm-close{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.10);color:rgba(255,255,255,0.45);}',
    '.hm-box.hm-dark .hm-close:hover{background:rgba(13,148,136,0.16);border-color:rgba(13,148,136,0.35);color:#fff;}',
    '.hm-box.hm-dark .hm-body{background:transparent;}',
    '.hm-box.hm-dark .hm-body::-webkit-scrollbar-thumb{background:rgba(13,148,136,0.22);border-radius:99px;}',
    '.hm-box.hm-dark .hm-what{background:rgba(13,148,136,0.08);border-color:rgba(13,148,136,0.22);border-left-color:#0D9488;}',
    '.hm-box.hm-dark .hm-what-label{color:#5EEAD4;}',
    '.hm-box.hm-dark .hm-what-text{color:rgba(255,255,255,0.80);}',
    '.hm-box.hm-dark .hm-what-text strong{color:rgba(255,255,255,0.96);}',
    '.hm-box.hm-dark .hm-section-title{color:rgba(255,255,255,0.36);}',
    '.hm-box.hm-dark .hm-section-title::after{background:rgba(255,255,255,0.06);}',
    '.hm-box.hm-dark .hm-step{background:rgba(255,255,255,0.034);border-color:rgba(255,255,255,0.05);}',
    '.hm-box.hm-dark .hm-step-num{background:rgba(13,148,136,0.16);color:#5EEAD4;border-color:rgba(13,148,136,0.30);}',
    '.hm-box.hm-dark .hm-step-text{color:rgba(255,255,255,0.74);}',
    '.hm-box.hm-dark .hm-step-text strong{color:rgba(255,255,255,0.94);}',
    '.hm-box.hm-dark .hm-tip{background:rgba(255,255,255,0.034);border-color:rgba(255,255,255,0.06);}',
    '.hm-box.hm-dark .hm-tip-title{color:rgba(255,255,255,0.82);}',
    '.hm-box.hm-dark .hm-tip-body{color:rgba(255,255,255,0.52);}',
    '.hm-box.hm-dark .hm-ai-badge{background:rgba(37,99,235,0.10);border-color:rgba(37,99,235,0.24);border-left-color:#2563EB;}',
    '.hm-box.hm-dark .hm-ai-text{color:rgba(255,255,255,0.68);}',
    '.hm-box.hm-dark .hm-ai-text strong{color:#93C5FD;}',
    '.hm-box.hm-dark .hm-foot{background:rgba(13,148,136,0.04);border-top-color:rgba(255,255,255,0.06);}',
    '.hm-box.hm-dark .hm-foot-label{color:rgba(255,255,255,0.24);}',
    '.hm-box.hm-dark .hm-foot-close{background:#0D9488;border-color:transparent;color:#fff;box-shadow:0 0 14px rgba(13,148,136,0.30);}',
    '.hm-box.hm-dark .hm-foot-close:hover{background:#0F766E;}',

    /* ── Glossary — dark overrides ── */
    '.hm-box.hm-dark .hm-gloss-row{border-bottom-color:rgba(255,255,255,0.05);}',
    '.hm-box.hm-dark .hm-gloss-term{color:rgba(255,255,255,0.88);}',
    '.hm-box.hm-dark .hm-gloss-def{color:rgba(255,255,255,0.52);}',

    /* ── Glossary — portal-light overrides ── */
    '.hm-box.hm-portal-light .hm-gloss-row{border-bottom-color:#F5C6D3;}',
    '.hm-box.hm-portal-light .hm-gloss-term{color:#1A0818;}',
    '.hm-box.hm-portal-light .hm-gloss-def{color:#7A4055;}'
  ].join('\n');

  function _injectCss(){
    if(document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function _isDark(){
    // Explicit light-mode class always wins
    if(document.body.classList.contains('light-mode')) return false;
    // Read data-theme from <html> or <body> — hub pages use this to toggle
    var theme = document.documentElement.getAttribute('data-theme')
      || document.body.getAttribute('data-theme');
    if(theme === 'dark') return true;
    if(theme === 'light') return false;
    // Portal pages: body bg is #070411 / near-black
    var bg = window.getComputedStyle(document.body).backgroundColor;
    if(bg && (bg.includes('7, 4, 17') || bg.includes('7,4,17'))) return true;
    // Explicit portal/dark class markers
    if(document.body.hasAttribute('data-portal') || document.body.classList.contains('portal-dark')) return true;
    // Hub pages always start with data-theme="light" — if no theme attr at all, default to light (do NOT use OS preference)
    return false;
  }

  function _buildStep(num, html){
    return '<div class="hm-step">'
      + '<div class="hm-step-num">' + num + '</div>'
      + '<div class="hm-step-text">' + html + '</div>'
      + '</div>';
  }

  function _buildTip(icon, title, body){
    return '<div class="hm-tip">'
      + '<div class="hm-tip-icon">' + icon + '</div>'
      + '<div class="hm-tip-title">' + title + '</div>'
      + '<div class="hm-tip-body">' + body + '</div>'
      + '</div>';
  }

  function _buildGlossRow(term, def, color){
    var dot = color ? '<span class="hm-gloss-dot" style="background:' + color + '"></span>' : '';
    return '<div class="hm-gloss-row">'
      + '<div class="hm-gloss-term">' + dot + term + '</div>'
      + '<div class="hm-gloss-def">' + def + '</div>'
      + '</div>';
  }

  function _render(cfg){
    var stepsHtml = '';
    if(cfg.steps && cfg.steps.length){
      stepsHtml = '<div class="hm-section">'
        + '<div class="hm-section-title">How to use it</div>'
        + '<div class="hm-steps">'
        + cfg.steps.map(function(s,i){ return _buildStep(i+1, s); }).join('')
        + '</div></div>';
    }
    var tipsHtml = '';
    if(cfg.tips && cfg.tips.length){
      tipsHtml = '<div class="hm-section">'
        + '<div class="hm-section-title">Key tips</div>'
        + '<div class="hm-tips">'
        + cfg.tips.map(function(t){ return _buildTip(t.icon, t.title, t.body); }).join('')
        + '</div></div>';
    }
    var glossHtml = '';
    if(cfg.glossary && cfg.glossary.length){
      glossHtml = '<div class="hm-section">'
        + '<div class="hm-section-title">Glossary &amp; Legend</div>'
        + '<div class="hm-glossary">'
        + cfg.glossary.map(function(g){ return _buildGlossRow(g.term, g.def, g.color||null); }).join('')
        + '</div></div>';
    }
    var aiHtml = '';
    if(cfg.ai){
      aiHtml = '<div class="hm-ai-badge">'
        + '<div class="hm-ai-icon">&#x2728;</div>'
        + '<div class="hm-ai-text">' + cfg.ai + '</div>'
        + '</div>';
    }
    return '<div class="hm-overlay" id="hm-overlay" role="dialog" aria-modal="true" aria-label="How to use ' + (cfg.title||'this tool') + '">'
      + '<div class="hm-box">'
      + '<div class="hm-head">'
      + '<div class="hm-title-block">'
      + '<div class="hm-eyebrow">VER Intelligence Hub &middot; How to Use</div>'
      + '<div class="hm-title">' + (cfg.title||'How to Use This Tool') + '</div>'
      + '</div>'
      + '<button class="hm-close" id="hm-close-x" aria-label="Close help">&#10005;</button>'
      + '</div>'
      + '<div class="hm-body">'
      + '<div class="hm-what">'
      + '<div class="hm-what-label">What this tool does</div>'
      + '<div class="hm-what-text">' + (cfg.what||'') + '</div>'
      + '</div>'
      + stepsHtml
      + tipsHtml
      + glossHtml
      + aiHtml
      + '</div>'
      + '<div class="hm-foot">'
      + '<span class="hm-foot-label">' + (cfg.footNote||'FY27 &middot; Salesforce DET &middot; Confidential') + '</span>'
      + '<button class="hm-foot-close" id="hm-close-foot">Got it</button>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  var _overlay = null;

  function open(cfg){
    _injectCss();
    if(_overlay){ close(); }
    var wrap = document.createElement('div');
    wrap.innerHTML = _render(cfg);
    _overlay = wrap.firstChild;
    document.body.appendChild(_overlay);

    // Apply theme class
    var box = _overlay.querySelector('.hm-box');
    var isPortalLight = document.body.classList.contains('light-mode') && document.body.hasAttribute('data-portal');
    if(isPortalLight) box.classList.add('hm-portal-light');
    else if(_isDark()) box.classList.add('hm-dark');

    // Trigger animation
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        _overlay.classList.add('hm-visible');
      });
    });

    // Close handlers
    document.getElementById('hm-close-x').addEventListener('click', close);
    document.getElementById('hm-close-foot').addEventListener('click', close);
    _overlay.addEventListener('click', function(e){
      if(e.target === _overlay) close();
    });
    document.addEventListener('keydown', _onKey);
  }

  function close(){
    if(!_overlay) return;
    _overlay.classList.remove('hm-visible');
    var el = _overlay;
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 250);
    _overlay = null;
    document.removeEventListener('keydown', _onKey);
  }

  function _onKey(e){
    if(e.key === 'Escape') close();
  }

  root.HelpModal = { open: open, close: close };
})(window);
