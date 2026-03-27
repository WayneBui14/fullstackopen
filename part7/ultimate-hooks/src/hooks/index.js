import { useState, useEffect } from 'react'
import axios from 'axios'

// (Giữ nguyên useField từ các bài trước ở đây nếu bạn dùng chung file)
export const useField = (type) => {
    const [value, setValue] = useState('')
    const onChange = (event) => setValue(event.target.value)
    return { type, value, onChange }
}

// BẮT ĐẦU VIẾT SIÊU HOOK: useResource
export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    // 1. Lấy dữ liệu (GET) ngay khi Component được render lần đầu
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get(baseUrl)
                setResources(response.data)
            } catch (error) {
                console.error('Lỗi khi fetch data:', error)
            }
        }
        fetchResources()
    }, [baseUrl]) // Dependency array chứa baseUrl, đề phòng URL bị đổi

    // 2. Hàm thêm mới (POST)
    const create = async (resource) => {
        try {
            const response = await axios.post(baseUrl, resource)
            // Thêm data mới từ server trả về vào mảng state hiện tại
            setResources(resources.concat(response.data))
        } catch (error) {
            console.error('Lỗi khi tạo mới:', error)
        }
    }

    // 3. Đóng gói các hàm thao tác vào một object
    const service = {
        create
    }

    // 4. Trả về đúng định dạng yêu cầu: [data, object_service]
    return [
        resources, service
    ]
}