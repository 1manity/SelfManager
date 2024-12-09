import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {
            id: null,
            username: '',
            avatar: '',
            nickname: '',
            bio: '',
            createdAt: '',
            updatedAt: '',
        }, // 初始状态为 null，表示未登录
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setUserAvatar: (state, action) => {
            if (state.user) {
                state.user.avatar = action.payload;
            }
        },
    },
});
export const { setUser, clearUser, setUserAvatar } = userSlice.actions;
export default userSlice.reducer;
