// Garbh Sanskar calendar: today's story, thought and week from a last period date or due date.
// Works in the browser only; the date is never sent anywhere. Same day → content rule as the app.
(() => {
  const dataEl = document.getElementById('cal-data');
  const form = document.querySelector('[data-cal-form]');
  const out = document.querySelector('[data-cal-result]');
  if (!dataEl || !form || !out) return;
  const data = JSON.parse(dataEl.textContent || '{}');
  const DAY = 86400000;
  const KEY = 'wt-cal';

  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  const pick = (list, d) => list[(((d - 1) % list.length) + list.length) % list.length];
  const parse = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  };
  const todayUtc = () => {
    const n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  };
  const fmt = (t) =>
    new Date(t).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
  const store = {
    get() {
      try {
        return JSON.parse(localStorage.getItem(KEY) || 'null');
      } catch {
        return null;
      }
    },
    set(v) {
      try {
        if (v) localStorage.setItem(KEY, JSON.stringify(v));
        else localStorage.removeItem(KEY);
      } catch {
        /* private mode */
      }
    },
  };

  let lmp = null;
  let shown = 0; // pregnancy day on screen

  function weekFor(day) {
    const w = Math.min(40, Math.max(1, Math.ceil(day / 7)));
    return data.weeks.find((x) => x.w === w) || data.weeks.find((x) => x.w >= w);
  }

  function render() {
    const day = shown;
    const date = lmp + (day - 1) * DAY;
    const isToday = date === todayUtc();
    const st = pick(data.stories, day);
    const th = pick(data.thoughts, day);
    const wk = weekFor(day);
    const left = 280 - day;
    const when =
      day < 1
        ? 'Before your pregnancy began'
        : `Day ${day} · ${Math.floor((day - 1) / 7)} weeks ${(day - 1) % 7} days` +
          (left > 0 ? ` · about ${left} days to go` : left === 0 ? ' · due date' : '');
    const next = [];
    for (let i = 1; i <= 6; i++) {
      const d = day + i;
      const s = pick(data.stories, d);
      next.push(
        `<li><span class="muted">${fmt(lmp + (d - 1) * DAY)} · Day ${d}</span> <a href="/stories/${esc(s.id)}/">${esc(s.e)} ${esc(s.t)}</a></li>`,
      );
    }
    out.innerHTML = `
      <div class="card cal-today">
        <p class="chip">${isToday ? 'Today' : esc(fmt(date))}</p>
        <h2>${esc(when)}</h2>
        ${wk && day >= 1 ? `<p><a href="/pregnancy-week/${wk.w}/">${esc(wk.e)} Week ${wk.w}: baby is about the size of a ${esc(wk.n.toLowerCase())} →</a></p>` : ''}
        <div class="cal-pair">
          <a class="card" href="/stories/${esc(st.id)}/"><span class="big-emoji" aria-hidden="true">${esc(st.e)}</span>
            <span class="small">Story of the day</span><strong>${esc(st.t)}</strong><span class="muted">${esc(st.h)}</span></a>
          <a class="card thought" href="/thoughts/#${esc(th.id)}"><span class="big-emoji" aria-hidden="true">${esc(th.e)}</span>
            <span class="small">Thought of the day · ${esc(th.s)}</span><span>${esc(th.t)}</span>
            <span lang="hi" class="muted">${esc(th.th)}</span>
            <span class="say">💬 Say to baby: ${esc(th.y)}</span></a>
        </div>
        <nav class="pager" aria-label="Days">
          <button type="button" class="btn btn-ghost" data-move="-1">← Previous day</button>
          ${isToday ? '' : '<button type="button" class="btn btn-ghost" data-move="0">Today</button>'}
          <button type="button" class="btn btn-ghost" data-move="1">Next day →</button>
        </nav>
        <h3>Coming up</h3>
        <ul class="cal-next">${next.join('')}</ul>
        <div class="share">
          <button type="button" class="btn" data-cal-copy>🔗 Copy my calendar link</button>
          <a class="btn btn-ghost" href="/">🌸 Open the app</a>
          <button type="button" class="btn btn-ghost" data-cal-forget>Forget my date</button>
        </div>
      </div>`;
    out.hidden = false;
  }

  function show(kind, iso, scroll) {
    const t = parse(iso);
    if (t === null) return;
    lmp = kind === 'edd' ? t - 280 * DAY : t;
    shown = Math.round((todayUtc() - lmp) / DAY) + 1;
    store.set({ kind, iso });
    history.replaceState(null, '', `#${kind}=${iso}`);
    form.elements.kind.value = kind;
    form.elements.date.value = iso;
    render();
    if (scroll) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    show(form.elements.kind.value, form.elements.date.value, true);
  });

  out.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.move !== undefined) {
      const m = Number(btn.dataset.move);
      shown = m === 0 ? Math.round((todayUtc() - lmp) / DAY) + 1 : shown + m;
      render();
    } else if (btn.hasAttribute('data-cal-copy')) {
      const url = location.href;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
        .then(() => (btn.textContent = '✅ Link copied'))
        .catch(() => prompt('Copy this link:', url));
    } else if (btn.hasAttribute('data-cal-forget')) {
      store.set(null);
      history.replaceState(null, '', location.pathname);
      out.hidden = true;
      out.innerHTML = '';
      form.reset();
    }
  });

  // A link like /calendar/#edd=2027-05-10 or #lmp=2026-08-03, else the date saved on this device.
  const m = /^#(lmp|edd)=(\d{4}-\d{2}-\d{2})$/.exec(location.hash);
  const saved = store.get();
  if (m) show(m[1], m[2], false);
  else if (saved && saved.iso) show(saved.kind === 'edd' ? 'edd' : 'lmp', saved.iso, false);
})();
