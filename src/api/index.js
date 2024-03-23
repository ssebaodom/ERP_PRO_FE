import https from "../utils/https";
import jwt from "../utils/jwt";

export const refreshToken = async () => {
  return await https
    .post(`Authentication/Refresh`, {
      token: await jwt.getAccessToken(),
      refreshToken: await jwt.getRefreshToken(),
    })
    .then(async (res) => {
      return res.data;
    })
    .catch((err) => {
      return null;
    });
};
