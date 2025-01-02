import * as yup from 'yup';
import { ValidationError } from 'yup';

const userValidationSchema = yup.object({
  firstName: yup
    .string()
    .required('Имя обязательно.')
    .min(1, 'Имя должно содержать хотя бы 1 символ.'),
  lastName: yup
    .string()
    .required('Фамилия обязательна.')
    .min(1, 'Фамилия должна содержать хотя бы 1 символ.'),
  email: yup
    .string()
    .required('Email обязателен.')
    .email('Введите корректный email.'),
  password: yup
    .string()
    .required('Пароль обязателен.')
    .min(3, 'Пароль должен содержать хотя бы 3 символа.'),
});

export default userValidationSchema;
