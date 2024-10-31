const { getEmail } = require("./getEmail");
const { getLastName, getFirstName, getUserName, getRandomStudentId, getRandomPhoneNumber, getRandomEmailFromName } = require("./helper")

async function randomStudent(emailPage) {
  try {
    const lastName = await getLastName();
    const firstName = await getFirstName();
    const username = getUserName(lastName, firstName);
    const email = await getRandomEmailFromName(username);
    const studentId = await getRandomStudentId();
    const phoneNumber = await getRandomPhoneNumber();
    return {
        lastName,
        firstName,
        username,
        email,
        password: "!@#QWE123qwe",
        school: "Đoàn Trường Đại học Bách Khoa, ĐHQG-HCM",
        branch: "Đoàn Trường Đại học Bách Khoa",
        phoneNumber,
        studentId, 
        emailLeader: "abc@gmail.com"
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { randomStudent };