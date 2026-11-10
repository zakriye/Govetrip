'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const languages = ['en', 'fi', 'sv', 'no', 'da', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'zh', 'ru'];
const source = fs.readFileSync(path.join(root, 'account.js'), 'utf8');
const instrumented = source.replace('  var lang = ', '  globalThis.testDictionaries = T;\n  var lang = ');
assert.notEqual(instrumented, source);
const context = { document: { documentElement: { lang: 'en' }, readyState: 'loading', addEventListener() {} }, window: {} };
vm.runInNewContext(instrumented, context);

const dictionaries = context.testDictionaries;
const keys = Object.keys(dictionaries.en);
for (const language of languages) {
  const dictionary = dictionaries[language];
  assert.ok(dictionary, language + ' dictionary');
  for (const key of keys) {
    assert.equal(typeof dictionary[key], 'string', language + ': ' + key);
    assert.ok(dictionary[key].trim(), language + ': ' + key);
  }
  assert.match(dictionary.terms, /href="terms\.html"/);
  assert.match(dictionary.terms, /href="privacy\.html"/);
  if (language === 'en') continue;
  const json = JSON.parse(fs.readFileSync(path.join(root, 'i18n', language + '.json'), 'utf8'));
  const title = json['My account | GoVeTrip'];
  const description = json['Your GoVeTrip account: wishlist, recent searches and settings.'];
  assert.ok(title && description, language + ' metadata');
  assert.doesNotMatch(title + description, /[?\uFFFD]/, language + ' corrupted metadata');
  const page = fs.readFileSync(path.join(root, language, 'account.html'), 'utf8');
  assert.ok(page.includes('<html lang="' + language + '" data-localized>'), language + ' page language');
  assert.ok(page.includes('href="contact.html"'), language + ' contact link');
  assert.ok(!page.includes('<title>My account | GoVeTrip</title>'), language + ' title');
  assert.ok(!page.includes('content="Your GoVeTrip account: wishlist, recent searches and settings."'), language + ' description');
  assert.ok(page.includes('<title>' + title + '</title>'), language + ' generated title');
  assert.ok(page.includes('content="' + description + '"'), language + ' generated description');
}
console.log('Account dictionaries and localized pages: ' + languages.length + ' languages passed.');
