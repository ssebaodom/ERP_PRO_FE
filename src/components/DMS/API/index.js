import https from "../../../utils/https";

export const ApiGetTaskList = async (payload) => {
  return await https.post(`User/get-sysevents`, payload).then((res) => {
    return res;
  });
};

export const ApiGetTaskMaster = async (payload) => {
  return await https.post(`User/get-dsysevents-master`, payload).then((res) => {
    return res.data;
  });
};

export const ApiGetTaskDetail = async (payload) => {
  return await https.post(`User/get-dsysevents-detail`, payload).then((res) => {
    return res.data;
  });
};

export const ApiWebLookup = async (payload) => {
  return await https.post(`User/look-up`, payload).then((res) => {
    return res.data;
  });
};

export const ApiGetTaskSchedule = async (payload) => {
  return await https.post(`User/get-vtaskschedule`, payload).then((res) => {
    return res;
  });
};

export const ApiGetTourList = async (payload) => {
  return await https.post(`User/get_dmtuyen`, payload).then((res) => {
    return res.data;
  });
};

export const ApiGetTourDetail = async (payload) => {
  return await https.post(`User/get_ddmtuyen?ma_tuyen=${payload.ma_tuyen}`).then((res) => {
    return res.data;
  });
};

export const ApiGetTicketList = async (payload) => {
  return await https.post(`User/get_vticket`, payload).then((res) => {
    return res;
  });
};

export const ApiCreateTaskSchedule = async (payload) => {
  return await https
    .post(`Job/CreateUpdateTaskSchedule`, payload)
    .then((res) => {
      return res;
    });
};



export const SoFuckingUltimateApi = async (payload) => {
    return await https
      .post(`Selling/UltimateRequest`, payload)
      .then((res) => {
        return res;
      });
  };
  