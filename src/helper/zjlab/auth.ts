import { request } from "@/utils/request";


export const getInfo = async (ticket) => {
  const { data } = await request({
    url: `https://onekey-test.zhejianglab.com/maxkey/authz/cas/p3/serviceValidate`,
    option: {
      method: 'GET',
      params: {
        ticket,
        service: 'localhost:8000'
      },
    }

  });
  return data;
};