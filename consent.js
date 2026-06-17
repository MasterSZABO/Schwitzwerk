/* ============================================================
   SCHWITZWERK – Cookie-Consent-Banner (DSGVO)
   - Kategorien: Notwendig (immer), Statistik, Marketing
   - Tracking lädt erst NACH Zustimmung (siehe API unten)
   - Auswahl in localStorage 'sw_consent'
   - mehrsprachig (liest 'sw_lang' der Seite)

   Tracking später so einbinden:
     window.addEventListener('sw-consent-change', applyTracking);
     document.addEventListener('DOMContentLoaded', applyTracking);
     function applyTracking(){
       if (SWConsent.allowed('statistics')) { ...GA4 laden... }
       if (SWConsent.allowed('marketing'))  { ...Google Ads / Meta-Pixel laden... }
     }
   ============================================================ */
(function(){
  var KEY = 'sw_consent';

  var T = {
    de:{ title:"Cookies",
      body:"Notwendige Cookies für den Betrieb, Statistik &amp; Marketing nur mit Ihrer Einwilligung. <a href='datenschutz.html'>Datenschutz</a>.",
      necessary:"Notwendig", statistics:"Statistik", marketing:"Marketing",
      settings:"Einstellungen", reject:"Ablehnen", accept:"Akzeptieren", save:"Speichern", manage:"Cookie-Einstellungen" },
    en:{ title:"Cookies",
      body:"Necessary cookies to run the site, statistics &amp; marketing only with your consent. <a href='datenschutz.html'>Privacy</a>.",
      necessary:"Necessary", statistics:"Statistics", marketing:"Marketing",
      settings:"Settings", reject:"Reject", accept:"Accept", save:"Save", manage:"Cookie settings" },
    fr:{ title:"Cookies",
      body:"Cookies nécessaires au fonctionnement, statistiques &amp; marketing uniquement avec votre consentement. <a href='datenschutz.html'>Confidentialité</a>.",
      necessary:"Nécessaires", statistics:"Statistiques", marketing:"Marketing",
      settings:"Paramètres", reject:"Refuser", accept:"Accepter", save:"Enregistrer", manage:"Paramètres des cookies" },
    ru:{ title:"Cookie",
      body:"Необходимые cookie — для работы сайта, статистика и маркетинг — только с вашего согласия. <a href='datenschutz.html'>Конфиденциальность</a>.",
      necessary:"Необходимые", statistics:"Статистика", marketing:"Маркетинг",
      settings:"Настройки", reject:"Отклонить", accept:"Принять", save:"Сохранить", manage:"Настройки cookie" },
    pl:{ title:"Cookies",
      body:"Niezbędne pliki cookie do działania strony, statystyka i marketing tylko za Twoją zgodą. <a href='datenschutz.html'>Prywatność</a>.",
      necessary:"Niezbędne", statistics:"Statystyka", marketing:"Marketing",
      settings:"Ustawienia", reject:"Odrzuć", accept:"Akceptuj", save:"Zapisz", manage:"Ustawienia cookie" }
  };

  function lang(){ try{ return localStorage.getItem('sw_lang') || 'de'; }catch(e){ return 'de'; } }
  function t(){ return T[lang()] || T.de; }

  function getConsent(){ try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){ return null; } }
  function store(stat, mkt){
    try{ localStorage.setItem(KEY, JSON.stringify({ v:1, ts:Date.now(), statistics:!!stat, marketing:!!mkt })); }catch(e){}
    try{ window.dispatchEvent(new CustomEvent('sw-consent-change', { detail:getConsent() })); }catch(e){}
  }

  // ── öffentliche API ──
  window.SWConsent = {
    get: getConsent,
    allowed: function(cat){ var c = getConsent(); return !!(c && c[cat]); },
    open: function(){ render(true); }
  };

  var banner = null;

  function close(){ if(banner){ banner.remove(); banner = null; } }

  function render(force){
    var c = getConsent();
    if (c && !force) return;            // schon entschieden → nichts zeigen
    close();
    var s = t();

    banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', s.title);
    banner.innerHTML =
      '<div class="cc-inner">' +
        '<div class="cc-text"><h4>' + s.title + '</h4><p>' + s.body + '</p></div>' +
        '<div class="cc-options" hidden>' +
          '<label class="cc-opt cc-opt--locked"><input type="checkbox" checked disabled> <span>' + s.necessary + '</span></label>' +
          '<label class="cc-opt"><input type="checkbox" data-cat="statistics"> <span>' + s.statistics + '</span></label>' +
          '<label class="cc-opt"><input type="checkbox" data-cat="marketing"> <span>' + s.marketing + '</span></label>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-btn cc-btn--ghost" data-act="settings">' + s.settings + '</button>' +
          '<button type="button" class="cc-btn cc-btn--ghost" data-act="reject">' + s.reject + '</button>' +
          '<button type="button" class="cc-btn cc-btn--solid" data-act="save" hidden>' + s.save + '</button>' +
          '<button type="button" class="cc-btn cc-btn--solid" data-act="accept">' + s.accept + '</button>' +
        '</div>' +
      '</div>';

    // vorhandene Auswahl vorbelegen (beim erneuten Öffnen)
    if (c){
      var st = banner.querySelector('[data-cat="statistics"]'); if(st) st.checked = !!c.statistics;
      var mk = banner.querySelector('[data-cat="marketing"]');  if(mk) mk.checked = !!c.marketing;
    }

    banner.addEventListener('click', function(e){
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (!act) return;
      if (act === 'settings'){
        banner.querySelector('.cc-options').hidden = false;
        banner.querySelector('[data-act="settings"]').hidden = true;
        banner.querySelector('[data-act="save"]').hidden = false;
      } else if (act === 'accept'){
        store(true, true); close();
      } else if (act === 'reject'){
        store(false, false); close();
      } else if (act === 'save'){
        var st = banner.querySelector('[data-cat="statistics"]').checked;
        var mk = banner.querySelector('[data-cat="marketing"]').checked;
        store(st, mk); close();
      }
    });

    document.body.appendChild(banner);
  }

  // „Cookie-Einstellungen"-Link automatisch in jeden Footer hängen
  function injectManageLink(){
    var s = t();
    [].forEach.call(document.querySelectorAll('.footer-legal'), function(nav){
      if (nav.querySelector('.cc-manage')) return;
      var a = document.createElement('a');
      a.href = 'javascript:void(0)';
      a.className = 'cc-manage';
      a.textContent = s.manage;
      a.addEventListener('click', function(e){ e.preventDefault(); window.SWConsent.open(); });
      nav.appendChild(a);
    });
  }

  function init(){ injectManageLink(); render(false); }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
