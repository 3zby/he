/* ==========================================================
   playground.js — مشغّل الأكواد + مكتبة الأمثلة + قوائم اليوتيوب
   يعمل على ثلاث صفحات: python.html / javascript.html / web.html
   ========================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1) قوائم يوتيوب — معرّفات حقيقية تم التحقق منها
     ========================================================== */
  var VIDEOS = {
    python: {
      title: 'قوائم شرح بايثون بالعربي',
      items: [
        { list: 'PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs', name: 'Mastering Python — تعلم بايثون', by: 'Elzero Web School', note: 'أساسيات متسلسلة ومنظمة للمبتدئ' },
        { list: 'PLuXY3ddo_8nzrO74UeZQVZOb5-wIS6krJ', name: 'دورة بايثون من الصفر كاملة', by: 'Codezilla', note: 'من الصفر إلى مستوى متقدم' },
        { list: 'PLNcg_FV9n7qZGfFl2ANI_zISzNp257Lwn', name: 'Python Ultimate Course', by: 'Data with Baraa', note: 'شرح عربي مع تطبيقات على البيانات' },
        { list: 'PL8DDsWuvM_EUnczEthzSfVage7-KfPXE3', name: 'كورس لغة بايثون في 30 يوم', by: 'اتعلم ببساطة', note: 'خطة يومية تناسب الطالب' },
        { list: 'PLYyqC4bNbCIcxKO_r77w5MN1SRRnnfvNQ', name: 'سلسلة دروس لغة البايثون', by: 'أكاديمية ترميز', note: 'دروس قصيرة ومتتابعة' },
        { list: 'PLUQDw_ve-LUAKfUt9BbYuva4Ix0kz8Yqz', name: 'تعلم بايثون في فيديو واحد', by: 'Python Arabic Community', note: 'مراجعة سريعة شاملة' }
      ]
    },
    javascript: {
      title: 'قوائم شرح جافاسكربت بالعربي',
      items: [
        { list: 'PLknwEmKsW8OuTqUDaFRBiAViDZ5uI3VcE', name: 'كورس جافا سكريبت كامل', by: 'Abdelrahman Gamal', note: 'شرح عربي مبسّط مع أمثلة' },
        { list: 'PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv', name: 'Learn JavaScript in Arabic', by: 'Elzero Web School', note: 'سلسلة شهيرة ومنظمة جدًا' },
        { list: 'PLYyqC4bNbCIeLEjcSPO61bsGPKEvYceb0', name: 'كورس جافا سكريبت شامل', by: 'أكاديمية ترميز', note: 'من الصفر خطوة بخطوة' },
        { list: 'PLZPZq0r_RZOO1zkgO4bIdfuLpizCeHYKv', name: 'JavaScript for beginners', by: 'Bro Code', note: 'بالإنجليزي — سريع ومباشر' }
      ]
    },
    web: {
      title: 'قوائم شرح تطوير الويب (HTML و CSS)',
      items: [
        { list: 'PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji', name: 'Learn HTML In Arabic', by: 'Elzero Web School', note: 'أساس لغة الصفحات من الصفر' },
        { list: 'PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe', name: 'Learn CSS In Arabic', by: 'Elzero Web School', note: 'التنسيق والتصميم والمتجاوب' },
        { list: 'PLDoPjvoNmBAzHSjcR-HnW9tnxyuye8KbF', name: 'HTML And CSS Template 1', by: 'Elzero Web School', note: 'تطبيق عملي على قالب كامل' },
        { list: 'PLDoPjvoNmBAzhFD3niPAa1C1gXG4cs14J', name: 'Front-End Developer Roadmap', by: 'Elzero Web School', note: 'خريطة طريق المطور الأمامي' }
      ]
    }
  };

  /* ==========================================================
     2) شاشة الإخراج المشتركة
     ========================================================== */
  function makeConsole(el) {
    var lines = [];
    function paint() {
      if (!el) return;
      el.innerHTML = lines.map(function (l) {
        return '<span class="' + (l.c || '') + '">' + esc(l.t) + '</span>';
      }).join('\n');
      el.scrollTop = el.scrollHeight;
    }
    return {
      write: function (t, c) { lines.push({ t: String(t), c: c || '' }); paint(); },
      clear: function () { lines = []; paint(); },
      focus: function () { if (el) el.scrollTop = el.scrollHeight; }
    };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ==========================================================
     3) مشغّل بايثون
        الوضع الأساسي: بايثون الحقيقي عبر Pyodide (يحتاج إنترنت)
        وضع احتياطي: مفسّر مبسّط يعمل بدون إنترنت
     ========================================================== */
  var PYD = {
    version: '0.26.4',
    base: 'https://cdn.jsdelivr.net/pyodide/',
    py: null,
    busy: false,

    url: function () { return this.base + 'v' + this.version + '/full/'; },

    load: function (onStatus) {
      var self = this;
      if (this.py) return Promise.resolve(this.py);
      if (this._p) return this._p;

      this._p = new Promise(function (resolve, reject) {
        onStatus && onStatus('جارٍ تحميل مترجم بايثون (أول مرة فقط، ~10 ثوانٍ)…', true);
        var s = document.createElement('script');
        s.src = self.url() + 'pyodide.js';
        s.onload = function () {
          if (!window.loadPyodide) { reject(new Error('Pyodide failed')); return; }
          window.loadPyodide({ indexURL: self.url() })
            .then(function (py) { self.py = py; resolve(py); })
            .catch(reject);
        };
        s.onerror = function () { reject(new Error('تعذّر الوصول إلى شبكة تحميل بايثون')); };
        document.head.appendChild(s);
      });
      this._p.catch(function () { self._p = null; });
      return this._p;
    },

    /* تشغيل بايثون الحقيقي */
    runReal: function (code, con, onStatus) {
      var self = this;
      this.busy = true;
      return this.load(onStatus).then(function (py) {
        onStatus && onStatus('بايثون 3 متصل — يتم التنفيذ الآن', false);
        var err = null;
        py.setStdout({ batched: function (t) { con.write(t); } });
        py.setStderr({ batched: function (t) { err = (err || '') + t; } });
        return py.runPythonAsync(code).then(function () {
          self.busy = false;
          if (err) con.write(err.trim(), 'err');
        });
      }).catch(function (e) {
        self.busy = false;
        con.write('⚠ ' + (e && e.message ? String(e.message).split('\n').slice(-1)[0] : e), 'err');
        con.write('سجّل هذا المثال في «وضع المحاكاة» أو افتحه لاحقًا والإنترنت متصل.', 'sys');
      });
    },

    /* تشغيل حسب الوضع المختار */
    run: function (code, con, mode, onStatus) {
      if (mode === 'sim') { con.write('[وضع المحاكاة المبسّط — ليس بايثون كاملًا]', 'sys'); runMini(code, con); return; }
      return this.runReal(code, con, onStatus);
    }
  };

  /* ---------- مفسّر بايثون مبسّط (بدون إنترنت) ---------- */
  /* يدعم: المتغيرات، print، f-string، for + range، if/elif/else، while،
     وبعض الدوال: len range str int float sum min max abs sorted list
     لا يدعم: الدوال def، الأصناف، القواميس المعقدة، input  */
  var UNSUPPORTED = [/\bdef\b/, /\bclass\b/, /\bimport\b/, /\binput\s*\(/, /\btry\b/, /\blambda\b/, /\bwith\b/, /\bwhile\s+True\b/];

  function pyToJsExpr(src, scope) {
    var s = src.trim();

    /* f-string → قالب نصي */
    s = s.replace(/f"([^"]*)"/g, function (m, body) {
      return '`' + body.replace(/\{([^}]+)\}/g, function (_, e) { return '${' + pyToJsExpr(e, scope) + '}'; }) + '`';
    });
    s = s.replace(/f'([^']*)'/g, function (m, body) {
      return '`' + body.replace(/\{([^}]+)\}/g, function (_, e) { return '${' + pyToJsExpr(e, scope) + '}'; }) + '`';
    });

    s = s.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
    s = s.replace(/\bnot\s+/g, '!').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');
    s = s.replace(/\belif\b/g, 'else if');
    s = s.replace(/\blen\s*\(/g, '__len(').replace(/\brange\s*\(/g, '__range(');
    s = s.replace(/\bstr\s*\(/g, 'String(').replace(/\bint\s*\(/g, '__int(').replace(/\bfloat\s*\(/g, 'Number(');
    s = s.replace(/\bsum\s*\(/g, '__sum(').replace(/\bmin\s*\(/g, 'Math.min.apply(null,')
         .replace(/\bmax\s*\(/g, 'Math.max.apply(null,');
    s = s.replace(/\babs\s*\(/g, 'Math.abs(').replace(/\bsorted\s*\(/g, '__sorted(');
    s = s.replace(/\blist\s*\(/g, 'Array.from(').replace(/\bappend\s*\(/g, 'push(');
    s = s.replace(/(\w+)\.push\(([^)]*)\)/g, '$1.push($2)');
    return s;
  }

  function runMini(code, con) {
    var scope = {
      __len: function (x) { return x == null ? 0 : x.length; },
      __range: function (a, b, c) {
        var start = (b === undefined) ? 0 : a, stop = (b === undefined) ? a : b, step = c || 1, out = [];
        if (step > 0) { for (var i = start; i < stop; i += step) out.push(i); }
        else { for (var j = start; j > stop; j += step) out.push(j); }
        return out;
      },
      __int: function (x) { return parseInt(x, 10) || 0; },
      __sum: function (a) { return (a || []).reduce(function (p, v) { return p + v; }, 0); },
      __sorted: function (a) { return (a || []).slice().sort(function (p, q) { return p > q ? 1 : p < q ? -1 : 0; }); }
    };

    function evalExpr(src) {
      var js = pyToJsExpr(src, scope);
      var keys = Object.keys(scope), vals = keys.map(function (k) { return scope[k]; });
      /* eslint-disable no-new-func */
      return Function.apply(null, keys.concat(['"use strict";return (' + js + ')'])).apply(null, vals);
    }

    function show(v) {
      if (Array.isArray(v)) return '[' + v.map(show).join(', ') + ']';
      if (v === true) return 'True';
      if (v === false) return 'False';
      if (v === null || v === undefined) return 'None';
      if (typeof v === 'number' && !Number.isInteger(v)) return String(Math.round(v * 1e10) / 1e10);
      return String(v);
    }

    var raw = String(code).replace(/\t/g, '    ').replace(/\r/g, '').split('\n');
    var lines = [];
    raw.forEach(function (l) {
      var t = l.replace(/#.*$/, '');
      if (t.trim() === '') return;
      lines.push({ ind: t.match(/^ */)[0].length, text: t.trim() });
    });

    for (var u = 0; u < lines.length; u++) {
      for (var k = 0; k < UNSUPPORTED.length; k++) {
        if (UNSUPPORTED[k].test(lines[u].text)) {
          con.write('هذا المثال يستخدم بناءً غير مدعوم في وضع المحاكاة (' + lines[u].text.split(' ')[0] + ').', 'err');
          con.write('بدّل إلى «بايثون الحقيقي» من الأعلى — يحتاج إنترنت.', 'sys');
          return;
        }
      }
    }

    var guard = 0;
    function block(start, ind) { var e = start; while (e < lines.length && lines[e].ind >= ind) e++; return e; }

    function exec(start, end, depth) {
      var i = start;
      while (i < end) {
        if (++guard > 4000) { con.write('توقّف التنفيذ: عدد تكرارات كثير جدًا.', 'err'); return; }
        var L = lines[i], m, b;

        /* حلقة for */
        if ((m = /^for\s+(\w+)\s+in\s+(.+):$/i.exec(L.text))) {
          b = block(i + 1, lines[i + 1] ? lines[i + 1].ind : 0);
          var seq = evalExpr(m[2]);
          if (!Array.isArray(seq)) seq = [seq];
          for (var q = 0; q < seq.length; q++) {
            scope[m[1]] = seq[q];
            exec(i + 1, b, depth + 1);
          }
          i = b; continue;
        }

        /* مجموعة شروط if / elif / else كسلسلة واحدة */
        if (/^(if|elif|else)\b/i.test(L.text) && /:$/.test(L.text)) {
          var j = i, branches = [];
          while (j < lines.length && lines[j].ind === L.ind && /^(if|elif|else)\b/i.test(lines[j].text)) {
            var cond = /^if\s+(.+):$/i.exec(lines[j].text) || /^elif\s+(.+):$/i.exec(lines[j].text);
            var s2 = j + 1, e2 = s2;
            while (e2 < lines.length && lines[e2].ind > L.ind) e2++;
            branches.push({ cond: cond ? cond[1] : null, start: s2, end: e2 });
            j = e2;
          }
          for (var k2 = 0; k2 < branches.length; k2++) {
            var br = branches[k2];
            try {
              if (br.cond === null || evalExpr(br.cond)) { exec(br.start, br.end, depth + 1); break; }
            } catch (err) {
              con.write('شرط غير مفهوم: ' + br.cond + '  →  ' + err.message, 'err'); break;
            }
          }
          i = j; continue;
        }

        /* دالة print */
        if ((m = /^print\s*\((.*)\)$/i.exec(L.text))) {
          var inner = m[1].trim();
          if (inner === '') { con.write(''); i++; continue; }
          var parts = splitArgs(inner).map(function (p) { return show(evalExpr(p)); });
          con.write(parts.join(' '));
          i++; continue;
        }

        /* إسناد متغيّر */
        if ((m = /^([A-Za-z_]\w*)\s*=\s*(.+)$/i.exec(L.text)) && !/^==$/.test(m[2])) {
          scope[m[1]] = evalExpr(m[2]);
          i++; continue;
        }

        /* عبارة مجرّدة */
        try { var v = evalExpr(L.text); if (v !== undefined) con.write(show(v)); }
        catch (e) { con.write('خطأ في السطر: ' + L.text + '  →  ' + e.message, 'err'); }
        i++;
      }
    }

    function splitArgs(s) {
      var out = [], d = 0, cur = '', q = null;
      for (var i2 = 0; i2 < s.length; i2++) {
        var ch = s[i2];
        if (q) { cur += ch; if (ch === q) q = null; continue; }
        if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
        if (ch === '(' || ch === '[') d++;
        if (ch === ')' || ch === ']') d--;
        if (ch === ',' && d === 0) { out.push(cur); cur = ''; continue; }
        cur += ch;
      }
      if (cur.trim()) out.push(cur);
      return out.map(function (x) { return x.trim(); });
    }

    try { exec(0, lines.length, 0); }
    catch (e) { con.write('⚠ ' + e.message, 'err'); }
  }

  /* ==========================================================
     4) مشغّل جافاسكربت (محرك المتصفح نفسه)
     ========================================================== */
  function runJS(code, con, demoEl) {
    var timer = null;
    var sandboxConsole = {
      log: function () { con.write(fmt(arguments)); },
      info: function () { con.write(fmt(arguments)); },
      warn: function () { con.write(fmt(arguments), 'sys'); },
      error: function () { con.write(fmt(arguments), 'err'); },
      table: function (v) { con.write(fmt([v])); }
    };
    function fmt(args) {
      var out = [];
      for (var i = 0; i < args.length; i++) {
        var v = args[i];
        if (typeof v === 'object' && v !== null) { try { v = JSON.stringify(v); } catch (e) { v = String(v); } }
        out.push(String(v));
      }
      return out.join(' ');
    }
    var api = {
      console: sandboxConsole,
      alert: function (m) { con.write('[alert] ' + m, 'sys'); },
      confirm: function () { con.write('[confirm] أرجع true تلقائيًا', 'sys'); return true; },
      prompt: function (m) { con.write('[prompt] ' + (m || '') + ' — أرجع قيمة الحقل «مدخل تجريبي»', 'sys');
        var f = $('#promptVal'); return f && f.value ? f.value : '10'; },
      write: function (h) { if (demoEl) demoEl.innerHTML += h; },
      setTimeout: function (fn, ms) { return setTimeout(function () { try { fn(); } catch (e) { con.write('⚠ ' + e.message, 'err'); } }, Math.min(ms || 0, 4000)); },
      setInterval: function (fn, ms) {
        var n = 0, id = setInterval(function () {
          try { fn(); } catch (e) { con.write('⚠ ' + e.message, 'err'); clearInterval(id); }
          if (++n > 40) { clearInterval(id); con.write('أُوقف المؤقّت تلقائيًا بعد 40 تكرارًا.', 'sys'); }
        }, Math.max(60, ms || 1000));
        timer = id;
        return id;
      },
      clearInterval: function (id) { clearInterval(id); }
    };
    api.window = window; api.document = document;
    try {
      /* eslint-disable no-new-func */
      var fn = new Function('console', 'alert', 'confirm', 'prompt', 'write', 'setTimeout', 'setInterval', 'clearInterval', '"use strict";\n' + code);
      fn(api.console, api.alert, api.confirm, api.prompt, api.write, api.setTimeout, api.setInterval, api.clearInterval);
      if (timer) con.write('ملاحظة: المؤقّت يعمل داخل الصفحة — اضغط «إيقاف» لإنهائه.', 'sys');
    } catch (e) {
      con.write('⚠ ' + (e.name || 'Error') + ': ' + e.message, 'err');
    }
    return function () { if (timer) clearInterval(timer); };
  }

  function fmtValue(v) {
    if (typeof v === 'string') return "'" + v + "'";
    if (v === undefined) return 'undefined';
    if (v === null) return 'None';
    if (typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return String(v); } }
    return String(v);
  }

  /* ==========================================================
     5) مكتبة الأكواد الجاهزة
     ========================================================== */
  var SNIPPETS = {

    python: [
      { t: 'مرحبًا بالعالم', d: 'أول برنامج', c:
'print("مرحبًا بكم في فعالية البرمجة!")\n' +
'print("الآن أنا أكتب كودًا يفهمه الحاسوب")' },

      { t: 'المتغيرات والأرقام', d: 'حسابات بسيطة', c:
'name = "أحمد"\n' +
'age = 16\n' +
'grade = 94.5\n\n' +
'print("الاسم:", name)\n' +
'print("العمر:", age)\n' +
'print("الدرجة:", grade)\n' +
'print("بعد 4 سنوات:", age + 4)' },

      { t: 'نص منسّق (f-string)', d: 'بطاقة طالب', c:
'student = "سارة"\n' +
'school = "مدرسة الملك عبدالله الثاني"\n' +
'score = 198\n\n' +
'print("=== بطاقة الطالب ===")\n' +
'print(f"الاسم   : {student}")\n' +
'print(f"المدرسة : {school}")\n' +
'print(f"الدرجة  : {score} من 200")\n' +
'print(f"النسبة  : {score / 200 * 100}%")' },

      { t: 'قائمة الدرجات', d: 'متوسط ومجموع', c:
'marks = [88, 92, 75, 100, 81]\n\n' +
'print("الدرجات:", marks)\n' +
'print("العدد  :", len(marks))\n' +
'print("المجموع:", sum(marks))\n' +
'print("المتوسط:", sum(marks) / len(marks))\n' +
'print("الأعلى  :", max(marks))\n' +
'print("الأقل   :", min(marks))' },

      { t: 'حلقة تكرار', d: 'جدول الضرب', c:
'num = 7\n\n' +
'print(f"جدول ضرب {num}:")\n' +
'for i in range(1, 11):\n' +
'    print(f"{num} × {i} = {num * i}")' },

      { t: 'شروط القرار', d: 'تقدير الطالب', c:
'score = 87\n\n' +
'if score >= 90:\n' +
'    print("التقدير: ممتاز")\n' +
'elif score >= 80:\n' +
'    print("التقدير: جيد جدًا")\n' +
'elif score >= 70:\n' +
'    print("التقدير: جيد")\n' +
'else:\n' +
'    print("التقدير: تحتاج مراجعة")' },

      { t: 'تحليل نص', d: 'دوال جاهزة', c:
'text = "Programming is fun"\n\n' +
'print("النص   :", text)\n' +
'print("الطول  :", len(text))\n' +
'print("أحرف كبيرة:", text.upper())\n' +
'print("عدد m :", text.count("m"))\n' +
'print("الكلمات:", text.split())' },

      { t: 'لعبة تخمين الرقم', d: 'شرط + حلقة', c:
'secret = 7\n' +
'tries = [3, 5, 9, 7]\n\n' +
'for i in range(len(tries)):\n' +
'    guess = tries[i]\n' +
'    if guess == secret:\n' +
'        print(f"المحاولة {i+1}: {guess} ← أحسنت! عرفت الرقم")\n' +
'    elif guess < secret:\n' +
'        print(f"المحاولة {i+1}: {guess} ← أقل من المطلوب")\n' +
'    else:\n' +
'        print(f"المحاولة {i+1}: {guess} ← أكبر من المطلوب")' }
    ],

    javascript: [
      { t: 'أول كود JS', d: 'طباعة في الكونسول', c:
'console.log("مرحبًا في فعالية البرمجة!");\n' +
'console.log("هذا الكود يعمل بلغة المتصفح نفسها");\n\n' +
'let year = 2026;\n' +
'console.log("السنة الحالية:", year);' },

      { t: 'المتغيرات والأنواع', d: 'let و const', c:
'let name = "خالد";\n' +
'const age = 17;\n' +
'let isStudent = true;\n' +
'let hobbies = ["برمجة", "كرة قدم", "قراءة"];\n\n' +
'console.log(typeof name, name);\n' +
'console.log(typeof age, age);\n' +
'console.log(typeof isStudent, isStudent);\n' +
'console.log("الاهتمامات:", hobbies);\n' +
'console.log("عددها:", hobbies.length);' },

      { t: 'دالة حساب المعدل', d: 'إرجاع قيمة', c:
'function average(marks) {\n' +
'  let total = 0;\n' +
'  for (let i = 0; i < marks.length; i++) {\n' +
'    total += marks[i];\n' +
'  }\n' +
'  return total / marks.length;\n' +
'}\n\n' +
'let myMarks = [92, 88, 100, 76];\n' +
'console.log("المعدل:", average(myMarks).toFixed(2));\n' +
'console.log("التقدير:", average(myMarks) >= 90 ? "ممتاز" : "جيد جدًا");' },

      { t: 'دوال المصفوفات', d: 'map filter reduce', c:
'let marks = [55, 88, 40, 96, 72, 61];\n\n' +
'let passed = marks.filter(function (m) { return m >= 60; });\n' +
'let doubled = marks.map(function (m) { return m * 2; });\n' +
'let total = marks.reduce(function (sum, m) { return sum + m; }, 0);\n\n' +
'console.log("الناجحون:", passed);\n' +
'console.log("الدرجات ×2:", doubled);\n' +
'console.log("المجموع:", total);' },

      { t: 'تعديل الصفحة (DOM)', d: 'جرّب وشاهد', c:
'// هذا الكود يغيّر عناصر حقيقية في الصفحة\n' +
'let out = document.getElementById("jsOut");\n' +
'let box = document.getElementById("jsBox");\n\n' +
'if (out) out.textContent = "تم تعديل النص بواسطة JavaScript ✅";\n' +
'if (box) {\n' +
'  box.style.background = "linear-gradient(135deg,#f5c451,#38bdf8)";\n' +
'  box.style.transform  = "rotate(8deg) scale(1.12)";\n' +
'  box.textContent      = "CSS + JS";\n' +
'}\n' +
'console.log("انزل إلى «صندوق التجربة» وسترى التغيير");' },

      { t: 'ربط زر بحدث', d: 'عدّاد نقرات', c:
'let btn = document.getElementById("jsBtn");\n' +
'let count = 0;\n\n' +
'if (btn) {\n' +
'  btn.onclick = function () {\n' +
'    count++;\n' +
'    btn.textContent = "عدد النقرات: " + count;\n' +
'    console.log("نقرة رقم", count);\n' +
'  };\n' +
'  console.log("اضغط الزر في «صندوق التجربة» بالأسفل");\n' +
'} else {\n' +
'  console.log("لم يُعثر على الزر في هذه الصفحة");\n' +
'}' },

      { t: 'عدّاد تنازلي', d: 'setInterval', c:
'let n = 5;\n' +
'console.log("بدء العدّ التنازلي…");\n\n' +
'let id = setInterval(function () {\n' +
'  console.log("باقي " + n + " ثانية");\n' +
'  if (n === 0) {\n' +
'    console.log("انطلق المشروع!");\n' +
'    clearInterval(id);\n' +
'  }\n' +
'  n--;\n' +
'}, 600);' },

      { t: 'توليد ألوان عشوائية', d: 'دالة + نص', c:
'function randomColor() {\n' +
'  let hex = "0123456789ABCDEF";\n' +
'  let color = "#";\n' +
'  for (let i = 0; i < 6; i++) {\n' +
'    color += hex[Math.floor(Math.random() * 16)];\n' +
'  }\n' +
'  return color;\n' +
'}\n\n' +
'for (let i = 1; i <= 5; i++) {\n' +
'  console.log("لون " + i + " ← " + randomColor());\n' +
'}' }
    ],

    web: [
      { t: 'بطاقة ترحيب', d: 'HTML + CSS + زر',
        html:
'<div class="card">\n' +
'  <img src="https://picsum.photos/seed/school/600/280" alt="صورة">\n' +
'  <div class="body">\n' +
'    <h1>فعالية البرمجة</h1>\n' +
'    <p>خطوتك الأولى نحو مستقبل تقني أوسع.</p>\n' +
'    <button onclick="greet()">اضغطني</button>\n' +
'    <span id="msg"></span>\n' +
'  </div>\n' +
'</div>',
        css:
'body{font-family:Cairo,sans-serif;background:#0b1226;color:#fff;\n' +
'     display:grid;place-items:center;min-height:95vh;margin:0}\n' +
'.card{width:min(340px,90%);background:#111a33;border-radius:22px;\n' +
'      overflow:hidden;box-shadow:0 24px 60px -20px #000;border:1px solid #ffffff1f}\n' +
'.card img{width:100%;height:150px;object-fit:cover;display:block}\n' +
'.body{padding:20px}\n' +
'h1{margin:0 0 6px;font-size:1.4rem}\n' +
'p{margin:0 0 16px;color:#9fb0d0;font-size:.95rem}\n' +
'button{background:#f5c451;border:0;color:#231a02;font-weight:800;\n' +
'       padding:11px 20px;border-radius:12px;cursor:pointer;font-family:inherit}\n' +
'button:hover{transform:translateY(-2px)}\n' +
'#msg{display:block;margin-top:12px;color:#38bdf8;font-weight:700}',
        js:
'function greet(){\n' +
'  document.getElementById("msg").textContent =\n' +
'    "أهلًا بك يا بطل البرمجة";\n' +
'}' },

      { t: 'شريط متجاوب', d: 'Flexbox + Media Query',
        html:
'<header>\n' +
'  <div class="logo">&lt;/&gt; نادي البرمجة</div>\n' +
'  <nav>\n' +
'    <a href="#">الرئيسية</a>\n' +
'    <a href="#">الدورات</a>\n' +
'    <a href="#">تواصل</a>\n' +
'  </nav>\n' +
'</header>\n' +
'<main>\n' +
'  <h2>غيّر حجم نافذة المعاينة!</h2>\n' +
'  <p>عندما يضيق العرض يتحوّل الشريط إلى سطرين تلقائيًا.</p>\n' +
'</main>',
        css:
'*{box-sizing:border-box}\n' +
'body{font-family:Cairo,sans-serif;margin:0;background:#0b1226;color:#eaf0ff}\n' +
'header{display:flex;gap:16px;align-items:center;justify-content:space-between;\n' +
'       padding:16px 22px;background:#111a33;border-bottom:1px solid #ffffff1f}\n' +
'.logo{font-weight:900;color:#f5c451}\n' +
'nav{display:flex;gap:8px;flex-wrap:wrap}\n' +
'nav a{color:#9fb0d0;text-decoration:none;padding:8px 14px;border-radius:10px;\n' +
'      background:#ffffff0d;font-weight:700;font-size:.9rem}\n' +
'nav a:hover{background:#f5c451;color:#231a02}\n' +
'main{padding:30px 22px}\n' +
'h2{margin:0 0 10px}\n' +
'@media(max-width:420px){\n' +
'  header{flex-direction:column;align-items:flex-start}\n' +
'  nav{width:100%;justify-content:space-between}\n' +
'}',
        js:
'console.log("جرّب زر «جوال» فوق المعاينة");' },

      { t: 'مربّع تفاعلي', d: 'أزرار تُحرّك عنصرًا',
        html:
'<div class="stage">\n' +
'  <div id="box">JS</div>\n' +
'  <div class="ctrl">\n' +
'    <button onclick="move()">حرّك</button>\n' +
'    <button onclick="color()">لوّن</button>\n' +
'    <button onclick="grow()">كبّر</button>\n' +
'  </div>\n' +
'</div>',
        css:
'body{font-family:Cairo;margin:0;background:#0b1226;color:#fff;padding:26px}\n' +
'.stage{display:grid;gap:20px;justify-items:center}\n' +
'#box{width:90px;height:90px;border-radius:20px;display:grid;place-items:center;\n' +
'     font-weight:900;font-size:1.4rem;background:#f7df1e;color:#231a02;\n' +
'     transition:all .45s cubic-bezier(.2,.8,.2,1)}\n' +
'.ctrl{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}\n' +
'button{background:#ffffff14;color:#fff;border:1px solid #ffffff26;\n' +
'       padding:10px 18px;border-radius:12px;cursor:pointer;\n' +
'       font-family:inherit;font-weight:800}\n' +
'button:hover{background:#ffffff24}',
        js:
'var b = document.getElementById("box");\n' +
'var x = 0;\n' +
'function move(){ x += 40; b.style.transform = "translateX(" + x + "px)"; }\n' +
'function color(){\n' +
'  b.style.background = "#" + Math.floor(Math.random()*16777215).toString(16);\n' +
'}\n' +
'function grow(){\n' +
'  var s = (parseFloat(b.dataset.s || 1) + .25);\n' +
'  b.dataset.s = s; b.style.transform = "scale(" + s + ")";\n' +
'}' }
    ]
  };

  /* ==========================================================
     6) ربط المشغّل بالواجهة
     ========================================================== */
  var stopJS = null;

  function wirePlayground(kind) {
    var area = $('#code'), out = $('#out'), status = $('#status');
    if (!area || !out) return;
    var con = makeConsole(out);
    var demo = $('#jsBox') ? $('#jsOut') : null;

    /* أمثلة جاهزة */
    var box = $('#snippets');
    if (box) {
      (SNIPPETS[kind] || []).forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip' + (i === 0 ? ' active' : '');
        b.innerHTML = '<b style="font-family:var(--mono);opacity:.6">' + (i + 1) + '</b> ' +
                      s.t + ' <span style="opacity:.6;font-weight:400">· ' + s.d + '</span>';
        b.title = s.d;
        b.addEventListener('click', function () {
          $$('.chip', box).forEach(function (c) { c.classList.remove('active'); });
          b.classList.add('active');
          area.value = kind === 'web' ? '' : s.c;
          if (kind === 'web') loadWebTemplate(s);
          con.clear();
          con.write('تم تحميل مثال «' + s.t + '» — اضغط شغّل الآن.', 'sys');
          area.focus();
        });
        box.appendChild(b);
      });
    }

    function setStatus(msg, spinning) {
      if (!status) return;
      status.innerHTML = (spinning ? '<span class="spin"></span> ' : '') + esc(msg);
      status.style.opacity = msg ? '1' : '.6';
    }

    function run() {
      var code = area.value;
      if (!code.trim()) { con.write('اكتب كودًا أولًا، أو اختر مثالًا جاهزًا من الأعلى.', 'sys'); return; }
      con.clear();
      if (kind === 'python') {
        var active = $$('.chip[data-mode]').filter(function (c) { return c.classList.contains('active'); })[0];
        var mode = active ? active.getAttribute('data-mode') : 'real';
        if (mode === 'sim') { setStatus('وضع المحاكاة', false); PYD.run(code, con, 'sim', setStatus); }
        else {
          setStatus('بايثون الحقيقي يعمل…', true);
          PYD.run(code, con, 'real', function (m, sp) { setStatus(m, sp); if (!sp) setTimeout(function () { setStatus('', false); }, 1800); });
        }
      } else if (kind === 'javascript') {
        if (stopJS) { stopJS(); stopJS = null; }
        stopJS = runJS(code, con, demo);
        setStatus('', false);
      }
    }

    var runBtn = $('#run');
    if (runBtn) runBtn.addEventListener('click', run);

    /* Ctrl+Enter لتشغيل */
    area.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
      if (e.key === 'Tab') {
        e.preventDefault();
        var st = area.selectionStart, en = area.selectionEnd;
        area.value = area.value.slice(0, st) + '    ' + area.value.slice(en);
        area.selectionStart = area.selectionEnd = st + 4;
      }
    });

    var clearBtn = $('#clear');
    if (clearBtn) clearBtn.addEventListener('click', function () { con.clear(); });

    var stopBtn = $('#stop');
    if (stopBtn) stopBtn.addEventListener('click', function () {
      if (stopJS) { stopJS(); stopJS = null; con.write('أُوقفت المؤقّتات.', 'sys'); }
      else con.write('لا توجد مؤقّتات عاملة.', 'sys');
    });

    var copyBtn = $('#copy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      area.select();
      try { document.execCommand('copy'); window.toast && window.toast('تم نسخ الكود 📋'); }
      catch (e) { window.toast && window.toast('انسخ الكود يدويًا'); }
      window.getSelection && window.getSelection().removeAllRanges();
    });

    var dlBtn = $('#download');
    if (dlBtn) dlBtn.addEventListener('click', function () {
      var ext = kind === 'python' ? 'py' : 'js';
      var blob = new Blob([area.value], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'code-event.' + ext;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      window.toast && window.toast('تم تنزيل الملف');
    });

    var rstBtn = $('#reset');
    if (rstBtn) rstBtn.addEventListener('click', function () {
      area.value = (SNIPPETS[kind] && SNIPPETS[kind][0]) ? SNIPPETS[kind][0].c : '';
      con.clear(); con.write('أُعيد الكود إلى المثال الأول.', 'sys');
    });

    /* أزرار الوضع (حقيقي / محاكاة) */
    $$('[data-mode]').forEach(function (c) {
      c.addEventListener('click', function () {
        $$('[data-mode]').forEach(function (o) { o.classList.remove('active'); });
        c.classList.add('active');
        setStatus(c.getAttribute('data-mode') === 'sim'
          ? 'وضع المحاكاة: يدعم الأساسيات فقط'
          : 'سيتم تحميل بايثون الحقيقي عند أول تشغيل', false);
      });
    });

    /* تحميل مثال افتراضي */
    if (SNIPPETS[kind] && SNIPPETS[kind][0] && kind !== 'web' && !area.value.trim()) {
      area.value = SNIPPETS[kind][0].c;
      con.write('مثال جاهز — اضغط «شغّل» أو Ctrl+Enter.', 'sys');
    }
  }

  /* ==========================================================
     7) محرّر تطوير الويب (معاينة حيّة)
     ========================================================== */
  function wireWeb() {
    var h = $('#wHtml'), c = $('#wCss'), j = $('#wJs'), fr = $('#preview');
    if (!h || !c || !j || !fr) return;
    var timer2 = null;

    function render() {
      var doc = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">' +
        '<style>' + c.value + '</style></head><body>' + h.value +
        '<script>try{' + j.value.replace(/<\/script>/gi, '') +
        '}catch(e){document.body.insertAdjacentHTML("beforeend",'+
        '"<pre style=\\"color:#fff;background:#b00;padding:10px;border-radius:8px\\">"+e+"</pre>")}<\/script></body></html>';
      fr.srcdoc = doc;
    }

    function schedule() { clearTimeout(timer2); timer2 = setTimeout(render, 550); }

    [h, c, j].forEach(function (ta) {
      ta.addEventListener('input', schedule);
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          var st = ta.selectionStart, en = ta.selectionEnd;
          ta.value = ta.value.slice(0, st) + '  ' + ta.value.slice(en);
          ta.selectionStart = ta.selectionEnd = st + 2;
          schedule();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); render(); }
      });
    });

    var up = $('#update'); if (up) up.addEventListener('click', render);

    /* تبديل حجم الشاشة */
    $$('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-view]').forEach(function (o) { o.classList.remove('active'); });
        b.classList.add('active');
        var w = b.getAttribute('data-view');
        fr.style.width = w === 'mobile' ? '380px' : '100%';
        fr.style.marginInline = w === 'mobile' ? 'auto' : '0';
        var stage = $('#previewStage');
        if (stage) stage.style.minHeight = w === 'mobile' ? '560px' : '';
      });
    });

    /* تبديل اللغات الثلاث */
    $$('[data-pane]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-pane]').forEach(function (o) { o.classList.remove('active'); });
        $$('[data-area]').forEach(function (a) { a.hidden = a.getAttribute('data-area') !== b.getAttribute('data-pane'); });
        b.classList.add('active');
      });
    });

    window.loadWebTemplate = function (s) {
      h.value = s.html; c.value = s.css; j.value = s.js;
      render();
    };

    /* أمثلة الويب */
    var box = $('#wSnippets');
    if (box) {
      SNIPPETS.web.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip' + (i === 0 ? ' active' : '');
        b.innerHTML = '<b style="font-family:var(--mono);opacity:.6">' + (i + 1) + '</b> ' + s.t +
                      ' <span style="opacity:.6;font-weight:400">· ' + s.d + '</span>';
        b.addEventListener('click', function () {
          $$('.chip', box).forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          loadWebTemplate(s);
          window.toast && window.toast('تم تحميل قالب «' + s.t + '»');
        });
        box.appendChild(b);
      });
    }

    if (SNIPPETS.web[0]) loadWebTemplate(SNIPPETS.web[0]);
    else render();
  }

  /* ==========================================================
     8) شبكة الفيديوهات
     ========================================================== */
  function wireVideos(kind) {
    var grid = $('#videoGrid'), data = VIDEOS[kind];
    if (!grid || !data) return;
    var t = $('#videoTitle'); if (t) t.textContent = data.title;

    var saved = null;
    try { saved = localStorage.getItem('codeEvent.playlist'); } catch (e) {}

    data.items.forEach(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'vid';
      b.setAttribute('data-play', 'https://www.youtube.com/playlist?list=' + it.list);
      b.innerHTML =
        '<span class="vid__ico"><svg class="ic"><use href="#i-youtube"></use></svg></span>' +
        '<span style="flex:1"><b>' + esc(it.name) + '</b>' +
        '<span>' + esc(it.by) + ' • ' + esc(it.note) + '</span></span>' +
        '<span class="mono" style="color:var(--muted-2);font-size:.75rem">' + (i + 1) + '</span>';
      grid.appendChild(b);
    });

    /* بطاقة «افتح في يوتيوب» لكل قائمة */
    var links = document.createElement('div');
    links.className = 'btn-row';
    links.style.cssText = 'justify-content:center;margin-top:6px';
    links.innerHTML = data.items.map(function (it) {
      return '<a class="btn btn--ghost btn--sm" target="_blank" rel="noopener" ' +
             'href="https://www.youtube.com/playlist?list=' + it.list + '">' + esc(it.by) + '</a>';
    }).join('');
    var holder = $('#videoLinks'); if (holder) holder.appendChild(links);

    /* التشغيل التلقائي لأول قائمة (أو المحفوظة) */
    var player = $('#player');
    if (player) {
      var first = saved || data.items[0].list;
      var name = data.items.filter(function (x) { return x.list === first; })[0];
      player.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=' + first + '&rel=0&modestbranding=1" ' +
        'title="' + esc(name ? name.name : 'قائمة شرح') + '" allow="accelerometer; autoplay; clipboard-write; ' +
        'encrypted-media; picture-in-picture; web-share" allowfullscreen ' +
        'referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      var firstBtn = $('.vid', grid); if (firstBtn) firstBtn.classList.add('active');
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-play]') : null;
      if (!btn || !player) return;
      var listId = btn.getAttribute('data-play').split('list=')[1];
      if (!listId) return;
      player.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=' + listId + '&rel=0&modestbranding=1" ' +
        'title="قائمة شرح" allow="accelerometer; autoplay; clipboard-write; encrypted-media; ' +
        'picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      $$('.vid', grid).forEach(function (o) { o.classList.remove('active'); });
      btn.classList.add('active');
      try { localStorage.setItem('codeEvent.playlist', listId); } catch (err) {}
    });
  }

  /* ==========================================================
     9) الإقلاع
     ========================================================== */
  function init() {
    var kind = document.body.getAttribute('data-lang');
    if (kind === 'web') wireWeb();
    if (kind === 'python' || kind === 'javascript') wirePlayground(kind);
    if (kind) wireVideos(kind);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.PG = { VIDEOS: VIDEOS, init: init };
})();
