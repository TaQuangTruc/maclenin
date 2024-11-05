const {
  writeQuestionsToFile,
  getQuestionBanks,
  getRandomInt,
  log,
} = require("./helper");
const { delay } = require("./helper");
const fs = require("fs").promises;

async function test(page, student) {
  try {
    await page.goto("https://youth-vnuhcm.edu.vn/hoi-thi-olympic-mac-lenin/", {
      waitUntil: "networkidle0",
      timeout: 10000,
    });

    const examButton = await page.$(".ays_next.start_button.action-button");
    if (!examButton) {
      throw new Error(`Thí sinh ${student.email} đã hết lượt thi`);
    }

    // Cuộn đến phần tử
    await page.evaluate((element) => {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, examButton);
    // Click vào nút
    await examButton.click();
    console.log("Bắt đầu điền thông tin...");

    // Nhập MSSV
    await page.waitForSelector('input[name="quiz_attr_3"]');
    await page.type('input[name="quiz_attr_3"]', student.studentId);

    // Nhập số điện thoại
    await page.waitForSelector('input[name="ays_user_phone"]');
    await page.type('input[name="ays_user_phone"]', student.phoneNumber);

    // Nhập Email trưởng nhóm
    // await page.waitForSelector("#ays_form_field_quiz_attr_1_2");
    // await page.type("#ays_form_field_quiz_attr_1_2", student.emailLeader);

    // Chọn đơn vị
    await page.select("#ays_form_field_quiz_attr_2_2", student.branch);

    await delay(getRandomInt(3000, 5000));

    const clicked = await page.evaluate(() => {
      const buttonStart = document.querySelectorAll(
        "input.ays_next.action-button"
      )[1];
      if (buttonStart) {
        buttonStart.click();
        return true; // Trả về true nếu click thành công
      } else {
        return false; // Trả về false nếu không tìm thấy phần tử
      }
    });

    if (clicked) {
      console.log("Điền thông tin thành công");
    } else {
      throw new Error("Điền thông tin thất bại");
    }
    await delay(getRandomInt(3000, 5000));

    const questionBank = getQuestionBanks();
    if (questionBank.length > 0) {
      console.log("Đọc ngân hàng câu hỏi thành công");
    } else throw new Error("Lỗi khi đọc ngân hàng câu hỏi. Báo lại gấp!!!");

    const questions = await page.$$(".step");
    for (let i = 2; i <= 41; i++) {
      try {
        console.log(`Bắt đầu câu hỏi ${i - 1}/40`);
        console.log("Đang đọc nội dung câu hỏi");

        const questionElement = await questions[i].$(".ays_quiz_question p");
        const answerElements = await questions[i].$$(".ays_position_initial");

        const questionText = await questionElement.evaluate(
          (el) => el.innerText
        );
        const cleanedQuestion = questionText.replace(/^\d+\.\s*/, "").trim();

        console.log("Đang tìm kiếm");
        await delay(getRandomInt(1000, 2000));

        const questionBankItem = questionBank.find((q) =>
          cleanedQuestion.includes(q.question)
        );
        if (!questionBankItem) {
          console.log(
            `Không tìm thấy câu hỏi ${i - 1} trong ngân hàng câu hỏi.`
          );
          let answers = [];
          for (let j = 0; j < answerElements.length; j++) {
            answers.push(
              await answerElements[j].evaluate((el) => el.innerText.trim())
            );
          }
          log(
            "notFountQuestion.txt",
            JSON.stringify({
              question: cleanedQuestion,
              answers,
            })
          );
          continue;
        }

        console.log("Bắt đầu trả lời");
        await delay(getRandomInt(1000, 2000));
        for (let j = 0; j < answerElements.length; j++) {
          const answerText = await answerElements[j].evaluate((el) =>
            el.innerText.trim()
          );
          if (answerText == questionBankItem.answer && answerElements[j]) {
            await answerElements[j].click();
            console.log("Đã trả lời câu hỏi");
            break;
          }
        }

        await delay(2000);
      } catch (error) {
        console.log(`Xảy ra lỗi khi trả lời câu hỏi ${i - 1}`);
      } finally {
        if (i == 11 || i == 21 || i == 31) {
          const nextButtons = await page.$$(
            ".ays_next.action-button"
          );
          let z;
          if (i == 11) z = 4
          else if (i == 21) z = 6
          else z = 8
           
          if (nextButtons.length > 0) {
            nextButtons[z].click();
          }
          await delay(2000);
        }
        continue;
      }
    }

    await delay(3000);
    // Chờ nút xuất hiện và click vào
    const finishButton = await page.$(".ays_next.ays_finish.action-button");
    await finishButton.click();

    await delay(3000);
  } catch (error) {
    console.log(
      `Lỗi khi thi cho sinh viên ${student.studentId} - ${student.email}`
    );
    throw error;
  }
}

module.exports = { test };
