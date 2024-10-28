const { getEmail } = require("./getEmail");
const { getLastName, getFirstName, getUserName, getRandomStudentId, getRandomPhoneNumber } = require("../helper")

async function randomStudent(emailPage) {
  try {
    const lastName = await getLastName();
    const firstName = await getFirstName();
    const email = await getEmail(emailPage);
    const username = getUserName(lastName, firstName);
    const studentId = await getRandomStudentId();
    const phoneNumber = await getRandomPhoneNumber();
    return {
        lastName,
        firstName,
        username,
        email,
        password: "!@#QWE123qwe",
        school: "Đoàn Trường Đại học Công nghệ Thông tin, ĐHQG-HCM",
        phoneNumber,
        studentId, 
        emailLeader: "abc@gmail.com"
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { randomStudent };