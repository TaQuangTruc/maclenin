async function register(page, student) {
  try {
    await page.goto("https://youth-vnuhcm.edu.vn/register/", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForSelector('input[name="user_login-39"]');
    await page.type('input[name="user_login-39"]', student.username);

    await page.waitForSelector('input[name="last_name-39"]');
    await page.type('input[name="last_name-39"]', student.lastName);

    await page.waitForSelector('input[name="first_name-39"]');
    await page.type('input[name="first_name-39"]', student.firstName);

    await page.waitForSelector('input[name="user_email-39"]');
    await page.type('input[name="user_email-39"]', student.email);

    await page.waitForSelector("#select2-school-container");
    await Promise.all([await page.click("#select2-school-container")]);

    const elements = await page.$$(".select2-results__option"); // Lấy tất cả các thẻ <li> có class này

    // Duyệt qua các phần tử và kiểm tra nội dung
    for (let element of elements) {
      const text = await page.evaluate((el) => el.textContent, element); // Lấy nội dung văn bản của thẻ
      if (text === student.school) {
        await element.click();
        break;
      }
    }

    await page.waitForSelector('input[name="user_password-39"]');
    await page.type('input[name="user_password-39"]', student.password);

    await page.waitForSelector('input[name="confirm_user_password-39"]');
    await page.type('input[name="confirm_user_password-39"]', student.password);

    await page.click("#um-submit-btn");
  } catch (error) {
    console.log(`Lỗi khi đăng ký cho sinh viên ${student.studentId} - ${student.email}`);
    throw error;
  }
}

module.exports = { register };
