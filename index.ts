import puppeteer from "puppeteer";
import { customAlphabet } from "nanoid";
import * as faker from "faker";
// @ts-ignore
import fakeCC from "fake_credit_card";

const getClickId = customAlphabet("abcdeefghijklmnopqrstuvwxyz123456789", 32);
const getPubId = customAlphabet("123456789", 2);

function pad(d: number) {
  return d < 10 ? "0" + d.toString() : d.toString();
}

const run = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    `https://luckyadwinner.com/english/?clickid=${getClickId()}&pubid=${getPubId()}&subpub=&extra=`
  );

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  await page.focus('[placeholder="First name"]');
  await page.keyboard.type(firstName);

  await page.focus('[placeholder="Last name"]');
  await page.keyboard.type(lastName);

  await page.focus('[placeholder="Street address"]');
  await page.keyboard.type(faker.address.streetAddress());

  await page.focus('[placeholder="Zip/postal code"]');
  await page.keyboard.type(faker.address.zipCode());

  await page.focus('[placeholder="Email address"]');
  await page.keyboard.type(faker.internet.email());

  await page.focus('[placeholder="Phone"]');
  await page.keyboard.type(faker.phone.phoneNumber());

  await page.focus('[placeholder="Password"]');
  await page.keyboard.type(faker.internet.password());

  await page.click("#submit");

  // Page 2
  await page.waitForSelector("#frmCCNum");

  const creditCard = fakeCC.flag(fakeCC.flags.VISA).withCvv[0];

  await page.focus("#frmCCNum");
  await page.keyboard.type(creditCard.number);

  await page.focus("#frmNameCC");
  await page.keyboard.type(`${firstName} ${lastName}`);

  await page.focus("#frmCCCVC");
  await page.keyboard.type(String(creditCard.cvv));

  const expiryMonth = pad(
    parseInt(creditCard.expiration.split("/")[0], 10)
  ).toString();

  const expiryYear = creditCard.expiration.split("/")[1];

  await page.select("#frmCCExp", expiryMonth);

  await page.select("#year", expiryYear);

  await page.click("#tnc");

  await page.click('[type="submit"]');

  await page.waitForTimeout(5000);

  await browser.close();
};

for (let i = 0; i < 10; i++) {
  run();
}
