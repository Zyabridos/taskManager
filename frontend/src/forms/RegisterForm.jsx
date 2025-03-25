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
      email: Yup.string().email('Неверный email').required('Email обязателен'),
      password: Yup.string().min(3, 'Минимум 3 символа').required('Пароль обязателен'),
    }),
    onSubmit: async values => {
      try {
        await createUser(values);
        router.push('/users');
      } catch (e) {
        alert('Ошибка при создании пользователя');
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form
        className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md"
        onSubmit={formik.handleSubmit}
      >
        {['firstName', 'lastName', 'email', 'password'].map(field => (
          <div className="mb-4" key={field}>
            <label
              htmlFor={field}
              className="mb-2 block text-sm font-bold text-gray-700 capitalize"
            >
              {field === 'firstName'
                ? 'Имя'
                : field === 'lastName'
                ? 'Фамилия'
                : field === 'email'
                ? 'Email'
                : 'Пароль'}
            </label>
            <input
              {...formik.getFieldProps(field)}
              id={field}
              type={field === 'password' ? 'password' : 'text'}
              className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                formik.touched[field] && formik.errors[field] ? 'border-red-500' : ''
              }`}
              placeholder={
                field === 'firstName'
                  ? 'Имя'
                  : field === 'lastName'
                  ? 'Фамилия'
                  : field === 'email'
                  ? 'Email'
                  : 'Пароль'
              }
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="text-xs italic text-red-500 mt-1">{formik.errors[field]}</p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
