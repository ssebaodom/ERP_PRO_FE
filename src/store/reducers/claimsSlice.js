import { createSlice } from "@reduxjs/toolkit";

const claims = createSlice({
  name: "claims",
  initialState: {
    claims: [],
    textTest: "",
    userInfo: {},
    isBackgound: false,
  },
  reducers: {
    setClaims(state, action) {
      state.claims = action?.payload;
      state.userInfo = {
        userName: action?.payload?.Name,
        role: action?.payload?.RoleId,
        roleName: action?.payload?.Role,
        unitId: action?.payload?.MA_DVCS,
        unitName: action?.payload?.DVCS,
        isPremium: false,
        id: parseInt(action?.payload?.Id),
      };
    },
    setIsBackgrouds(state, action) {
      state.isBackgound = action?.payload;
    },
    setText(state, action) {
      state.textTest = action?.payload;
    },
  },
});

const claimsReducer = claims.reducer;
export default claimsReducer;
export const { setClaims, setText, setIsBackgrouds } = claims.actions;
