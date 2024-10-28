const fs = require("fs");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function readFile(filePath) {
  try {
    // Đọc nội dung file đồng bộ
    const data = fs.readFileSync(filePath, "utf8");
    const results = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    return results;
  } catch (err) {
    console.error("Lỗi khi đọc file:", err);
    return [];
  }
}

function getLastName() {
  const ho = readFile("randomDB/ho.txt");
  const indexHo = getRandomInt(0, 99);

  return ho[indexHo];
}

function getFirstName() {
  const ten = readFile("randomDB/ten.txt");
  const indexTen = getRandomInt(0, 199);

  return indexTen > 99 ? `Thị ${ten[indexTen]}` : `Văn ${ten[indexTen]}`;
}

function getUserName(lastName, firstName) {


  const randomNumber = getRandomInt(100000, 999999);
  const name = `user${randomNumber}`;

  return name;
}

function getRandomStudentId() {
  const prefixs = readFile("randomDB/mssv.txt");
  const index = getRandomInt(0, prefixs.length - 1);

  const prefix = prefixs[index];
  const postfix = getRandomInt(1, 900000);
  const formattedPostfix = postfix.toString().padStart(6, "0");

  const mssv = `${prefix}${formattedPostfix}`;
  return mssv;
}

function getRandomPhoneNumber() {
  const prefixs = readFile("randomDB/dienthoai.txt");
  const index = getRandomInt(0, prefixs.length - 1);

  const prefix = prefixs[index];
  const postfix = getRandomInt(0, 9999999);

  const formattedPostfix = postfix.toString().padStart(7, "0");

  const phoneNumber = `${prefix}${formattedPostfix}`;

  return phoneNumber;
}

function writeQuestionsToFile(filePath, questions) {
  try {
    // Đọc nội dung file hiện tại
    const existingQuestions = new Set();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      const lines = data.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
      lines.forEach((line) => {
        const questionObj = JSON.parse(line); // Giả định mỗi dòng là một JSON
        existingQuestions.add(questionObj.question);
      });
    }

    // Loại bỏ các câu hỏi trùng lặp trong mảng mới
    const uniqueQuestions = [];
    const questionSet = new Set(); // Set để theo dõi câu hỏi trong mảng mới
    for (const question of questions) {
      if (!questionSet.has(question.question) && !existingQuestions.has(question.question)) {
        uniqueQuestions.push(question);
        questionSet.add(question.question);
      }
    }

    // Ghi các câu hỏi mới vào file
    const dataToWrite = uniqueQuestions.map((q) => JSON.stringify(q)).join("\n");
    if (dataToWrite) {
      fs.appendFileSync(filePath, dataToWrite + "\n"); // Ghi vào cuối file
    }

    console.log("Đã ghi thành công các câu hỏi mới vào file.");
  } catch (err) {
    console.error("Lỗi khi ghi file:", err);
  }
}


module.exports = {
  getLastName,
  getFirstName,
  getUserName,
  getRandomStudentId,
  getRandomPhoneNumber,
  writeQuestionsToFile
};
