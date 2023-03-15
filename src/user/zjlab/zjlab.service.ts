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

  async smtpServerConnect() {
    // 生成验证码
    const smsVerificationCode = getDigitalCode(4).toString();
    this.mailerService
    .sendMail({
      to: 'guo.weijie@zhejianglab.com',
      from: 'fintech-portal@zhejianglab.com',
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      template: 'index',
      context: {  // Data to be sent to template engine.
        code: smsVerificationCode,
        username: 'john doe',
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