'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from '../components/EditFormWrapper';
import { getUser, updateUser } from '../api/usersApi';
import FormInput from './ui/FormInput';
import FloatingLabel from './ui/FloatingLabel';
import routes from '../routes';

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
        router.push(routes.app.users.list());
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
        router.push(routes.app.users.list());
      } catch (e) {
        alert(tErrors('updateUserFailed'));
      }
    },
  });

  if (!initialValues) {
    return <p>{tUsers('loading')}</p>;
  }

  return (
    <EditFormWrapper
      title={tUsers('form.editTitle')}
      onSubmit={formik.handleSubmit}
      buttonText={tUsers('form.update')}
    >
      {['firstName', 'lastName', 'email'].map(field => (
        <div className="relative mb-6" key={field}>
          <FormInput
            id={field}
            type={field === 'email' ? 'email' : 'text'}
            field={formik.getFieldProps(field)}
            touched={formik.touched[field]}
            error={formik.errors[field]}
          />
          <FloatingLabel htmlFor={field} text={tUsers(`form.${field}`)} />
          {formik.touched[field] && formik.errors[field] && (
            <p className="mt-1 text-xs text-red-500 italic">{formik.errors[field]}</p>
          )}
        </div>
      ))}
    </EditFormWrapper>
  );
};

export default EditUserPage;
