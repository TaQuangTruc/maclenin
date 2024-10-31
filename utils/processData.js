const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục chứa các file txt
const directoryPath = path.join(__dirname, "../questionBank"); // Thay thế bằng đường dẫn thực tế của bạn

// Hàm để đọc các file txt và trả về một mảng câu hỏi
const readFiles = async () => {
  const files = await fs.promises.readdir(directoryPath);
  const questions = [];

  for (const file of files) {
    if (path.extname(file) === '.txt') {
      const data = await fs.promises.readFile(path.join(directoryPath, file), 'utf-8');
      const parsedData = JSON.parse(data);
      questions.push(...parsedData); // Thêm tất cả câu hỏi vào mảng
    }
  }
  
  return questions;
};

// Hàm để loại bỏ số thứ tự ở đầu câu hỏi
const removeNumbering = (question) => {
  return question.replace(/^\d+\.\s*/, ''); // Loại bỏ số thứ tự và dấu chấm ở đầu
};

// Hàm để lọc câu hỏi trùng nhau
const filterUniqueQuestions = (questions) => {
  const uniqueQuestions = [];
  const seen = new Set();

  for (const question of questions) {
    const cleanedQuestion = removeNumbering(question.question).trim(); // Loại bỏ số thứ tự
    if (!seen.has(cleanedQuestion)) {
      seen.add(cleanedQuestion);
      uniqueQuestions.push({ ...question, question: cleanedQuestion }); // Cập nhật câu hỏi đã làm sạch
    }
  }

  return uniqueQuestions;
};

// Hàm để chia mảng thành các file với mỗi file 50 câu
const writeFiles = async (questions) => {
  const chunkSize = 50;
  for (let i = 0; i < questions.length; i += chunkSize) {
    const chunk = questions.slice(i, i + chunkSize);
    const fileName = `questions_chunk_${Math.floor(i / chunkSize) + 1}.txt`;
    await fs.promises.writeFile(path.join(directoryPath, fileName), JSON.stringify(chunk, null, 2));
  }
};

// Hàm chính để thực hiện các bước
const main = async () => {
  try {
    const questions = await readFiles();
    const uniqueQuestions = filterUniqueQuestions(questions);
    await writeFiles(uniqueQuestions);
    console.log(`Đã ghi ${Math.ceil(uniqueQuestions.length / 50)} file chứa câu hỏi.`);
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error);
  }
};

// Chạy hàm chính
main();
