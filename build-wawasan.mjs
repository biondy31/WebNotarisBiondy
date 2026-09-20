import { mkdir, writeFile } from 'node:fs/promises';
import { articles, sources } from './content/badan-usaha.mjs';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const e = escapeHtml;
const groups = ['Memulai usaha', 'Mengembangkan usaha', 'Menata keputusan', 'Menjaga kesinambungan'];
export const articlePath = slug => `/wawasan/${slug}/`;
export const wordCount = a => [a.scenario, ...a.sections.flatMap(s => s.paragraphs), ...a.checklist, a.takeaway].join(' ').split(/\s+/).length;

/** Memeriksa kontrak konten sebelum penulisan halaman; kegagalan tidak menghasilkan artikel parsial. */
export function validateContent(items = articles, references = sources) {
  if (items.length !== 20) throw new Error('Koleksi harus berisi tepat 20 artikel.');
  const slugs = new Set(items.map(a => a.slug));
  if (slugs.size !== items.length) throw new Error('Slug artikel harus unik.');
  for (const a of items) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)) throw new Error('Slug tidak aman.');
    if (!a.title || !a.intro || !a.scenario || !a.takeaway || !groups.includes(a.group)) throw new Error(`${a.slug}: identitas artikel belum lengkap.`);
    if (a.sections.length < 3 || a.checklist.length < 3 || wordCount(a) < 280) throw new Error(`${a.slug}: pembahasan belum lengkap.`);
    if (!a.sections.some(s => s.refs.length)) throw new Error(`${a.slug}: sumber hukum belum tersedia.`);
    for (const section of a.sections) for (const key of section.refs) {
      if (!references[key] || !references[key].url.startsWith('https://')) throw new Error(`${a.slug}: sumber tidak dikenal ${key}.`);
    }
    if (a.related.length < 2 || a.related.some(slug => !slugs.has(slug) || slug === a.slug)) throw new Error(`${a.slug}: artikel terkait tidak valid.`);
    if (!a.repo?.length) throw new Error(`${a.slug}: asal topik repo belum dicatat.`);
  }
  return { artikel: items.length, kata: items.reduce((n, a) => n + wordCount(a), 0) };
}

const card = (a, number) => `<a class="knowledge-card" href="${articlePath(a.slug)}"><div class="knowledge-card-top"><span>${e(a.type)}</span><span>${String(number).padStart(2, '0')}</span></div><h3>${e(a.title)}</h3><p>${e(a.intro)}</p><span class="knowledge-card-bottom">Baca kasus & pembahasan <span aria-hidden="true">↗</span></span></a>`;

/** Penyesuaian beranda yang dapat dijalankan ulang tanpa menggandakan bagian. */
export function focusHome(home) {
  home = home.replace('<title>Biondy Utama, S.H., M.Kn. — Notaris & PPAT Kota Cimahi</title>', '<title>Notaris Biondy Utama, Cimahi — Pendirian & Perubahan PT, CV</title>');
  home = home.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Kantor Notaris Biondy Utama, Cimahi. Pembahasan pendirian, perubahan, saham, dan kesinambungan PT/CV. Baca 20 artikel kasus badan usaha.">');
  home = home.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Memahami keputusan di balik pendirian dan perubahan PT/CV. Kenali kantor dan baca 20 artikel kasus badan usaha.">');
  home = home.replace('<link rel="stylesheet" href="/assets/scrolly.css">', '<link rel="stylesheet" href="/assets/scrolly.css">');
  if (!home.includes('href="/assets/wawasan.css"')) home = home.replace('</head>', '<link rel="stylesheet" href="/assets/wawasan.css">\n</head>');
  home = home.replaceAll('<a href="#panduan">Panduan</a>', '<a href="/wawasan/">Wawasan PT & CV</a>');
  home = home.replace('PRIBADI / KELUARGA / USAHA', 'PENDIRIAN / PERUBAHAN / KESINAMBUNGAN');
  home = home.replace('<span>Langkah besar.</span><em>Dasar yang jelas.</em>', '<span>Usaha bertumbuh.</span><em>Dasarnya terjaga.</em>');
  home = home.replace('Setiap rencana memiliki ceritanya.<br>Mari pahami dasar dan dokumennya.', 'Dari rencana pendirian hingga perubahan kepemilikan.<br>Mari pahami keputusan dan dokumen badan usaha Anda.');
  home = home.replace('Memulai usaha. Membeli properti. Menyiapkan kesepakatan.<br>Prosesnya dimulai dengan memahami kebutuhan Anda.', 'Ada usaha yang baru dimulai. Ada mitra yang berganti.<br>Setiap perubahan perlu dipahami sebelum dituangkan dalam akta.');
  home = home.replace(/<section id="profil"[\s\S]*?<\/section>/, `<section id="profil" class="section"><div class="container profile-grid"><div><p class="eyebrow">KANTOR NOTARIS BIONDY UTAMA</p><h2>Memahami usaha.<br>Menata langkahnya.</h2></div><div><p class="large-copy">Pendirian, perubahan, dan kesinambungan PT serta CV menjadi fokus pembahasan kami.</p><p>Di Kantor Notaris & PPAT Biondy Utama, S.H., M.Kn., Kota Cimahi, pembahasan dimulai dari rencana usaha dan hubungan para pihak. Modal, kepemilikan, kewenangan pengurus, serta riwayat dokumen dibaca bersama agar keputusan yang akan dituangkan dalam akta memiliki dasar yang jelas.</p><p>Catatan badan usaha di website ini membantu Anda mengenali pertanyaan yang perlu dibahas, bahkan ketika belum mengetahui nama akta yang dibutuhkan.</p><a class="text-link" href="/wawasan/">Baca wawasan PT & CV <span aria-hidden="true">↗</span></a></div></div></section>`);
  const chapters = [
    { no: '01', tag: 'MEMULAI USAHA', title: 'Awal yang<br><em>dipahami.</em>', h3: 'Pendirian PT & CV', text: 'Bentuk usaha, peran pendiri, modal, dan pembagian kepemilikan. Mulai dari bagaimana Anda ingin bekerja bersama.', link: 'memilih-pt-atau-cv', label: 'PT atau CV: mulai dari mana?', visual: 'PT<br><em>& CV.</em>', small: 'PERAN / MODAL / KEPEMILIKAN' },
    { no: '02', tag: 'MENGEMBANGKAN USAHA', title: 'Bertumbuh dengan<br><em>kesepakatan.</em>', h3: 'Investor, saham & perubahan usaha', text: 'Ketika investor masuk atau kegiatan bertambah, lihat kembali komposisi saham, pengendalian, dan ruang lingkup dokumennya.', link: 'investor-baru-dilusi-saham', label: 'Memahami masuknya investor', visual: 'Modal.<br><em>Arah.</em>', small: 'INVESTOR / SAHAM / PERUBAHAN' },
    { no: '03', tag: 'MENJAGA KESINAMBUNGAN', title: 'Keputusan hari ini.<br><em>Langkah berikutnya.</em>', h3: 'Pengurus, keputusan & kelanjutan usaha', text: 'Pergantian pengurus, keputusan pemilik, waris, hingga penggabungan dan pembubaran. Setiap tahap memiliki pertanyaan yang berbeda.', link: 'rups-dan-keputusan-sirkuler', label: 'RUPS atau keputusan sirkuler?', visual: 'Kini.<br><em>Nanti.</em>', small: 'KEPUTUSAN / KESINAMBUNGAN' }
  ];
  const panels = chapters.map((c, i) => `<article class="story-panel" data-chapter="${i}"><div class="story-copy"><p class="eyebrow">${c.no} / ${c.tag}</p><h2>${c.title}</h2><h3>${c.h3}</h3><p>${c.text}</p><a class="text-link" href="${articlePath(c.link)}">${c.label} ↗</a></div><div class="chapter-type" aria-hidden="true"><span>BADAN USAHA</span><strong>${c.visual}</strong><small>${c.small}</small></div></article>`).join('');
  home = home.replace(/<section id="layanan"[\s\S]*?<\/section>/, `<section id="layanan" class="story-sequence" aria-label="Tiga tahap badan usaha"><div class="story-stage" data-step="0"><div class="container story-shell"><div class="story-top"><span>DI SETIAP TAHAP USAHA</span><span class="story-counter" aria-hidden="true">01 / 03</span></div><div class="story-panels">${panels}</div><nav class="chapter-nav" aria-label="Pilih bab badan usaha">${['Memulai', 'Bertumbuh', 'Berlanjut'].map((v, i) => `<button data-go-chapter="${i}" aria-label="Bab ${i + 1}: ${v}"><span>0${i + 1}</span> ${v}</button>`).join('')}<span class="chapter-hint">LANJUTKAN GULIRAN ↓</span></nav></div></div></section>`);
  const picks = ['memilih-pt-atau-cv', 'rups-dan-keputusan-sirkuler', 'sekutu-cv-masuk-keluar'].map(slug => articles.find(a => a.slug === slug));
  const feature = `<section id="wawasan" class="section knowledge-feature"><div class="container"><div class="section-heading"><div><p class="eyebrow">20 CATATAN BADAN USAHA</p><h2>Ada kasus.<br>Ada yang bisa dipelajari.</h2></div><p>Mulai dari pertanyaan yang dekat dengan keadaan Anda. Setiap kasus bersifat ilustratif, dengan pembahasan dan rujukan resmi.</p></div><div class="knowledge-grid">${picks.map((a, i) => card(a, i + 1)).join('')}</div><a class="button primary knowledge-all" href="/wawasan/">Jelajahi seluruh 20 artikel <span aria-hidden="true">↗</span></a></div></section>`;
  home = home.replace(/<section id="wawasan"[\s\S]*?<\/section>\s*/, '');
  home = home.replace('<section id="panduan"', feature + '\n<section id="panduan"');
  home = home.replace('Catatan praktis untuk menyiapkan percakapan dengan Notaris atau PPAT.', 'Bahan persiapan kunjungan dan informasi layanan Notaris/PPAT lainnya.');
  return home;
}

export async function buildWawasan(home, origin) {
  const report = validateContent();
  const header = home.match(/<div class="topline">[\s\S]*?<\/header>/)[0].replaceAll('href="#', 'href="/#');
  const footer = home.match(/<footer[\s\S]*?<\/footer>/)[0].replaceAll('href="#', 'href="/#');
  const icon = home.match(/<link rel="icon"[^>]+>/)[0];
  const shell = (path, title, intro, schema, body) => `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)} | Notaris Biondy Utama, Cimahi</title><meta name="description" content="${e(intro)}"><meta name="theme-color" content="#143d32"><link rel="canonical" href="${origin + path}"><meta property="og:type" content="${path === '/wawasan/' ? 'website' : 'article'}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(intro)}"><meta property="og:url" content="${origin + path}"><meta property="og:locale" content="id_ID">${icon}<link rel="stylesheet" href="/assets/style.css"><link rel="stylesheet" href="/assets/wawasan.css"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script></head><body class="knowledge-page"><a class="skip" href="#utama">Lewati ke isi utama</a>${header}<main id="utama">${body}</main>${footer}<script src="/assets/app.js" defer></script></body></html>`;
  const crumbs = `<nav class="breadcrumbs" aria-label="Jejak navigasi"><a href="/">Beranda</a><span>/</span><a href="/wawasan/">Wawasan PT & CV</a></nav>`;
  const collection = `<section class="knowledge-hero"><div class="container">${crumbs}<p class="eyebrow">CATATAN BADAN USAHA · ${articles.length} ARTIKEL</p><h1>Usaha punya cerita.<br><em>Keputusan punya dasar.</em></h1><p>Dari memilih PT atau CV hingga menata perubahan kepemilikan. Temukan sudut pandang yang membantu Anda membawa pertanyaan yang tepat.</p><nav class="topic-nav" aria-label="Tahap badan usaha">${groups.map((g, i) => `<a href="#tahap-${i}">${e(g)} <span>0${i + 1}</span></a>`).join('')}</nav></div></section><div class="container knowledge-library">${groups.map((g, i) => `<section id="tahap-${i}" class="knowledge-group"><div class="knowledge-group-title"><span>0${i + 1}</span><h2>${g}</h2><p>${articles.filter(a => a.group === g).length} artikel</p></div><div class="knowledge-grid">${articles.filter(a => a.group === g).map(a => card(a, articles.indexOf(a) + 1)).join('')}</div></section>`).join('')}<p class="knowledge-disclaimer">Kasus dalam kumpulan ini adalah ilustrasi, bukan cerita klien atau penilaian atas perkara tertentu. Pembahasan berfokus pada PT tertutup dan CV; keadaan khusus dapat memerlukan ketentuan tambahan.</p></div>`;
  await mkdir('./wawasan', { recursive: true });
  await writeFile('./wawasan/index.html', shell('/wawasan/', '20 Artikel PT & CV: Kasus dan Keputusan Badan Usaha', 'Kasus PT dan CV tentang pendirian, saham, investor, pengurus, RUPS, waris, KBLI, serta kelanjutan usaha.', { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Wawasan PT & CV', url: origin + '/wawasan/', mainEntity: { '@type': 'ItemList', numberOfItems: articles.length, itemListElement: articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: origin + articlePath(a.slug) })) } }, collection));
  for (const a of articles) {
    const refs = [...new Set(a.sections.flatMap(s => s.refs))];
    const path = articlePath(a.slug);
    const toc = a.sections.map((s, i) => `<a href="#bahasan-${i}">${e(s.heading)}</a>`).join('');
    const content = a.sections.map((s, i) => `<section id="bahasan-${i}"><h2>${e(s.heading)}</h2>${s.paragraphs.map(p => `<p>${e(p)}</p>`).join('')}${s.refs.length ? `<p class="inline-citations">Rujukan: ${s.refs.map(k => `<a href="#sumber-${k}" aria-label="Rujukan ${e(sources[k].title)}">[${refs.indexOf(k) + 1}]</a>`).join(' ')}</p>` : ''}</section>`).join('');
    const body = `<section class="article-banner"><div class="container">${crumbs}<p class="eyebrow">${e(a.type)} · ${e(a.group)}</p><h1>${e(a.title)}</h1><p>${e(a.intro)}</p><div class="article-meta"><span>${Math.ceil(wordCount(a) / 180)} menit baca</span><span>20 September 2026</span><span>Wawasan badan usaha</span></div></div></section><div class="container article-layout"><article class="article-body"><div class="case-opening"><p class="eyebrow">KASUS ILUSTRATIF</p><p>${e(a.scenario)}</p><small>Bukan cerita klien tertentu.</small></div><details class="mobile-toc"><summary>Dalam artikel ini</summary>${toc}<a href="#bahan">Bahan pembahasan</a></details>${content}<section id="bahan" class="article-checklist"><h2>Bahan untuk pembahasan</h2><ul>${a.checklist.map(p => `<li>${e(p)}</li>`).join('')}</ul><p>${e(a.takeaway)}</p></section><p class="article-note">Informasi umum untuk PT tertutup dan/atau CV sesuai topik. Penilaian perlu disesuaikan dengan dokumen, keadaan para pihak, dan aturan yang berlaku. Kasus dan angka adalah ilustrasi.</p><div class="source-links"><h2>Rujukan resmi</h2><p>Rujukan diperiksa pada 20 September 2026. Ketentuan dapat berubah.</p><ol>${refs.map(k => `<li id="sumber-${k}"><a href="${e(sources[k].url)}" target="_blank" rel="noopener noreferrer">${e(sources[k].title)} ↗</a></li>`).join('')}</ol></div><section class="article-conversation"><p class="eyebrow">BIONDY UTAMA · NOTARIS DI CIMAHI</p><h2>Mulai dari keadaan usaha Anda.</h2><p>Jika ingin membahas dokumen badan usaha, catatan dan pertanyaan di atas dapat menjadi bahan pertemuan dengan kantor.</p><a class="text-link" href="/#kontak">Lokasi & kontak kantor ↗</a></section></article><aside class="article-aside contents-aside"><p class="eyebrow">DALAM ARTIKEL INI</p><nav aria-label="Daftar isi artikel">${toc}<a href="#bahan">Bahan pembahasan</a></nav><a class="back-library" href="/wawasan/">← Seluruh 20 artikel</a></aside></div><section class="related-reading"><div class="container"><p class="eyebrow">LANJUTKAN MEMBACA</p><h2>Keputusan yang saling berkaitan.</h2><div class="knowledge-grid">${a.related.map(slug => articles.find(v => v.slug === slug)).map(v => card(v, articles.indexOf(v) + 1)).join('')}</div></div></section>`;
    const schema = { '@context': 'https://schema.org', '@graph': [{ '@type': 'Article', headline: a.title, description: a.intro, datePublished: '2026-09-20', dateModified: '2026-09-20', inLanguage: 'id-ID', mainEntityOfPage: origin + path, publisher: { '@type': 'Organization', name: 'Kantor Notaris & PPAT Biondy Utama' }, citation: refs.map(k => sources[k].url) }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Beranda', item: origin + '/' }, { '@type': 'ListItem', position: 2, name: 'Wawasan PT & CV', item: origin + '/wawasan/' }, { '@type': 'ListItem', position: 3, name: a.title, item: origin + path }] }] };
    await mkdir('.' + path, { recursive: true });
    await writeFile('.' + path + 'index.html', shell(path, a.title, a.intro, schema, body));
  }
  console.log(JSON.stringify(report));
  return ['/wawasan/', ...articles.map(a => articlePath(a.slug))];
}
