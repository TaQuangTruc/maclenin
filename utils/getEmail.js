const { delay } = require("./helper");

async function getEmail(emailPage) {
  try {
    await emailPage.goto("https://temp-mail.io/en", {
      waitUntil: "networkidle0",
    });

    const email = await emailPage.evaluate(() => {
      const emailInput = document.querySelector("#email");
      return emailInput ? emailInput.value : null;
    });

    return email;
  } catch (error) {
    console.error("Error getting temporary email:", error);
  }
}

async function getConfirmLink(page) {
  try {
    // Truy cập trang temp-mail.io
    await page.goto("https://temp-mail.io/en", { waitUntil: "networkidle0" });

    await page.waitForSelector(
      '[title="Kích hoạt tài khoản tại trang Tuổi trẻ Đại học Quốc gia TP.HCM"]',
      { timeout: 5000 }
    );
    await page.click(
      '[title="Kích hoạt tài khoản tại trang Tuổi trẻ Đại học Quốc gia TP.HCM"]'
    );

    await delay(3000);

    const confirmLink = await page.evaluate(() => {
      const linkElement = Array.from(document.querySelectorAll("a")).find(
        (element) => element.textContent.trim() === "Kích hoạt tài khoản"
      );
      return linkElement ? linkElement.href : null;
    });

    return confirmLink;
  } catch (error) {
    console.error("Error getting temporary email:", error);
  }
}

module.exports = { getEmail, getConfirmLink };
