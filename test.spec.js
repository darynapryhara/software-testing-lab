const { chromium } = require('playwright');
const assert = require('assert');

async function runTests() {
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

try {
console.log('Починаємо виконання автоматизованих тестів...');

// Перевірка 1: Відкриття сайту та перевірка заголовка (title)
await page.goto('https://the-internet.herokuapp.com/', { waitUntil: 'domcontentloaded' });
const title = await page.title();
console.log('Перевірка 1 — Заголовок сторінки:', title);
assert.strictEqual(title, 'The Internet', 'Заголовок сторінки не відповідає очікуваному');
console.log('✔ Перевірка 1 пройдена успішно.');

// Перевірка 2: Перевірка наявності заголовка h1 та посилання "Form Authentication"
const headingText = await page.locator('h1.heading').textContent();
console.log('Перевірка 2 — Головний заголовок (h1):', headingText);
assert.ok(
  headingText && headingText.includes('Welcome to the-internet'),
  'Відсутній очікуваний текст заголовка на головній сторінці'
);

const authLink = page.locator('a[href="/login"]');
const isLinkVisible = await authLink.isVisible();
assert.strictEqual(isLinkVisible, true, 'Посилання "Form Authentication" не відображається');
console.log('✔ Перевірка 2 пройдена успішно.');

// Перевірка 3: Натискання на посилання та перевірка переходу на сторінку входу
await authLink.click();
await page.waitForURL('**/login');
const currentUrl = page.url();
const loginHeading = await page.locator('h2').textContent();
console.log('Перевірка 3 — Поточний URL:', currentUrl, '| Заголовок форми:', loginHeading);
assert.ok(currentUrl.endsWith('/login'), 'Не відбувся перехід на сторінку /login');
assert.strictEqual(loginHeading.trim(), 'Login Page', 'Невірний заголовок сторінки входу');
console.log('✔ Перевірка 3 пройдена успішно.');

console.log('Усі 3 автоматизовані перевірки завершено успішно!');
} catch (error) {
console.error('❌ Під час виконання тесту виникла помилка:', error.message);
process.exitCode = 1;
} finally {
await browser.close();
}
}

runTests();
