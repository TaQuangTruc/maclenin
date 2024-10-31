const { getQuestionBanks } = require("./utils/helper");

const cleanedQuestion = "Trong nhiệm vụ xây dựng chính quyền hiệu lực, hiệu quả, ?"
const questionBanks = getQuestionBanks();
const questionBankItem = questionBanks.find((q) =>
    cleanedQuestion.includes(q.question)
  );

console.log(questionBankItem.answer)