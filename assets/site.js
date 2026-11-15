(function () {
  "use strict";

  // ---- toast ----
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove("show"); }, 4000);
  }

  // ---- mobile menu ----
  var nav = document.querySelector("nav");
  var burger = nav && nav.querySelector("button");
  if (nav && burger) {
    var menu = document.createElement("div");
    menu.className = "mobile-menu";
    nav.querySelectorAll(".hidden.md\\:flex a").forEach(function (a) {
      menu.appendChild(a.cloneNode(true));
    });
    var cta = nav.querySelector("a.md\\:inline-flex");
    if (cta) {
      var c = cta.cloneNode(true);
      c.classList.remove("hidden", "md:inline-flex");
      c.style.cssText = "margin-top:.5rem;padding:.75rem 1rem;border-radius:.5rem;text-align:center;background:hsl(var(--primary));color:hsl(var(--primary-foreground))";
      menu.appendChild(c);
    }
    nav.parentNode.insertBefore(menu, nav.nextSibling);
    burger.addEventListener("click", function () { menu.classList.toggle("open"); });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") menu.classList.remove("open");
    });
  }

  // ---- application form (original site only showed a notification) ----
  document.querySelectorAll("form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      toast("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      f.reset();
    });
  });

  // ---- document viewer on the "works" page ----
  var buttons = Array.prototype.filter.call(document.querySelectorAll("main button"), function (b) {
    return /Смотреть/.test(b.textContent);
  });
  if (buttons.length) {
    var modal = document.createElement("div");
    modal.className = "doc-modal";
    modal.innerHTML =
      '<div class="box"><div class="bar"><strong class="t"></strong>' +
      '<span style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;justify-content:flex-end"><small style="opacity:.6">Не отображается?</small><a class="nt" target="_blank" rel="noopener">Открыть в новой вкладке</a><a class="dl" download>Скачать</a><button type="button" class="x">Закрыть ✕</button></span></div>' +
      '<iframe title="Документ"></iframe></div>';
    document.body.appendChild(modal);
    var frame = modal.querySelector("iframe");
    var close = function () { modal.classList.remove("open"); frame.removeAttribute("src"); };
    modal.querySelector(".x").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    buttons.forEach(function (b) {
      var card = b.closest("div.bg-card");
      var a = card && card.querySelector("a[download]");
      if (!a) return;
      var href = a.getAttribute("href");
      var title = card.querySelector("h3").textContent;
      b.addEventListener("click", function () {
        if (/\.pdf$/i.test(href)) {
          modal.querySelector(".t").textContent = title;
          modal.querySelector(".dl").setAttribute("href", href);
          modal.querySelector(".nt").setAttribute("href", href);
          frame.src = href;
          modal.classList.add("open");
        } else {
          // Word files cannot be shown by the browser itself — download instead
          a.click();
          toast("Файл Word скачивается — откройте его в Word");
        }
      });
    });
  }

  // downloads: make "download" links open from the local folder without new tab
  document.querySelectorAll('a[download][target="_blank"]').forEach(function (a) {
    a.removeAttribute("target");
  });
})();
