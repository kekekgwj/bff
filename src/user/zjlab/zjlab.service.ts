import { getConfig } from "@/utils";
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { xml2js } from "xml-js";
import {
  getInfo,
} from 'src/helper/zjlab/auth';

@Injectable()
export class ZjlabService {
  private ZJ_LAB_APP_ID

  constructor(
    // private configService: ConfigService
  ) {
    // const { ZJ_CONFIG } = getConfig()
    // this.ZJ_LAB_APP_ID = ZJ_CONFIG.APP_ID;
  }
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
        const nameBase64 = attrs["cas:displayName"]["_text"];
        const name = Buffer.from(nameBase64, 'base64').toString();
        const sessionID = attrs["cas:globalSessionId"]["_text"];
        
        userInfo = {
          id: userID,
          name,
          sessionID,
        }
      
      } else {
        throw new Error("fail");
      }

    } catch (e) {
      console.error(e);
      return null;
    }
    return userInfo;
    

  }

}