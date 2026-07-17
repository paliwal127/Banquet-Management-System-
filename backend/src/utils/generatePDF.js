const puppeteer = require("puppeteer");

const generatePDF = async (html, options = {}) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    ...options
  });

  await browser.close();
  return pdf;
};

module.exports = {
  generatePDF
};
