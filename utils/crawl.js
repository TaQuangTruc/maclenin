const { writeQuestionsToFile } = require("../helper");
const { delay, appendFile } = require("./helper");
const fs = require("fs").promises;

async function test(page, student, index) {
  try {
    await page.goto("https://youth-vnuhcm.edu.vn/hoi-thi-olympic-mac-lenin/", {
      waitUntil: "networkidle0",
      timeout: 5000,
    });

    await page.click(".ays_next.start_button.action-button");

    // Nhập MSSV
    await page.waitForSelector('input[name="quiz_attr_3"]');
    await page.type('input[name="quiz_attr_3"]', student.studentId);

    // Nhập số điện thoại
    await page.waitForSelector('input[name="ays_user_phone"]');
    await page.type('input[name="ays_user_phone"]', student.phoneNumber);

    // Nhập Email trưởng nhóm
    await page.waitForSelector("#ays_form_field_quiz_attr_1_2");
    await page.type("#ays_form_field_quiz_attr_1_2", student.emailLeader);

    // Chọn đơn vị
    await page.select(
      "#ays_form_field_quiz_attr_2_2",
      "Đoàn Trường Đại học Công nghệ Thông tin"
    );
    delay(2000);

    await page.evaluate(() => {
      document.querySelector('input[name="next"]').click();
    });
    delay(3000);

    const questionsArray = await page.evaluate(() => {
      const questions = document.querySelectorAll(".step");
      const questionsArray = [];

      // Lặp qua từng câu hỏi
      questions.forEach((question) => {
        // Lấy nội dung câu hỏi
        const questionText = question.querySelector(
          ".ays_quiz_question p"
        )?.innerText;
        if (!questionText) return;

        // Lấy tất cả các đáp án
        const answerElements = question.querySelectorAll(
          ".ays-quiz-answers .ays_list_view_item label"
        );
        const answers = Array.from(answerElements) // Chuyển đổi NodeList thành mảng
          .map((answer) => answer.innerText.trim()) // Lấy nội dung và loại bỏ khoảng trắng
          .filter((answer) => answer !== ""); // Lọc các đáp án rỗng

        // Thêm vào mảng kết quả
        questionsArray.push({
          question: questionText,
          answers: answers,
        });
      });

      return questionsArray;
    });

    appendFile(`questionBank/question${index}.txt`, questionsArray)

  } catch (error) {
    console.log(
      `Lỗi khi thi cho sinh viên ${student.studentId} - ${student.email}`
    );
    throw error;
  }
}

module.exports = { test };
