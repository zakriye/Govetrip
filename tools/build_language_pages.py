"""Builds per-language copies of the site pages: /<lang>/<page>.html.

Static text is translated at build time from i18n/<lang>.json, so every language page is
delivered fully translated (no client-side flash) and can be indexed with hreflang.
Run after editing a root page:  python tools/build_language_pages.py
To rebuild one page only:  python tools/build_language_pages.py --page account.html
"""
import argparse
import glob
import html
import json
import os
import re
from datetime import date

SITE = 'https://www.govetrip.com'
LANGS = ['fi', 'sv', 'no', 'da', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'zh', 'ru']
LOCALES = {'en': 'en_US', 'fi': 'fi_FI', 'sv': 'sv_SE', 'no': 'nb_NO', 'da': 'da_DK', 'de': 'de_DE', 'fr': 'fr_FR',
           'es': 'es_ES', 'it': 'it_IT', 'nl': 'nl_NL', 'pl': 'pl_PL', 'pt': 'pt_PT', 'zh': 'zh_CN', 'ru': 'ru_RU'}
SKIP = {'govetrip.html'}
FROM_PRICE = {'fi': 'Alkaen', 'sv': 'Från', 'no': 'Fra', 'da': 'Fra', 'de': 'Ab', 'fr': 'À partir de', 'es': 'Desde', 'it': 'Da', 'nl': 'Vanaf', 'pl': 'Od', 'pt': 'A partir de'}
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = date.today().isoformat()

REDIRECT = ("<script>try{"
            "if(!document.documentElement.hasAttribute('data-localized')&&!/bot|crawler|spider|slurp|bingpreview/i.test(navigator.userAgent)){"
            "var l=localStorage.getItem('govetrip.language');"
            "if(!l){var supported=/^(en|" + '|'.join(LANGS) + ")$/;"
            "l=(navigator.languages||[navigator.language]).map(function(x){return (x||'').toLowerCase().split('-')[0]})"
            ".find(function(x){return supported.test(x)})||'en'}"
            "if(/^(" + '|'.join(LANGS) + ")$/.test(l))"
            "location.replace('/'+l+'/'+(location.pathname.split('/').pop()||'index.html')+location.search+location.hash)}}catch(e){}</script>")


def norm(text):
    return re.sub(r'\s+', ' ', text).strip()


def load(lang):
    with open(os.path.join(ROOT, 'i18n', lang + '.json'), encoding='utf-8') as fh:
        return {norm(k): v for k, v in json.load(fh).items() if v}


TOKEN = re.compile(r'(<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->|<[^>]+>)', re.S | re.I)
ATTR = re.compile(r'''(\s)([a-zA-Z:-]+)=(")(.*?)"''', re.S)
TRANSLATABLE = {'placeholder', 'title', 'aria-label', 'alt'}
URL_ATTR = {'href', 'src', 'poster', 'data-src'}


def fix_url(value):
    if re.match(r'^(https?:|//|#|mailto:|tel:|/|data:|javascript:)', value) or not value:
        return value
    path = re.split(r'[?#]', value)[0]
    if path.endswith('.html') and '/' not in path:
        return value
    return '/' + value


def translate_tag(tag, dictionary, stats):
    is_meta = tag[:5].lower() == '<meta'

    def repl(match):
        space, name, quote, value = match.groups()
        lname = name.lower()
        if lname in URL_ATTR:
            return f'{space}{name}={quote}{fix_url(value)}"'
        if lname in TRANSLATABLE or (is_meta and lname == 'content'):
            key = norm(html.unescape(value))
            if key in dictionary:
                stats['hit'] += 1
                return f'{space}{name}={quote}{html.escape(dictionary[key], quote=True)}"'
            if key and re.search(r'[A-Za-z]{3}', key):
                stats['miss'].add(key)
        return match.group(0)

    return ATTR.sub(repl, tag)


def translate_html(source, dictionary, stats):
    out = []
    in_title = False
    for part in TOKEN.split(source):
        if not part:
            continue
        if part.startswith('<!--') or part[:7].lower() == '<script' or part[:6].lower() == '<style':
            out.append(fix_script_tag(part))
        elif part.startswith('<'):
            out.append(translate_tag(part, dictionary, stats))
        else:
            key = norm(html.unescape(part))
            if key in dictionary:
                stats['hit'] += 1
                lead = re.match(r'\s*', part).group(0)
                trail = re.search(r'\s*$', part).group(0)
                out.append(lead + html.escape(dictionary[key], quote=False) + trail)
            else:
                if key and re.search(r'[A-Za-z]{4}', key) and not key.startswith(('{', '"')):
                    stats['miss'].add(key)
                out.append(part)
    return ''.join(out)


def fix_script_tag(part):
    if part.lower().startswith('<script'):
        return re.sub(r'(<script\b[^>]*?\bsrc=")([^"]+)(")', lambda m: m.group(1) + fix_url(m.group(2)) + m.group(3), part, count=1, flags=re.I)
    return part


def page_url(lang, page):
    prefix = '' if lang == 'en' else '/' + lang
    if page == 'index.html':
        return SITE + (prefix + '/' if prefix else '/')
    return SITE + prefix + '/' + page


def hreflang_block(page):
    lines = ['<!-- hreflang -->']
    for lang in ['en'] + LANGS:
        lines.append('<link rel="alternate" hreflang="%s" href="%s" />' % ('nb' if lang == 'no' else lang, page_url(lang, page)))
    lines.append('<link rel="alternate" hreflang="x-default" href="%s" />' % page_url('en', page))
    lines.append('<!-- /hreflang -->')
    return '\n    '.join(lines)


STRIP = re.compile(r'\s*<!-- hreflang -->.*?<!-- /hreflang -->', re.S)
STRIP_REDIRECT = re.compile(r'\s*<!-- lang-redirect -->.*?<!-- /lang-redirect -->', re.S)


def clean_source(source):
    return STRIP_REDIRECT.sub('', STRIP.sub('', source))


def update_root(path, page, source):
    source = clean_source(source)
    block = '\n    ' + hreflang_block(page) + '\n    <!-- lang-redirect -->' + REDIRECT + '<!-- /lang-redirect -->'
    new = source.replace('</head>', block.rstrip('\n') + '\n  </head>', 1)
    with open(path, 'w', encoding='utf-8', newline='') as fh:
        fh.write(new)


def build(only_page=None):
    dictionaries = {lang: load(lang) for lang in LANGS}
    pages = sorted(os.path.basename(p) for p in glob.glob(os.path.join(ROOT, '*.html')))
    pages = [p for p in pages if p not in SKIP]
    if only_page:
        if only_page not in pages:
            raise ValueError('Unknown root page: ' + only_page)
        pages = [only_page]
    report = {}
    sitemap_rows = []
    for page in pages:
        path = os.path.join(ROOT, page)
        with open(path, encoding='utf-8') as fh:
            source = clean_source(fh.read())
        indexable = 'noindex' not in source
        if indexable and not only_page:
            update_root(path, page, source)
        for lang in LANGS:
            stats = {'hit': 0, 'miss': set()}
            body = translate_html(source, dictionaries[lang], stats)
            body = re.sub(r'<html lang="[^"]*"', '<html lang="%s" data-localized' % lang, body, count=1)
            url = page_url(lang, page)
            body = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), body, count=1)
            body = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), body, count=1)
            extra = '\n    <meta property="og:locale" content="%s" />' % LOCALES[lang]
            if indexable:
                extra += '\n    ' + hreflang_block(page)
            body = body.replace('</head>', extra + '\n  </head>', 1)
            body = re.sub(r'(?m)^[ \t]+$', '', body)
            directory = os.path.join(ROOT, lang)
            os.makedirs(directory, exist_ok=True)
            with open(os.path.join(directory, page), 'w', encoding='utf-8', newline='') as fh:
                fh.write(body)
            report[(lang, page)] = stats
        if indexable:
            links = ''.join('<xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % ('nb' if l == 'no' else l, page_url(l, page)) for l in ['en'] + LANGS)
            links += '<xhtml:link rel="alternate" hreflang="x-default" href="%s"/>' % page_url('en', page)
            for lang in LANGS:
                sitemap_rows.append('  <url><loc>%s</loc>%s<lastmod>%s</lastmod></url>' % (page_url(lang, page), links, TODAY))
    if only_page:
        print('pages:', len(pages), 'languages:', len(LANGS))
        return
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
           'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + '\n'.join(sitemap_rows) + '\n</urlset>\n')
    with open(os.path.join(ROOT, 'sitemap-languages.xml'), 'w', encoding='utf-8', newline='') as fh:
        fh.write(xml)
    print('pages:', len(pages), 'languages:', len(LANGS))
    for lang in LANGS:
        hits = sum(report[(lang, p)]['hit'] for p in pages)
        miss = set().union(*[report[(lang, p)]['miss'] for p in pages])
        print(lang, 'translated', hits, 'untranslated distinct strings', len(miss))
    sample = set().union(*[report[('de', p)]['miss'] for p in pages])
    with open(os.path.join(ROOT, 'i18n', '_untranslated_de.txt'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(sorted(sample)))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--page', help='Build only this root HTML page, without updating root pages or sitemaps')
    build(parser.parse_args().page)
