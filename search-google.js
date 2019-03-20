const puppeteer = require('puppeteer');

const KEYWORDS = 'Properties for sale in Marbella';
const DOMAIN = "https://www.luxuryestate.com";

function compare(dom) {
  let len = DOMAIN.length;
  dom = dom.substr(0,len);
  return DOMAIN === dom;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  const searchBox = await page.$("input[type=text]");
  await searchBox.type(KEYWORDS);
  await page.evaluate(()=>document.querySelector('input[type=submit]').click());

  const [response] = await Promise.all([
    page.waitForNavigation('networkidle2'),
    page.once('networkidle2', () => console.log('Busqueda Realizada')),
  ]);

  const a = await page.$$eval('a', e => e.map((a)=>a.href));
  let link = a.filter(compare);

  const [response2] = await Promise.all([
    page.waitForNavigation(),
    page.click('a[href="'+ link[0] +'"]'),
  ]);

  await page.screenshot({ path: 'cookies.png' });

  await browser.close();
})();
