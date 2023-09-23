import https from "../../../utils/https";

export const SoFuckingUltimateApi = async (payload) => {
  return await https.post(`Selling/UltimateRequest`, payload).then((res) => {
    return res;
  });
};
