const info = (...params) => {
    console.log(...params)
} // Nhận tham số và log ra console

const error = (...params) => {
    console.error(...params)
} // Nhận tham số và log ra console

module.exports = { info, error } // Xuất info và error ra ngoài