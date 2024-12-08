import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null, // 初始状态为 null，表示未登录
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
