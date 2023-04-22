export const todoSelector = (state) => state.todoReducer.allTodos;
export const getLoading = (state) => state.loadingReducer.loading;
export const getClaims = (state) => state.claimsReducer.claims;
export const getTestText = (state) => state.claimsReducer.textTest;
