const fs = require("fs");
const slugify = require("slugify");
const htmlParser = require("node-html-parser");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

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

function getQuestionBanks() {
  try {
    // Đọc file .txt
    const data = fs.readFileSync("questionBank.json", 'utf8');
    
    // Loại bỏ các ký tự xuống dòng dư thừa và chuyển đổi chuỗi JSON thành mảng
    const arrayData = JSON.parse(data);
    return arrayData;
  } catch (error) {
    console.error('Lỗi khi đọc file:', error);
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
  const randomNumber = getRandomInt(10000, 99999);
  const name = `${lastName} ${firstName}`;
  const result = removeAccentsAndFormat(name);

  return `${result}${randomNumber}`;
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
      const lines = data
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      lines.forEach((line) => {
        const questionObj = JSON.parse(line); // Giả định mỗi dòng là một JSON
        existingQuestions.add(questionObj.question);
      });
    }

    // Loại bỏ các câu hỏi trùng lặp trong mảng mới
    const uniqueQuestions = [];
    const questionSet = new Set(); // Set để theo dõi câu hỏi trong mảng mới
    for (const question of questions) {
      if (
        !questionSet.has(question.question) &&
        !existingQuestions.has(question.question)
      ) {
        uniqueQuestions.push(question);
        questionSet.add(question.question);
      }
    }

    // Ghi các câu hỏi mới vào file
    const dataToWrite = uniqueQuestions
      .map((q) => JSON.stringify(q))
      .join("\n");
    if (dataToWrite) {
      fs.appendFileSync(filePath, dataToWrite + "\n"); // Ghi vào cuối file
    }

    console.log("Đã ghi thành công các câu hỏi mới vào file.");
  } catch (err) {
    console.error("Lỗi khi ghi file:", err);
  }
}

function getRandomEmailFromName(name) {
  return name.toLowerCase() + "@tuoitrebachkhoa.edu.vn";
}

function removeAccentsAndFormat(str) {
  return str
    .normalize("NFD") // Chuyển ký tự có dấu về dạng ký tự + dấu
    .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
    .replace(/\s+/g, "") // Xóa tất cả khoảng trắng
    .toLowerCase(); // Chuyển tất cả ký tự về chữ thường
}

function getLink(text) {
  const root = htmlParser.parse(text);
  return root.querySelector("a").getAttribute("href");
}

// Chuyển hàm log thành một Promise
function log(path, content) {
  return new Promise((resolve, reject) => {
      const contentWithNewline = content + '\n';
      fs.writeFile(path, contentWithNewline, { flag: 'a' }, (err) => {
          if (err) {
              console.error('Lỗi khi ghi vào file:', err);
              reject(err);
              return;
          }
          console.log('Ghi nội dung thành công');
          resolve(); // Ghi thành công
      });
  });
}

module.exports = {
  getLastName,
  getFirstName,
  getUserName,
  getRandomStudentId,
  getRandomPhoneNumber,
  writeQuestionsToFile,
  getRandomEmailFromName,
  getLink,
  delay,
  log,
  getQuestionBanks,
  getRandomInt,
  readFile
};
