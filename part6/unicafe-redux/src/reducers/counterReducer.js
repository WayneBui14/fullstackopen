const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}
/* Trong kiến trúc State management, hàm action đóng vai trò là một người đưa tin
khi có sự thay đổi xảy ra trong state.
*/
const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return { ...state, good: state.good + 1 }
    case 'OK':
      return { ...state, ok: state.ok + 1 }
    case 'BAD':
      return { ...state, bad: state.bad + 1 }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default counterReducer
