import { Injectable } from "@nestjs/common";
import { xml2js } from "xml-js";
import {
  getInfo,
} from 'src/helper/zjlab/auth';
import { MailerService } from "@nestjs-modules/mailer";
import { getDigitalCode }  from "node-verification-code";

@Injectable()
export class ZjlabService {
  constructor(private readonly mailerService: MailerService) {}

  async getUserInfo(ticket: string) {
    const xml: any = await getInfo(ticket)
    const xmlData = xml2js(xml, {
      compact: true,
    });
    let userInfo: any;
    try {
      const data = xmlData["cas:serviceResponse"];
      if (data && data["cas:authenticationSuccess"]) {
        const suc = data["cas:authenticationSuccess"];
        const userID = suc["cas:user"]["_text"];
        const attrs = suc["cas:attributes"];
        const nameBase64 = attrs["cas:displayName"]["_text"].split(':')[1];
        const name = Buffer.from(nameBase64, 'base64').toString();
        const sessionID = attrs["cas:globalSessionId"]["_text"];
        
        userInfo = {
          id: userID,
          name,
          sessionID,
        }
      
      } else {
        throw new Error("fail: ticket invalid");
      }

    } catch (e) {
      console.error(e);
      return null;
    }
    return userInfo;
    

  }

  async smtpServerConnect(verifyCode: string, email: string) {
    // 生成验证码
    this.mailerService
    .sendMail({
      to: email,
      from: 'fintech-portal@zhejianglab.com',
      subject: '之江金融验证平台注册验证', 
      // text: '您好！感谢您注册之江金融验证平台！您的账户正在进行邮箱验证，请点击🔗链接就行验证，有效期为10分钟', 
      template: 'index',
      context: {  // Data to be sent to template engine.
        code: verifyCode,
        email,
        link: `http://localhost:3000/user/activate?username=${email}&code=${verifyCode}`,
      },
    })
    .then((success) => {
      console.log(success)
    })
    .catch((err) => {
      console.log(err)
    });


  } 

}