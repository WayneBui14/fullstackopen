import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

// BẮT ĐẦU HOÀN THIỆN useCountry TẠI ĐÂY
export const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        // 1. Bỏ qua lần render đầu tiên khi name chưa có gì
        if (!name) {
            setCountry(null)
            return
        }

        const fetchCountry = async () => {
            try {
                // 2. Gọi API từ máy chủ proxy của FSO
                const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)

                // 3. Nếu thành công, set state với cờ found: true
                setCountry({ found: true, data: response.data })
            } catch (error) {
                // 4. Nếu lỗi (ví dụ 404 Not Found), set state với cờ found: false
                setCountry({ found: false, data: null })
            }
        }

        fetchCountry()

    }, [name]) // Dependency array chứa 'name': Chạy lại effect mỗi khi user bấm tìm kiếm tên mới

    return country
}