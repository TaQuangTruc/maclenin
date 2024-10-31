const puppeteer = require("puppeteer");
const { register } = require("./utils/register");
const { test } = require("./utils/test");
const { randomStudent } = require("./utils/randomStudent");
const { authorize, getConfirmationLink } = require("./utils/getEmail");
const { log, delay } = require("./utils/helper");


const BASED = 500;
(async () => {
  let browser;
  let page;

  for (let i = 0; i < 50; i++) {
    const student = await randomStudent();
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    try {
      console.log(
        `Bắt đầu đăng ký cho sinh viên ${student.studentId} - ${student.email}`
      );
      log("process.txt", `Bắt đầu đăng ký cho sinh viên ${student.studentId} - ${student.email}`)
      await register(page, student);
      console.log(
        `Kết thúc đăng ký cho sinh viên ${student.studentId} - ${student.email}`
      );
      log("process.txt", `Kết thúc đăng ký cho sinh viên ${student.studentId} - ${student.email}`)
      log("accounts.txt", `${student.studentId} - ${student.email}`)

      console.log(
        `Bắt đầu xác thực cho sinh viên ${student.studentId} - ${student.email}`
      );
      log("process.txt", `Bắt đầu xác thực cho sinh viên ${student.studentId} - ${student.email}`)
      const auth = await authorize();
      let confimationLink = null;
      waitedTime = 0;
      do {
        console.log("Đang trong quá trình xác thực..")
        await delay(BASED * 10);
        waitedTime += BASED * 10;
        confimationLink = await getConfirmationLink(auth, student.email);
        if (waitedTime > BASED * 50)
          throw new Error("Không tìm thấy email xác nhận");
      } while (!confimationLink);
      const confirmPage = await browser.newPage();
      await Promise.all([
        confirmPage.goto(confimationLink),
        confirmPage.waitForNavigation(),
      ]);
      await delay(5000);
      await confirmPage.close();
      console.log(
        `Kết thúc xác thực cho sinh viên ${student.studentId} - ${student.email}`
      );
      log("process.txt", `Kết thúc xác thực cho sinh viên ${student.studentId} - ${student.email}`)


      console.log(
        `Bắt đầu thi cho sinh viên ${student.studentId} - ${student.email}`
      );
      log("process.txt", `Bắt đầu thi cho sinh viên ${student.studentId} - ${student.email}`)
      await test(page, student);
      console.log(
        `Kết thúc thi cho sinh viên ${student.studentId} - ${student.email}`
      );
      log("process.txt", `Kết thúc thi cho sinh viên ${student.studentId} - ${student.email}`)
    } catch (error) {
      console.log(error);
      log("process.txt", `Xảy ra lỗi cho sinh viên ${student.studentId} - ${student.email}`)
      log("errorStudent.txt", `${student.studentId} - ${student.email}`)
      console.log(
        `Xảy ra lỗi cho sinh viên ${student.studentId} - ${student.email}`
      ); 
    } 
    // finally {
    //   if (page) {
    //     await page.close();
    //   }
    //   if (browser) {
    //     await browser.close();
    //   }
    //   console.log(
    //     "====================================================================="
    //   );
    // }
  }
})();
