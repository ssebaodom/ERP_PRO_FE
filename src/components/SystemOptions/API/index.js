import https from "../../../utils/https";

export const SoFuckingUltimateGetApi = async (payload) => {
    return await https
      .post(`user/get_ultimate`, payload)
      .then((res) => {
        return res;
      });
  };
  