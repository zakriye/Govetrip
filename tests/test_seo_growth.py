"""SEO guardrails. Run from repo root: python -m unittest discover tests"""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROUTES = list((ROOT / 'flights').glob('*-to-*.html'))
GEN_PAGES = ROUTES + list((ROOT / 'destinations').glob('*.html'))


def jsonld(text):
    return [json.loads(s) for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)]


class GeneratedPages(unittest.TestCase):
    def test_pages_exist(self):
        self.assertGreaterEqual(len(ROUTES), 300)

    def test_json_ld_valid_and_no_faqpage(self):
        for p in GEN_PAGES:
            for block in jsonld(p.read_text(encoding='utf-8')):
                self.assertNotEqual(block.get('@type'), 'FAQPage', p.name)

    def test_no_searchaction_anywhere(self):
        for p in ROOT.rglob('*.html'):
            if '.git' in p.parts:
                continue
            self.assertNotIn('SearchAction', p.read_text(encoding='utf-8', errors='replace'), str(p))

    def test_route_pages_disclose_no_fares_and_link_disclosure(self):
        for p in ROUTES:
            t = p.read_text(encoding='utf-8')
            self.assertIn('lists no fares or flight schedules', t, p.name)
            self.assertIn('/affiliate-disclosure.html', t, p.name)

    def test_route_pages_have_no_invented_prices(self):
        for p in ROUTES:
            body = re.sub(r'<[^>]+>', ' ', p.read_text(encoding='utf-8'))
            self.assertIsNone(re.search(r'[€$£]\s?\d|\d\s?(EUR|USD|€)\b|from \d+', body), p.name)

    def test_single_h1_and_canonical(self):
        for p in GEN_PAGES:
            t = p.read_text(encoding='utf-8')
            self.assertEqual(len(re.findall(r'<h1[\s>]', t)), 1, p.name)
            self.assertIn('rel="canonical"', t, p.name)


if __name__ == '__main__':
    unittest.main()
