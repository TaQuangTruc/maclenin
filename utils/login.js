export const login = async(page, student) => {
    try {
      console.log(`Bắt đầu đăng nhập: ${student.email}`);
      
      await page.goto("https://youth-vnuhcm.edu.vn/login/", {
        waitUntil: "networkidle0",
        timeout: WAITINGTIME
      });
  
      
      // Nhập email
      await page.waitForSelector('input[name="username-40"]');
      await page.type('input[name="username-40"]', "krtosx5b77@tidissajiiu.com");
  
      
      //Nhập password
      await page.waitForSelector('input[name="user_password-40"]');
      await page.type('input[name="user_password-40"]', "Abc@1234_");
  
      //Ấn nút đăng nhập
      await page.click('#um-submit-btn');
    } catch (error) {
      
    }
  }