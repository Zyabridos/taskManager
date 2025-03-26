'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { createUser } from '../api/usersApi';

const RegisterForm = () => {
  const router = useRouter();
  const { t: tAuth } = useTranslation('auth');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(tValidation('firstNameRequired')),
      lastName: Yup.string().required(tValidation('lastNameRequired')),
      email: Yup.string().email(tValidation('invalidEmail')).required(tValidation('emailRequired')),
      password: Yup.string()
        .min(3, tValidation('passwordMin'))
        .required(tValidation('passwordRequired')),
    }),
    onSubmit: async values => {
      try {
        await createUser(values);
        router.push('/users');
      } catch (e) {
        alert(tErrors('createUserFailed'));
      }
    },
  });

  return (
    <div className="mx-auto mt-8 w-full max-w-md">
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
              {tAuth(`form.${field}`)}
            </label>
            <input
              {...formik.getFieldProps(field)}
              id={field}
              type={field === 'password' ? 'password' : 'text'}
              className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                formik.touched[field] && formik.errors[field] ? 'border-red-500' : ''
              }`}
              placeholder={tAuth(`form.${field}`)}
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="mt-1 text-xs text-red-500 italic">{formik.errors[field]}</p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            {tAuth('form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
