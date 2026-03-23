import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter', // Tên định danh của slice này
    initialState: '', // State mặc định ban đầu
    reducers: {
        // Tên hàm này (filterChange) sẽ tự động trở thành Action Creator
        filterChange(state, action) {
            return action.payload // Trả về chữ người dùng gõ vào
        }
    }
})

// createSlice tự động sinh ra action creator cho bạn
export const { filterChange } = filterSlice.actions

// Export reducer để đưa vào Store
export default filterSlice.reducer