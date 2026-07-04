/* Notaris Biondy Utama — interaksi ringan */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Contact form -> compose email (no server, no WhatsApp)
  var form = document.querySelector("#contact-form");
  if (form) {
    // e-mail dirakit dari bagian agar tidak mudah dipanen bot
    var user = "kantor";
    var domain = "notaris-biondy.co.id"; // GANTI dengan email resmi Anda
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = (form.nama.value || "").trim();
      var perihal = (form.perihal.value || "").trim();
      var pesan = (form.pesan.value || "").trim();
      var telp = (form.telepon.value || "").trim();

      var subject = "Konsultasi Notaris — " + (perihal || "Umum") + (nama ? " (" + nama + ")" : "");
      var bodyLines = [
        "Nama       : " + nama,
        "No. Telp   : " + telp,
        "Perihal    : " + perihal,
        "",
        "Pesan:",
        pesan,
        "",
        "— Dikirim melalui website profil Notaris & PPAT Biondy Utama, S.H., M.Kn."
      ];
      var href = "mailto:" + user + "@" + domain +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));
      window.location.href = href;

      var status = document.querySelector("#form-status");
      if (status) {
        status.hidden = false;
        status.textContent = "Aplikasi email Anda akan terbuka dengan pesan yang sudah tersusun. Silakan tekan Kirim di dalamnya.";
      }
    });
  }

  // Footer year
  var y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
