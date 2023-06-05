import https from "../../../utils/https";

export const ApiGetTaskList = async (payload) =>{
    return await https.post(`User/get_test`,payload).then((res)=>{
        return res
    })
}
