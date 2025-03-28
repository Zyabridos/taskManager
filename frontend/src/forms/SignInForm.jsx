'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { TransparentGraySubmitBtn } from '../components/Buttons';
import signUpImage from '../../public/signUp_picture.jpg';
import Image from 'next/image';
import { useAuth } from '../context/authContex';

const SignInForm = () => {
  const router = useRouter();
  const { login, serverError } = useAuth();

  const { t: tAuth } = useTranslation('auth');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(tValidation('invalidEmail')).required(tValidation('emailRequired')),
      password: Yup.string()
        .min(3, tValidation('passwordMin'))
        .required(tValidation('passwordRequired')),
    }),
    onSubmit: async values => {
      console.log('Submitting with:', values);
      await login(values.email, values.password);
    },
  });

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl">
      <form className="flex rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="flex hidden w-1/2 items-center justify-center p-6 md:block">
          <Image
            src={signUpImage}
            alt="Sign in illustration"
            className="h-[300px] w-[300px] rounded-full object-cover"
          />
        </div>

        <div className="w-full p-8 md:w-1/2">
          {['email', 'password'].map(field => (
            <div className="relative mb-6" key={field}>
              <input
                {...formik.getFieldProps(field)}
                id={field}
                type={field === 'password' ? 'password' : 'text'}
                placeholder=" "
                className={`peer h-14 w-[80%] rounded border px-3 pt-5 pb-2 text-sm text-gray-700 shadow focus:ring-2 focus:outline-none ${
                  formik.touched[field] && formik.errors[field]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              <label
                htmlFor={field}
                className="absolute top-2 left-3 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                {tAuth(`form.${field}`)}
              </label>
              {formik.touched[field] && formik.errors[field] && (
                <p className="mt-1 text-xs text-red-500 italic">{formik.errors[field]}</p>
              )}
            </div>
          ))}

          <div className="mt-6">
            <TransparentGraySubmitBtn buttonText={tAuth('form.login')} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
