import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { articles, sources } from '../content/badan-usaha.mjs';
import { escapeHtml, validateContent, focusHome, articlePath } from '../build-wawasan.mjs';

test('Koleksi lengkap dan referensi rusak ditolak sebelum penerbitan', () => {
  assert.equal(validateContent().artikel, 20);
  assert.throws(() => validateContent(articles.slice(1)), /20/);
  const duplicate = structuredClone(articles);
  duplicate[1].slug = duplicate[0].slug;
  assert.throws(() => validateContent(duplicate), /unik/);
  const badSource = structuredClone(articles);
  badSource[0].sections[0].refs.push('sumber-tidak-ada');
  assert.throws(() => validateContent(badSource), /sumber tidak dikenal/);
  const badLink = structuredClone(articles);
  badLink[0].related[0] = 'halaman-tidak-ada';
  assert.throws(() => validateContent(badLink), /terkait tidak valid/);
});

test('Teks editorial diperlakukan sebagai teks, bukan markup', () => {
  assert.equal(escapeHtml('<script>"x" & \'y\'</script>'), '&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;');
});

test('Build ulang tidak menggandakan bagian beranda', async () => {
  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal(focusHome(focusHome(home)), focusHome(home));
  assert.equal([...focusHome(home).matchAll(/id="wawasan"/g)].length, 1);
});

test('Seluruh artikel terbit utuh, tersambung dari koleksi dan sitemap', async () => {
  const collection = await readFile(new URL('../wawasan/index.html', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 25);
  for (const a of articles) {
    const path = articlePath(a.slug);
    assert.ok(collection.includes(`href="${path}"`), a.slug);
    assert.ok(sitemap.includes(`${path}</loc>`), a.slug);
    const html = await readFile(new URL(`..${path}index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes(escapeHtml(a.scenario)), a.slug);
    for (const section of a.sections) {
      for (const paragraph of section.paragraphs) assert.ok(html.includes(escapeHtml(paragraph)), a.slug);
      for (const ref of section.refs) assert.ok(html.includes(sources[ref].url), a.slug);
    }
    for (const item of a.checklist) assert.ok(html.includes(escapeHtml(item)), a.slug);
    for (const repoPath of a.repo) assert.ok(!html.includes(repoPath), 'Path internal tidak dipublikasikan');
    assert.ok(html.includes('Bukan cerita klien tertentu.'), a.slug);
    assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
  }
});
