// @ts-check
const { test, expect } = require('@playwright/test');

test('Adding a product to the cart', async ({ page }) => {

  // User Data
  const productName = "ZARA COAT 3";
  const userName = "deflee@gmail.com";
  const password = "@Hello890";

  await page.goto("https://rahulshettyacademy.com/client");

  // Login Page
  await page.locator("#userEmail").fill(userName);
  await page.locator("#userPassword").fill(password);
  await page.locator("[name = 'login']").click();

  // dynamic wait
  await page.waitForLoadState('networkidle');
  await page.locator(".card-body b").first().waitFor()

  // Products Page
  // const titles = await page.locator(".card-body b").allTextContents();
  // console.log(titles)
  const products = await page.locator(".card-body")
  const count = await products.count()

  for(let i = 0; i < count; i++){
    if(await products.nth(i).locator('b').textContent() === productName){
      await products.nth(i).getByRole('button', {name: 'Add To Cart'}).click();
    }
  }

  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor();

  // Cart Page
  const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
  expect(bool).toBeTruthy(); // assertion

  await page.locator("text=Checkout").click(); //

  // Checkout Page
  // Auto suggestion dropdown
  await page.locator("[placeholder*='Country']").pressSequentially("ind");
  
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();

  const optionsCount = await dropdown.locator("button").count();

  for(let i = 0; i < optionsCount; ++i){
    const text = await dropdown.locator('button').nth(i).textContent();
    if(text === ' India'){
      dropdown.locator('button').nth(i).click();
      break;
    }
  }

  // Validating email address
  await expect(page.locator(".user__name [type='text']").first()).toHaveText(userName);
  await page.locator(".action__submit").click();

  // Thank you page
  await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
  const orderId = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent())?.trim();
  console.log(orderId);

  // Order page
  await page.locator("[routerlink*='myorders']").first().click();
  await page.locator("tbody").waitFor();

  const rows = await page.locator("tbody tr");

  for(let i = 0;  i < await rows.count(); i++){
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if(rowOrderId && orderId?.includes(rowOrderId)){
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(orderIdDetails && orderId?.includes(orderIdDetails)).toBeTruthy();

});