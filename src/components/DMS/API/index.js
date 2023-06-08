import https from "../../../utils/https";

export const ApiGetTaskList = async (payload) =>{
    return await https.post(`User/get-sysevents`,payload).then((res)=>{
        return res
    })
}


export const ApiGetTaskMaster = async (payload) =>{
    return await https.post(`User/get-sysevents-detail`,payload).then((res)=>{
        return res.data
    })
}


export const ApiGetTaskDetail = async (payload) =>{
    return await https.post(`User/get-dsysevents-detail`,payload).then((res)=>{
        return res.data
    })
}
