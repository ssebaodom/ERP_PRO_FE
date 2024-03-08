import https from "../../../utils/https";

export const SoFuckingUltimateApi = async (payload) => {
  return await https.post(`user/UltimateRequest`, payload).then((res) => {
    return res;
  });
};
