const puppeteer = require("puppeteer");
const { delay } = require("./utils/helper");
const { register } = require("./utils/register");
const { randomStudent } = require("./utils/randomStudent");
const { getConfirmLink } = require("./utils/getEmail");
const { test } = require("./utils/crawl");

(async () => {
  let browser;
  let page;
  let confirmPage;

  for (let i = 1; i < 50; i++) {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    const student = await randomStudent(page);

    try {
      console.log(`Bắt đầu đăng ký cho sinh viên ${student.studentId} - ${student.email}`)
      await register(page, student);
      console.log(`Kết thúc đăng ký cho sinh viên ${student.studentId} - ${student.email}`)
      await delay(5000);

      // Xác nhận email
      console.log(`Bắt đầu xác nhận email cho sinh viên ${student.studentId} - ${student.email}`)
      const confirmLink = await getConfirmLink(page);
      if (confirmLink == null) {
        throw new Error(`Xảy ra lỗi cho sinh viên ${student.studentId} - ${student.email}`)
      }
      confirmPage = await browser.newPage();
      await confirmPage.goto(confirmLink);
      await delay(5000);
      await confirmPage.close();
      console.log(`Kết thúc xác nhận email cho sinh viên ${student.studentId} - ${student.email}`)

      console.log(`Bắt đầu thi cho sinh viên ${student.studentId} - ${student.email}`)
      await test(page, student, i);
      console.log(`Kết thúc thi cho sinh viên ${student.studentId} - ${student.email}`)
    } catch (error) {
      console.error(error);
      console.log(`Xảy ra lỗi cho sinh viên ${student.studentId} - ${student.email}`)
    } finally {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
      console.log("=====================================================================")
    }
  }
})();
