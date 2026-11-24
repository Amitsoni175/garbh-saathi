// Small, dependency-free interactivity for the Wombtales website pages.
(() => {
  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {
        /* private mode: fine */
      }
    },
  };

  // English / हिंदी switch, remembered for next time.
  const body = document.body;
  const buttons = document.querySelectorAll('[data-set-lang]');
  function setLang(lang) {
    body.classList.toggle('show-hi', lang === 'hi');
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
  }
  if (buttons.length) {
    setLang(store.get('wt-lang') === 'hi' ? 'hi' : 'en');
    buttons.forEach((b) =>
      b.addEventListener('click', () => {
        setLang(b.dataset.setLang);
        store.set('wt-lang', b.dataset.setLang);
      }),
    );
  }

  // Search on list pages.
  const filter = document.querySelector('[data-filter]');
  const list = document.querySelector('[data-filter-list]');
  const empty = document.querySelector('[data-empty]');
  if (filter && list) {
    filter.addEventListener('input', () => {
      const q = filter.value.trim().toLowerCase();
      let shown = 0;
      list.querySelectorAll('[data-search]').forEach((el) => {
        const ok = !q || el.dataset.search.includes(q);
        el.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  // Reading progress bar.
  const bar = document.querySelector('.progress span');
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? Math.min(100, (scrollY / max) * 100) : 0}%`;
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  // Share buttons.
  const share = document.querySelector('[data-share-title]');
  if (share) {
    const title = share.dataset.shareTitle;
    const url = location.href.split('#')[0];
    const wa = share.querySelector('[data-whatsapp]');
    if (wa) wa.href = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
    const native = share.querySelector('[data-share]');
    if (native) {
      if (!navigator.share) native.hidden = true;
      native.addEventListener('click', () => navigator.share({ title, url }).catch(() => {}));
    }
    const copy = share.querySelector('[data-copy]');
    copy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        copy.textContent = '✓ Copied';
        setTimeout(() => (copy.textContent = '🔗 Copy link'), 2000);
      } catch {
        prompt('Copy this link:', url);
      }
    });
  }

  // Friendly local date.
  document.querySelectorAll('[data-local-date]').forEach((t) => {
    const d = new Date(t.getAttribute('datetime'));
    if (!isNaN(d))
      t.textContent = d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      });
  });

  // Cards float in as you scroll.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll('.card').forEach((c) => {
      c.classList.add('reveal');
      io.observe(c);
    });
  }
})();
