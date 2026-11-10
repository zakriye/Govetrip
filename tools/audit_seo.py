import re, sys, os, json, collections
from pathlib import Path
from urllib.parse import urlparse
root = Path(sys.argv[1])
BASE = 'https://www.govetrip.com'
pages = [p for p in root.rglob('*.html') if '.git' not in p.parts and 'node_modules' not in p.parts]
def url_of(p):
    r = p.relative_to(root).as_posix()
    if r == 'index.html': return BASE + '/'
    if r.endswith('/index.html'): return BASE + '/' + r[:-10]
    return BASE + '/' + r
info = {}
for p in pages:
    t = p.read_text(encoding='utf-8', errors='replace')
    g = lambda pat: (re.search(pat, t, re.S | re.I) or [None, None])[1]
    info[p] = dict(
        url=url_of(p), title=g(r'<title>(.*?)</title>'),
        desc=g(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']'),
        canon=g(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']'),
        robots=g(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'](.*?)["\']'),
        lang=g(r'<html[^>]+lang=["\'](.*?)["\']'),
        h1=len(re.findall(r'<h1[\s>]', t)),
        hreflang=re.findall(r'<link[^>]+hreflang=["\'](.*?)["\'][^>]+href=["\'](.*?)["\']', t),
        ld=re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S),
        words=len(re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)[\s\S]*?</\1>', '', t)).split()),
        text=t)
issues = collections.defaultdict(list)
for p, i in info.items():
    r = p.relative_to(root).as_posix()
    if not i['title']: issues['no_title'].append(r)
    if not i['desc']: issues['no_desc'].append(r)
    if not i['canon']: issues['no_canonical'].append(r)
    elif i['canon'] != i['url'] and 'noindex' not in (i['robots'] or ''): issues['canon_mismatch'].append((r, i['canon']))
    if i['h1'] != 1: issues['h1_count_%d' % i['h1']].append(r)
    if i['title'] and len(i['title']) > 65: issues['title_long'].append(r)
    if i['desc'] and len(i['desc']) > 165: issues['desc_long'].append(r)
    if i['desc'] and len(i['desc']) < 70: issues['desc_short'].append(r)
    if i['words'] < 150 and 'noindex' not in (i['robots'] or ''): issues['thin_<150w'].append((r, i['words']))
    for s in i['ld']:
        try:
            j = json.loads(s)
            if 'SearchAction' in s: issues['searchaction'].append(r)
        except Exception as e: issues['bad_jsonld'].append(r)
    # hreflang reciprocity
    for lang, href in i['hreflang']:
        q = href.replace(BASE, '')
        f = root / (q.strip('/') + '/index.html' if q.endswith('/') and q != '/' else ('index.html' if q == '/' else q.strip('/')))
        if not f.exists(): issues['hreflang_target_missing'].append((r, href)); continue
        back = [h for l, h in info[f]['hreflang']] if f in info else []
        if i['url'] not in back and href != i['url']: issues['hreflang_not_reciprocal'].append((r, href))
for k, k2 in (('title', 'dup_title'), ('desc', 'dup_desc')):
    c = collections.defaultdict(list)
    for p, i in info.items():
        if i[k] and 'noindex' not in (i['robots'] or ''): c[i[k]].append(p.relative_to(root).as_posix())
    for v, l in c.items():
        if len(l) > 1: issues[k2].append((v[:60], len(l), l[:4]))
# sitemap
sm = set()
for s in root.glob('sitemap-*.xml'):
    sm |= set(re.findall(r'<loc>(.*?)</loc>', s.read_text(encoding='utf-8')))
urls = {i['url']: p for p, i in info.items()}
for u in sm:
    if u not in urls: issues['sitemap_url_no_file'].append(u)
    elif 'noindex' in (info[urls[u]]['robots'] or ''): issues['sitemap_noindex'].append(u)
for u, p in urls.items():
    if u not in sm and 'noindex' not in (info[p]['robots'] or ''): issues['indexable_not_in_sitemap'].append(u)
# internal links
miss = set()
inbound = collections.Counter()
for p, i in info.items():
    for h in re.findall(r'(?:href|src)=["\']([^"\'#?]+)', i['text']):
        if re.match(r'^(https?:|mailto:|tel:|data:|javascript:|//)', h) and not h.startswith(BASE): continue
        h = h.replace(BASE, '')
        base = root if h.startswith('/') else p.parent
        t = (base / h.lstrip('/')).resolve() if h else None
        if t is None: continue
        if t.is_dir(): t = t / 'index.html'
        if not t.exists(): miss.add((p.relative_to(root).as_posix(), h))
        elif t.suffix == '.html': inbound[t] += 1
for m in sorted(miss)[:40]: issues['broken_link'].append(m)
issues['broken_link_total'] = [len(miss)]
for p, i in info.items():
    if p not in inbound and 'noindex' not in (i['robots'] or ''): issues['orphan_no_inbound'].append(p.relative_to(root).as_posix())
print('pages', len(pages), 'sitemap urls', len(sm))
for k, v in sorted(issues.items()):
    print(f'## {k}: {len(v)}')
    for x in v[:6]: print('   ', x)
