import dayjs from "dayjs";
import https from "../utils/https";
import jwt from "../utils/jwt";

export const refreshToken = async () => {
  return await https
    .post(`Authentication/Refresh`, {
      token: await jwt.getAccessToken(),
      refreshToken: await jwt.getRefreshToken(),
      expiration: await dayjs(1689069152),
    })
    .then(async (res)   => {
      if (res.data) await jwt.setAccessToken(res.data);
      return jwt.getAccessToken();
    }).catch(err => {
      return 500
    })
    ;
};
