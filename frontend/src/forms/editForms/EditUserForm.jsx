'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from './EditFormWrapper';
import { usersApi } from '../../api/usersApi';
import FormInput from '../ui/FormInput';
import FloatingLabel from '../ui/FloatingLabel';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';

const EditUserForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useEntityToast();
  const { t: tUsers } = useTranslation('users');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await usersApi.getById(id);
        setInitialValues({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      } catch {
        showError('user', 'failedUpdate');
        router.push(routes.app.users.list());
      }
    };
    fetchUser();
  }, [id, router, showError]);

  const handleSubmit = async values => {
    try {
      await usersApi.update(id, values);
      showToast({ type: 'user', action: 'updated', titleKey: 'successTitle' });
      router.push(routes.app.users.list());
    } catch (e) {
      showToast({ type: 'user', action: 'failedUpdate', titleKey: 'errorTitle', type: 'error' });
      console.error(e);
    }
  };

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
    onSubmit: handleSubmit,
  });

  if (!initialValues) return <p>{tUsers('loading')}</p>;

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

export default EditUserForm;
