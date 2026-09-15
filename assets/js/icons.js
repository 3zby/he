/* ==========================================================
   مكتبة الأيقونات — تُحقن مرة واحدة في كل صفحة
   الاستخدام:  <svg class="ic"><use href="#i-code"></use></svg>
   ========================================================== */
(function () {
  'use strict';

  var ICONS = {
    'i-code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    'i-terminal': '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    'i-play': '<polygon points="7 4 20 12 7 20 7 4"/>',
    'i-stop': '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    'i-refresh': '<polyline points="21 4 21 10 15 10"/><path d="M20 14a8 8 0 1 1-2.3-7.7L21 9"/>',
    'i-chevron': '<polyline points="6 9 12 15 18 9"/>',
    'i-arrow': '<line x1="20" y1="12" x2="4" y2="12"/><polyline points="11 5 4 12 11 19"/>',
    'i-up': '<line x1="12" y1="20" x2="12" y2="4"/><polyline points="5 11 12 4 19 11"/>',
    'i-down': '<line x1="12" y1="4" x2="12" y2="20"/><polyline points="19 13 12 20 5 13"/>',
    'i-check': '<polyline points="20 6 9 17 4 12"/>',
    'i-close': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'i-menu': '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    'i-bolt': '<polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"/>',
    'i-sparkles': '<path d="M12 3l1.7 4.4L18 9l-4.3 1.6L12 15l-1.7-4.4L6 9l4.3-1.6z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    'i-brain': '<path d="M9.5 4.5A2.5 2.5 0 0 0 7 7a2.6 2.6 0 0 0-1.6 4.4A2.7 2.7 0 0 0 6.6 16a2.6 2.6 0 0 0 4.9 1V6.5a2.5 2.5 0 0 0-2-2z"/><path d="M14.5 4.5A2.5 2.5 0 0 1 17 7a2.6 2.6 0 0 1 1.6 4.4A2.7 2.7 0 0 1 17.4 16a2.6 2.6 0 0 1-4.9 1"/>',
    'i-rocket': '<path d="M12 2.5c3.8 2.8 5.8 6.6 5.8 10.4l-2.4 2.6h-6.8L6.4 12.9C6.4 9.1 8.2 5.3 12 2.5z"/><circle cx="12" cy="9.6" r="1.9"/><path d="M9 15.5L6.8 20l3-1.3M15 15.5L17.2 20l-3-1.3"/>',
    'i-shield': '<path d="M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z"/><polyline points="8.6 12 11 14.4 15.4 10"/>',
    'i-chart': '<line x1="4" y1="20" x2="4" y2="12"/><line x1="11" y1="20" x2="11" y2="5"/><line x1="18" y1="20" x2="18" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>',
    'i-globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
    'i-phone': '<rect x="7" y="2" width="10" height="20" rx="2.6"/><line x1="10.8" y1="18.4" x2="13.2" y2="18.4"/>',
    'i-gamepad': '<rect x="2" y="8" width="20" height="10" rx="4.5"/><line x1="7" y1="11.5" x2="7" y2="14.5"/><line x1="5.5" y1="13" x2="8.5" y2="13"/><circle cx="15.8" cy="12.2" r=".9"/><circle cx="18.2" cy="14.4" r=".9"/>',
    'i-robot': '<rect x="4" y="8" width="16" height="12" rx="3.4"/><circle cx="9.2" cy="14" r="1.3"/><circle cx="14.8" cy="14" r="1.3"/><path d="M10 17.2h4"/><line x1="12" y1="4.6" x2="12" y2="8"/><circle cx="12" cy="3.4" r="1.4"/>',
    'i-heart': '<path d="M12 20.2S4.8 15.7 4.8 10.6A3.8 3.8 0 0 1 12 8.3a3.8 3.8 0 0 1 7.2 2.3c0 5.1-7.2 9.6-7.2 9.6z"/>',
    'i-book': '<path d="M4.5 5A2 2 0 0 1 6.5 3H20v16H6.5a2 2 0 0 0-2 2z"/><line x1="8.5" y1="7.5" x2="16" y2="7.5"/>',
    'i-briefcase': '<rect x="2.5" y="7" width="19" height="13" rx="2.6"/><path d="M9 7V5.4A1.4 1.4 0 0 1 10.4 4h3.2A1.4 1.4 0 0 1 15 5.4V7"/><line x1="2.5" y1="12.5" x2="21.5" y2="12.5"/>',
    'i-clock': '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
    'i-users': '<circle cx="9" cy="8" r="3.3"/><path d="M2.6 20a6.4 6.4 0 0 1 12.8 0"/><circle cx="17.6" cy="9" r="2.6"/><path d="M16.4 15.2a5.4 5.4 0 0 1 5.2 4.8"/>',
    'i-target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
    'i-cpu': '<rect x="6" y="6" width="12" height="12" rx="2.4"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx="1"/><path d="M9.5 2.5v3.5M14.5 2.5v3.5M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>',
    'i-layers': '<polygon points="12 2.5 21.5 7.2 12 12 2.5 7.2"/><polyline points="2.5 12.4 12 17 21.5 12.4"/><polyline points="2.5 17 12 21.6 21.5 17"/>',
    'i-database': '<ellipse cx="12" cy="5.4" rx="8" ry="3"/><path d="M4 5.4v13.2c0 1.7 3.6 3 8 3s8-1.3 8-3V5.4"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    'i-wand': '<line x1="4" y1="20" x2="13.5" y2="10.5"/><path d="M16.5 3.5l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z"/><path d="M20 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    'i-grad': '<polygon points="12 3 22.5 8 12 13 1.5 8"/><path d="M6.5 10.4V16c0 1.7 2.5 3.2 5.5 3.2s5.5-1.5 5.5-3.2v-5.6"/>',
    'i-star': '<polygon points="12 3 14.7 9.3 21.6 10 16.4 14.5 17.9 21.3 12 17.7 6.1 21.3 7.6 14.5 2.4 10 9.3 9.3"/>',
    'i-youtube': '<rect x="2" y="5" width="20" height="14" rx="4.4"/><polygon points="10.4 9 15.6 12 10.4 15"/>',
    'i-light': '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.4 10.9V16h6.8v-2.1A6 6 0 0 0 12 3z"/>',
    'i-fire': '<path d="M12 21c3.6 0 6-2.4 6-5.6 0-4.4-4-5.6-4-9.4-2.6 1.2-3.4 3.6-3.4 5.6-1-.6-1.6-1.6-1.6-2.8C7 10 6 12 6 15.4 6 18.6 8.4 21 12 21z"/>',
    'i-link': '<path d="M9.5 14.5l5-5"/><path d="M11 6.5l1.8-1.8a3.8 3.8 0 0 1 5.4 5.4L16.5 12"/><path d="M13 17.5l-1.8 1.8a3.8 3.8 0 0 1-5.4-5.4L7.5 12"/>',
    'i-text': '<polyline points="4 6 20 6"/><polyline points="4 12 15 12"/><polyline points="4 18 18 18"/><line x1="20" y1="15" x2="20" y2="21"/>'
  };

  function build() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sprite');
    svg.setAttribute('aria-hidden', 'true');
    var inner = '';
    Object.keys(ICONS).forEach(function (key) {
      inner += '<symbol id="' + key + '" viewBox="0 0 24 24">' + ICONS[key] + '</symbol>';
    });
    svg.innerHTML = '<defs>' + inner + '</defs>';
    document.body.insertBefore(svg, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
