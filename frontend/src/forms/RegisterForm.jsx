'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createUser } from '../api/usersApi';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Имя обязательно'),
      lastName: Yup.string().required('Фамилия обязательна'),
      email: Yup.string().email('Неверный email').required(),
      password: Yup.string().min(3, 'Минимум 3 символа').required(),
    }),
    onSubmit: async (values) => {
      try {
        await createUser(values);
        router.push('/users');
      } catch (e) {
        alert('Ошибка при создании пользователя');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input {...formik.getFieldProps('firstName')} placeholder="Имя" />
      <input {...formik.getFieldProps('lastName')} placeholder="Фамилия" />
      <input {...formik.getFieldProps('email')} type="email" placeholder="Email" />
      <input {...formik.getFieldProps('password')} type="password" placeholder="Пароль" />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default RegisterForm;
