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


function IPtoNum(ip){
  return Number(
    ip.split(".")
      .map(d => ("000"+d).substr(-3) )
      .join("")
  );
}
const internalIPs = [
  ['10.0.0.0', '10.255.255.255'],
  ['172.16.0.0', '172.31.255.255'],
  ['192.168.0.0', '192.168.255.255'],
];
export const IsInternalUser = (verifyIP) => {
  let isInternal = false;
  internalIPs.forEach(ip => {
    const [ipStart, ipEnd] = ip;
    if (IPtoNum(verifyIP) >= IPtoNum(ipStart) && IPtoNum(verifyIP) <= IPtoNum(ipEnd)) {
      isInternal = true;
    }
  })
  return isInternal;

}