import api from "./api/axios";
import type { User } from "../types/user";

// Cách 1: Không dùng try-catch - hệ thống tự bắt lỗi
export const fetchUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};

// Cách 2: Dùng try-catch khi cần xử lý lỗi cụ thể
export const fetchUserById = async (id: number): Promise<User | null> => {
    try {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    }
    catch (error) {
        // Xử lý lỗi riêng cho hàm này
        console.error(`Custom handling for user ${id}`, error);
        return null; // hoặc throw error nếu cần
    }
};

// Cách 1: Không dùng try-catch
// Omit<T, K>
// Loại bỏ field K khỏi type T	
// VD: Omit<User, 'id'> = { name, email }

// Tìm hiểu thêm các Utils type: https://www.typescriptlang.org/docs/handbook/utility-types.html
// Required<T> - làm tất cả fields bắt buộc
// Pick<T, K> - chỉ chọn field K
// Record<K, T> - tạo object với keys K và values T
// Partial<T> - làm tất cả fields tùy chọn
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post<User>('/users', user);
    return response.data;
};

// Cách 2: Xử lý lỗi cụ thể
export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
    try {
        const response = await api.put<User>(`/users/${id}`, user);
        return response.data;
    }
    catch (error) {
        // Xử lý riêng (ví dụ: retry logic, notification, etc)
        console.error(`Custom handling for updating user ${id}`, error);
        return null;
    }
};