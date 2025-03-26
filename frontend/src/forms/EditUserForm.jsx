'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from '../components/EditFormWrapper';
import { getUser, updateUser } from '../api/usersApi';

const EditUserPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t: tUsers } = useTranslation('users');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(id);
        setInitialValues({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      } catch {
        alert(tErrors('userNotFound'));
        router.push('/users');
      }
    };
    fetchUser();
  }, [id, router, tErrors]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      firstName: '',
      lastName: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(tValidation('firstNameRequired')),
      lastName: Yup.string().required(tValidation('lastNameRequired')),
      email: Yup.string().email(tValidation('invalidEmail')).required(tValidation('emailRequired')),
    }),
    onSubmit: async values => {
      try {
        await updateUser(id, values);
        router.push('/users');
      } catch (e) {
        alert(tErrors('updateUserFailed'));
      }
    },
  });

  if (!initialValues) {
    return <p>{tUsers('loading')}</p>; // если есть строка loading, или просто текст
  }

  return (
    <EditFormWrapper
      title={tUsers('form.editTitle')}
      onSubmit={formik.handleSubmit}
      buttonText={tUsers('form.update')}
    >
      {['firstName', 'lastName', 'email'].map(field => (
        <div className="relative mb-6" key={field}>
          <input
            id={field}
            type="text"
            placeholder=" "
            {...formik.getFieldProps(field)}
            className={`peer h-14 w-full appearance-none rounded border px-3 pt-5 pb-2 text-sm text-gray-700 shadow focus:ring-2 focus:outline-none ${
              formik.touched[field] && formik.errors[field] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <label
            htmlFor={field}
            className="absolute top-2 left-3 z-10 origin-[0] scale-100 transform text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-blue-500"
          >
            {tUsers(`form.${field}`)}
          </label>
          {formik.touched[field] && formik.errors[field] && (
            <p className="mt-1 text-xs text-red-500 italic">{formik.errors[field]}</p>
          )}
        </div>
      ))}
    </EditFormWrapper>
  );
};

export default EditUserPage;
