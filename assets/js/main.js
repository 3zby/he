/* ==========================================================
   main.js — تفاعلات الواجهة العامة
   (الشريط، الظهور عند التمرير، العدّادات، الأسئلة، الاختبار، اليوتيوب)
   ========================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- إشعار قصير ---------- */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }
  window.toast = toast;

  /* ---------- شاشة الإقلاع ---------- */
  (function boot() {
    var boot_ = $('#boot'), txt = $('#bootText'), bar = $('#bootBar');
    if (!boot_) return;
    var line = '> init learning_env --mode=school';
    var i = 0;
    (function type() {
      if (i <= line.length) { txt.textContent = line.slice(0, i++); setTimeout(type, reduce ? 0 : 26); }
    })();
    requestAnimationFrame(function () { bar.style.width = '100%'; });
    window.addEventListener('load', function () {
      setTimeout(function () { boot_.classList.add('hide'); }, reduce ? 0 : 700);
    });
    setTimeout(function () { boot_.classList.add('hide'); }, 3500); // أمان
  })();

  /* ---------- شريط التنقل ---------- */
  (function nav() {
    var nav = $('#nav'), burger = $('#burger');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 14); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.innerHTML = '<svg class="ic"><use href="#' + (open ? 'i-close' : 'i-menu') + '"></use></svg>';
      });
      $$('#navMobile a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          burger.innerHTML = '<svg class="ic"><use href="#i-menu"></use></svg>';
        });
      });
    }

    /* تمييز القسم الحالي في القائمة */
    var links = $$('#navLinks a[href^="#"]');
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute('href').slice(1); if (id) map[id] = a; });
    var secs = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove('active'); });
          if (map[e.target.id]) map[e.target.id].classList.add('active');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(function (s) { io.observe(s); });
    }
  })();

  /* ---------- زر الأعلى ---------- */
  (function topBtn() {
    var btn = $('#topBtn'); if (!btn) return;
    var show = function () { btn.classList.toggle('show', window.scrollY > 620); };
    show(); window.addEventListener('scroll', show, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  })();

  /* ---------- الظهور عند التمرير ---------- */
  (function reveal() {
    var items = $$('.card, .path, .step, .stat, .faq__item, .vid, .quiz__card, .editor, .output, .player');
    if (!items.length || reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    $$('[data-stagger]').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.transitionDelay = (i * 70) + 'ms'; });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  })();

  /* ---------- عدّادات الأرقام ---------- */
  (function counters() {
    var els = $$('[data-count]'); if (!els.length) return;
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = reduce ? 0 : 1400, t0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - t0) / (dur || 1));
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: .5 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- أشرطة النسب ---------- */
  (function bars() {
    var rows = $$('.prog'); if (!rows.length) return;
    var fill = function (row) {
      var v = Math.max(0, Math.min(100, parseFloat(row.getAttribute('data-value')) || 0));
      var i = $('.bar i', row); if (i) i.style.width = v + '%';
    };
    if (!('IntersectionObserver' in window)) { rows.forEach(fill); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { fill(e.target); io.unobserve(e.target); } });
    }, { threshold: .4 });
    rows.forEach(function (r) { io.observe(r); });
  })();

  /* ---------- كتابة متحركة في الغلاف ---------- */
  (function typing() {
    var el = $('#typing'); if (!el) return;
    var full = el.getAttribute('data-text') || el.textContent;
    if (reduce) { el.textContent = full; return; }
    var i = 0;
    (function step() {
      el.textContent = full.slice(0, i++);
      if (i <= full.length) setTimeout(step, 22);
    })();
  })();

  /* ---------- تكرار شريط الماركيه للحركة السلسة ---------- */
  (function marquee() {
    var m = $('#marquee'); if (!m) return;
    m.innerHTML += m.innerHTML;
  })();

  /* ---------- صورة البوستر: بديل أنيق إن لم توجد ---------- */
  (function poster() {
    var fig = $('#poster'), img = $('#heroImg'); if (!fig || !img) return;
    var fallback = function () {
      fig.classList.add('poster--fallback');
      img.remove();
      var art = document.createElement('div');
      art.className = 'poster__art';
      art.innerHTML =
        '<div><h3 class="grad">فعالية البرمجة</h3>' +
        '<p>وتعلّمها — خطوتك الأولى نحو مستقبل تقني أوسع</p>' +
        '<p class="mono" style="margin-top:14px;font-size:.8rem;color:#6f81a6">' +
        'ضع الصورة باسم assets/img/hero.jpg</p></div>';
      fig.insertBefore(art, fig.firstChild);
    };
    if (img.complete && img.naturalWidth === 0) fallback();
    img.addEventListener('error', fallback, { once: true });
  })();

  /* ---------- الأسئلة الشائعة ---------- */
  (function faq() {
    var items = $$('#faqList .faq__item'); if (!items.length) return;
    items.forEach(function (item) {
      var q = $('.faq__q', item), a = $('.faq__a', item);
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (o) {
          o.classList.remove('open');
          $('.faq__a', o).style.maxHeight = '0px';
          $('.faq__q', o).setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ==========================================================
     الاختبار السريع
     ========================================================== */
  var QUIZ = [
    { q: 'أي لغة تُستخدم أساسًا لتنسيق شكل الصفحة وألوانها؟',
      a: ['HTML', 'CSS', 'Python', 'SQL'], ok: 1,
      why: 'CSS هي لغة التنسيق: الألوان والخطوط والترتيب والاستجابة للشاشات.' },
    { q: 'ما ناتج هذا السطر في بايثون؟  print(3 * 4)',
      a: ['34', '7', '12', '3*4'], ok: 2,
      why: 'النجمة علامة الضرب في بايثون، والناتج 12 يُطبع في الشاشة.' },
    { q: 'أي مما يلي يعمل مباشرة داخل متصفح الإنترنت؟',
      a: ['JavaScript', 'Java', 'C++', 'PHP'], ok: 0,
      why: 'جافاسكربت هي لغة المتصفح الافتراضية — تشغّل التفاعلات والحركات.' },
    { q: 'ماذا نسمّي الخطأ الذي يمنع البرنامج من العمل؟',
      a: ['Patch', 'Bug', 'Loop', 'Deploy'], ok: 1,
      why: 'يُسمّى Bug (حشرة) — والبحث عنه وإصلاحه جزء طبيعي من عمل المبرمج.' },
    { q: 'ما أفضل طريقة لترسيخ ما تعلمته في البرمجة؟',
      a: ['حفظ الأكواد', 'مشاهدة الفيديوهات فقط', 'بناء مشروع صغير بيدك', 'انتظار الامتحان'], ok: 2,
      why: 'التطبيق هو التعلّم. مشروع صغير يثبّت أكثر من عشر ساعات مشاهدة.' }
  ];

  (function quiz() {
    var box = $('#quizCard'); if (!box) return;
    var qEl = $('#quizQ'), oEl = $('#quizOpts'), hint = $('#quizHint'),
        bar = $('#quizBar'), score = $('#quizScore'),
        next = $('#quizNext'), restart = $('#quizRestart');
    var idx = 0, points = 0, locked = false;

    function render() {
      var item = QUIZ[idx];
      locked = false;
      qEl.textContent = (idx + 1) + '. ' + item.q;
      oEl.innerHTML = '';
      hint.textContent = '';
      next.hidden = true;
      restart.hidden = true;
      item.a.forEach(function (text, i) {
        var b = document.createElement('button');
        b.className = 'quiz__opt';
        b.type = 'button';
        b.innerHTML = '<span class="k">' + 'أبتدج'.charAt(i) + '.</span><span>' + text + '</span>';
        b.addEventListener('click', function () { answer(i, b); });
        oEl.appendChild(b);
      });
      bar.style.width = (idx / QUIZ.length * 100) + '%';
      score.textContent = points + ' / ' + QUIZ.length;
    }

    function answer(i, btn) {
      if (locked) return;
      locked = true;
      var item = QUIZ[idx];
      $$('.quiz__opt', oEl).forEach(function (b, n) {
        b.disabled = true;
        if (n === item.ok) b.classList.add('right');
      });
      if (i === item.ok) { points++; hint.innerHTML = '<span class="ok" style="color:var(--green)">إجابة صحيحة ✓</span> ' + item.why; }
      else { btn.classList.add('wrong'); hint.innerHTML = '<span style="color:var(--rose)">الصحيح موضّح بالأخضر</span> — ' + item.why; }
      score.textContent = points + ' / ' + QUIZ.length;
      bar.style.width = ((idx + 1) / QUIZ.length * 100) + '%';
      if (idx + 1 < QUIZ.length) next.hidden = false;
      else {
        restart.hidden = false;
        var done = document.createElement('p');
        done.style.cssText = 'margin:14px 0 0;font-weight:900;color:var(--gold-2)';
        done.textContent = 'نتيجتك: ' + points + ' من ' + QUIZ.length +
          (points === QUIZ.length ? ' — ممتاز! أنت جاهز لتبدأ مسارًا 💻' :
           points >= 3 ? ' — أساس جيد، ابدأ بمسار بايثون' : ' — لا يهم، البداية هي الأهم. ابدأ من الغلاف');
        box.appendChild(done);
      }
    }

    next.addEventListener('click', function () { idx++; render(); });
    restart.addEventListener('click', function () {
      idx = 0; points = 0;
      $$('.quiz__card p[style]', box).forEach(function (p) { if (p !== hint) p.remove(); });
      render();
    });
    render();
  })();

  /* ==========================================================
     اليوتيوب: مشغّل + قوائم قابلة للّصق (تُحفظ في المتصفح)
     ========================================================== */
  var YT = window.YT = {
    /* حوّل أي رابط يوتيوب (فيديو أو قائمة) إلى رابط تضمين */
    parse: function (url) {
      if (!url) return null;
      var s = String(url).trim(), vid = null, list = null;
      var m = s.match(/[?&]v=([A-Za-z0-9_-]{6,})/);        if (m) vid = m[1];
      m = s.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);        if (m && !vid) vid = m[1];
      m = s.match(/shorts\/([A-Za-z0-9_-]{6,})/);           if (m && !vid) vid = m[1];
      m = s.match(/embed\/([A-Za-z0-9_-]{6,})/);            if (m && !vid) vid = m[1];
      m = s.match(/[?&]list=([A-Za-z0-9_-]{8,})/);          if (m) list = m[1];
      if (/^PL[A-Za-z0-9_-]{8,}$/.test(s)) list = s;        // لصق معرّف القائمة مباشرة
      if (/^[A-Za-z0-9_-]{11}$/.test(s)) vid = s;           // لصق معرّف الفيديو مباشرة
      if (!vid && !list) return null;
      var src = 'https://www.youtube-nocookie.com/embed/';
      src += vid ? vid : '';
      src += list ? (vid ? '' : 'videoseries') : '';
      src += '?rel=0&playsinline=1&modestbranding=1';
      if (list) src += '&list=' + list;
      return { src: src, videoId: vid, playlistId: list };
    },

    /* رابط بحث مضمون العمل (بديل آمن عن الروابط الثابتة) */
    search: function (q) {
      return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
    },

    /* تشغيل داخل الإطار الموجود في الصفحة */
    play: function (url, label) {
      var holder = document.getElementById('player');
      if (!holder) { window.open(this.parse(url) ? this.parse(url).src : url, '_blank'); return false; }
      var info = this.parse(url);
      if (!info) { toast('الرابط غير مفهوم — تأكد أنه رابط يوتيوب'); return false; }
      holder.innerHTML = '<iframe src="' + info.src + '" title="' + (label || 'فيديو تعليمي') +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" ' +
        'allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      return true;
    },

    /* حفظ قائمة تشغيل يختارها المشرف — تُطبَّق في كل الصفحات */
    savePlaylist: function (url, name) {
      var info = this.parse(url);
      if (!info || !info.playlistId) { toast('الصق رابط قائمة تشغيل (يحتوي على &list=...)'); return false; }
      try {
        localStorage.setItem('codeEvent.playlist', info.playlistId);
        localStorage.setItem('codeEvent.playlistName', name || 'قائمة التشغيل المعتمدة');
      } catch (e) { /* وضع خاص/متصفح قديم */ }
      toast('تم حفظ القائمة ✅');
      return true;
    },
    getPlaylist: function () {
      try { return { id: localStorage.getItem('codeEvent.playlist'), name: localStorage.getItem('codeEvent.playlistName') }; }
      catch (e) { return { id: null, name: null }; }
    },
    clearPlaylist: function () {
      try { localStorage.removeItem('codeEvent.playlist'); localStorage.removeItem('codeEvent.playlistName'); } catch (e) {}
      toast('أُزيلت القائمة المحفوظة');
    },

    /* يربط عناصر الواجهة: [data-yt-play], [data-yt-open], [data-yt-save] */
    bind: function (scope) {
      scope = scope || document;
      $$('[data-yt-play]', scope).forEach(function (el) {
        if (el._yt) return; el._yt = 1;
        el.addEventListener('click', function () {
          var ok = YT.play(el.getAttribute('data-yt-play'), el.textContent.trim());
          if (ok) {
            $$('[data-yt-play]').forEach(function (o) { o.classList.remove('active'); });
            el.classList.add('active');
            var p = $('#player'); if (p) p.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
          }
        });
      });
      $$('[data-yt-open]', scope).forEach(function (el) {
        if (el._yto) return; el._yto = 1;
        el.setAttribute('href', YT.search(el.getAttribute('data-yt-open')));
        el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener');
      });
      $$('[data-yt-save]', scope).forEach(function (el) {
        if (el._yts) return; el._yts = 1;
        el.addEventListener('click', function () {
          var input = el.parentNode.querySelector('input');
          if (input && YT.savePlaylist(input.value)) { input.value = ''; buildPlaylistCard(); }
        });
      });
      $$('[data-yt-clear]', scope).forEach(function (el) {
        if (el._ytc) return; el._ytc = 1;
        el.addEventListener('click', function () { YT.clearPlaylist(); buildPlaylistCard(); });
      });
    }
  };

  /* بطاقة «قائمة الفصل» تظهر تلقائيًا فوق شبكة الفيديوهات */
  function buildPlaylistCard() {
    var slot = document.getElementById('playlistSlot'); if (!slot) return;
    var p = YT.getPlaylist();
    if (!p.id) {
      slot.innerHTML =
        '<div class="card" style="padding:20px 22px">' +
        '<h3 style="margin:0 0 6px;font-size:1.02rem">🎬 قائمة تشغيل الفصل</h3>' +
        '<p style="margin:0 0 14px">مشرف النشاط يلصق رابط قائمة اليوتيوب مرة واحدة، فتظهر هنا وفي كل صفحات المسار.</p>' +
        '<div class="paste">' +
        '<input type="url" placeholder="https://www.youtube.com/playlist?list=..." aria-label="رابط قائمة التشغيل">' +
        '<button class="btn btn--gold btn--sm" data-yt-save>احفظ القائمة</button></div></div>';
      YT.bind(slot);
      return;
    }
    slot.innerHTML =
      '<div class="card" style="padding:20px 22px">' +
      '<h3 style="margin:0 0 6px;font-size:1.02rem">🎬 ' + (p.name || 'قائمة التشغيل المعتمدة') + '</h3>' +
      '<p class="mono" style="margin:0 0 14px;font-size:.78rem;color:var(--muted-2)">list=' + p.id + '</p>' +
      '<div class="btn-row">' +
      '<button class="btn btn--gold btn--sm" data-yt-play="https://www.youtube.com/playlist?list=' + p.id + '">شغّل القائمة هنا</button>' +
      '<a class="btn btn--ghost btn--sm" href="https://www.youtube.com/playlist?list=' + p.id + '" target="_blank" rel="noopener">افتح في يوتيوب</a>' +
      '<button class="btn btn--ghost btn--sm" data-yt-clear>إزالة</button></div></div>';
    YT.bind(slot);
  }

  document.addEventListener('DOMContentLoaded', function () {
    YT.bind(document);
    buildPlaylistCard();
  });
})();
