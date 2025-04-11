'use client';

import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { usersApi } from '../api/usersApi';
import { TransparentGraySubmitBtn } from '../components/Buttons';
import Image from 'next/image';
import routes from '../routes';
import { useAuth } from '../context/authContex';
import useEntityToast from '../hooks/useEntityToast';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { t: tAuth } = useTranslation('auth');
  const { t: tValidation } = useTranslation('validation');
  const { login } = useAuth();
  const { showToast } = useEntityToast();

  const initialValues: RegisterFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const formik = useFormik<RegisterFormValues>({
    initialValues,
    validationSchema: Yup.object({
      firstName: Yup.string().required(tValidation('firstNameRequired')),
      lastName: Yup.string().required(tValidation('lastNameRequired')),
      email: Yup.string().email(tValidation('invalidEmail')).required(tValidation('emailRequired')),
      password: Yup.string()
        .min(3, tValidation('passwordMin'))
        .required(tValidation('passwordRequired')),
    }),
    onSubmit: async (
      values: RegisterFormValues,
      _helpers: FormikHelpers<RegisterFormValues>
    ) => {
      try {
        await usersApi.create(values);
        await login(values.email, values.password, true);

        showToast({
          type: 'user',
          action: 'registered.success.user',
          titleKey: 'successTitle',
          toastType: 'success',
        });

        router.push(routes.app.home());
      } catch (e: any) {
        const message = e?.response?.data?.message;

        if (message?.includes('already exists')) {
          showToast({
            type: 'user',
            action: 'registered.errors.alreadyInUse',
            titleKey: 'errorTitle',
            toastType: 'error',
          });
        } else {
          showToast({
            type: 'user',
            action: 'failedCreate',
            titleKey: 'errorTitle',
            toastType: 'error',
          });
        }

        console.error('Register error:', e);
      }
    },
  });

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl">
      <form className="flex rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="hidden w-1/2 items-center justify-center p-6 md:flex">
          <Image src="/signUp_picture.jpg" alt="Sign up" width={400} height={300} />
        </div>

        <div className="flex min-h-[500px] flex-col justify-between p-8 md:w-1/2">
          {(Object.keys(initialValues) as (keyof RegisterFormValues)[]).map((field) => (
            <div className="relative mb-6" key={field}>
              <input
                {...formik.getFieldProps(field)}
                id={field}
                type={field === 'password' ? 'password' : 'text'}
                placeholder=" "
                className={`peer h-14 w-full rounded border px-3 pb-2 pt-5 text-sm text-gray-700 shadow focus:outline-none focus:ring-2 ${
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

              <div className="min-h-[20px] overflow-hidden">
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-xs italic text-red-500">{formik.errors[field] as string}</p>
                )}
              </div>
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

export default RegisterForm;
