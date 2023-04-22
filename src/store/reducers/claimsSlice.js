import { createSlice} from "@reduxjs/toolkit";

const claims = createSlice({
    name:'claims',
    initialState:{
        claims:[],
        textTest : ''
    },
    reducers:{
        setClaims(state,action){
            state.claims = action.payload
        },
        setText(state,action){
            state.textTest = action.payload
        }
    }
});

const claimsReducer = claims.reducer;
export default claimsReducer
export const {setClaims,setText} = claims.actions;