import { createSlice} from "@reduxjs/toolkit";

const claims = createSlice({
    name:'claims',
    initialState:{
        claims:[],
        textTest : '',
        userInfo:{}
    },
    reducers:{
        setClaims(state,action){
            state.claims = action.payload
            state.userInfo = {
                userName:'Mạch Hải Hưng',
                role:'0',
                roleName:'Admin',
                unitId:1,
                unitName:'SSE',
            }
        },
        setText(state,action){
            state.textTest = action.payload
        }
    }
});

const claimsReducer = claims.reducer;
export default claimsReducer
export const {setClaims,setText} = claims.actions;