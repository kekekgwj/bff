import { request } from "@/utils/request";


export const getInfo = async (ticket) => {
  const { data } = await request({
    url: `https://onekey.zhejianglab.com/maxkey/authz/cas/p3/serviceValidate`,
    option: {
      method: 'GET',
      params: {
        ticket,
        service: 'http://fintech.zhejianglab.com/'
      },
    }

  });
  return data;
};