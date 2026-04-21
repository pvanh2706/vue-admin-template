import type { FormRules } from 'element-plus'
import type { RuleForm } from '../types/auth-form.type'

export const signupRules: FormRules<RuleForm> = {
    name: [
        { required: true, message: 'Trường này bắt buộc nhập', trigger: 'blur' },
        { min: 3, max: 50, message: 'Độ dài phải từ 3 đến 50 ký tự', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Trường này bắt buộc nhập', trigger: 'blur' },
        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: 'Trường này bắt buộc nhập', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Vui lòng nhập lại mật khẩu'))
                } else if (value !== (rule as any).form?.password) {
                    callback(new Error('Mật khẩu không khớp'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        },
    ],
}
