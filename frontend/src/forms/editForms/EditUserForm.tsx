'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from './EditFormWrapper';
import { usersApi } from '../../api/usersApi';
import FormInput from '../UI/FormInput';
import FloatingLabel from '../UI/FloatingLabel';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';
import { handleFormError } from '../../utils/errorsHandlers';

interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const EditUserForm: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { showToast } = useEntityToast();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await usersApi.getById(id);
        setInitialValues({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: '',
        });
      } catch (e) {
        // eslint-disable-next-line
        if ((e as any)?.response?.status === 403) {
          sessionStorage.setItem('toast_forbidden_edit', 'true');
        }
        handleFormError(e, { type: 'user', toast: showToast, fallbackAction: 'failedUpdate' });
        router.push(routes.app.users.list());
      }
    };

    fetchUser();
  }, [id, router, showToast]);

  const { t: tUsers } = useTranslation('users');
  const { t: tValidation } = useTranslation('validation');

  const [initialValues, setInitialValues] = useState<UserFormValues | null>(null);

  const handleSubmit = async (values: UserFormValues, _helpers: FormikHelpers<UserFormValues>) => {
    try {
      await usersApi.update(id, values);
      showToast({ type: 'user', action: 'updated', titleKey: 'successTitle' });
      router.push(routes.app.users.list());
    } catch (e) {
      handleFormError(e, { type: 'user', toast: showToast, fallbackAction: 'failedUpdate' });
    }
  };

  const formik = useFormik<UserFormValues>({
    enableReinitialize: true,
    initialValues: initialValues ?? {
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
        .required(tValidation('passwordRequiered'))
        .min(3, tValidation('min3Symbols')),
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
      {(Object.keys(initialValues) as (keyof UserFormValues)[]).map(field => (
        <div className="relative mb-6" key={field}>
          <FormInput
            id={field}
            type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
            field={formik.getFieldProps(field)}
            touched={formik.touched[field]}
            error={formik.errors[field]}
            {...{ [`data-${field.toLowerCase()}`]: true }}
          />
          <FloatingLabel htmlFor={field} text={tUsers(`form.${field}`)} />
          {formik.touched[field] && formik.errors[field] && (
            <p className="mt-1 text-xs text-red-500 italic">{formik.errors[field] as string}</p>
          )}
        </div>
      ))}
    </EditFormWrapper>
  );
};

export default EditUserForm;
