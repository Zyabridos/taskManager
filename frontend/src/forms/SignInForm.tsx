'use client';

import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { TransparentGraySubmitBtn } from '../components/Buttons';
import Image from 'next/image';
import { useAuth } from '../context/authContex';

interface SignInFormValues {
  email: string;
  password: string;
}

const SignInForm: React.FC = () => {
  const { login, serverError } = useAuth();
  const { t: tAuth } = useTranslation('auth');
  const { t: tValidation } = useTranslation('validation');

  const initialValues: SignInFormValues = {
    email: '',
    password: '',
  };

  const formik = useFormik<SignInFormValues>({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email(tValidation('invalidEmail'))
        .required(tValidation('emailRequired')),
      password: Yup.string()
        .min(3, tValidation('passwordMin'))
        .required(tValidation('passwordRequired')),
    }),
    onSubmit: async (values: SignInFormValues, _helpers: FormikHelpers<SignInFormValues>) => {
      console.log('Submitting with:', values);
      await login(values.email, values.password);
    },
  });

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl">
      <form className="flex rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="flex hidden w-1/2 items-center justify-center p-6 md:block">
          <Image src="/signUp_picture.jpg" alt="Sign up" width={400} height={300} />
        </div>

        <div className="w-full p-8 md:w-1/2">
          {(Object.keys(initialValues) as (keyof SignInFormValues)[]).map((field) => (
            <div className="relative mb-6" key={field}>
              <input
                {...formik.getFieldProps(field)}
                id={field}
                type={field === 'password' ? 'password' : 'text'}
                placeholder=" "
                className={`peer h-14 w-[80%] rounded border px-3 pb-2 pt-5 text-sm text-gray-700 shadow focus:outline-none focus:ring-2 ${
                  formik.touched[field] && formik.errors[field]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              <label
                htmlFor={field}
                className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                {tAuth(`form.${field}`)}
              </label>
              {formik.touched[field] && formik.errors[field] && (
                <p className="mt-1 text-xs italic text-red-500">
                  {formik.errors[field] as string}
                </p>
              )}
            </div>
          ))}

          <div className="mt-6">
            <TransparentGraySubmitBtn buttonText={tAuth('form.loginButton')} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
