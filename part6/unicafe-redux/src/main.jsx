/* Nhận 'bản vẽ' từ react và tìm cách hiệu quả nhất
 để cập nhật vào cây DOM thực tế của HTML. Cung cấp các phương thức 
 như createRoot và render() để gắn ứng dụng react vào HTML */
import ReactDOM from 'react-dom/client'
/* Tạo 'store' để lưu trữ 'state' */
import { createStore } from 'redux'
// Nhập module reducer
import counterReducer from './reducers/counterReducer'


// Tạo store lưu trữ trạng thái dữ liệu
const store = createStore(counterReducer)

/* dispatch là phiếu yêu cầu giao dịch đến store để thực hiện thay đổi state dữ liệu,
dispatch gửi một action (thông điệp) đến reducer */
const App = () => {
  return (
    <div>
      <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => store.dispatch({ type: 'OK' })}>ok</button>
      <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => store.dispatch({ type: 'RESET' })}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

/* Tạo root DOM */
const root = ReactDOM.createRoot(document.getElementById('root'))

/* Render component */
const renderApp = () => {
  root.render(<App />)
}

renderApp()
/* Khi state thay đổi, render lại component */
store.subscribe(renderApp)
