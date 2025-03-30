'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from '../components/EditFormWrapper';
import { getStatus, updateStatus } from '../api/statusesApi';
import FormInput from './ui/FormInput';
import FloatingLabel from './ui/FloatingLabel';
import routes from '../routes';

const EditUserPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t: tStatuses } = useTranslation('statuses');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getStatus(id);
        setInitialValues({
          name: status.name,
        });
      } catch {
        alert(tErrors('statusNotFound'));
        router.push(routes.app.statuses.list());
      }
    };
    fetchStatus();
  }, [id, router, tErrors]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
    }),
    onSubmit: async values => {
      try {
        await updateStatus(id, values);
        router.push(routes.app.statuses.list());
      } catch (e) {
        console.log(e)
        alert(tErrors('updateStatusFailed'));
      }
    },
  });

  if (!initialValues) {
    return <p>{tStatuses('loading')}</p>;
  }

  return (
    <EditFormWrapper
      title={tStatuses('form.editTitle')}
      onSubmit={formik.handleSubmit}
      buttonText={tStatuses('form.update')}
    >
      {['name'].map(field => (
        <div className="relative mb-6" key={field}>
          <FormInput
            id={field}
            type={'text'}
            field={formik.getFieldProps(field)}
            touched={formik.touched[field]}
            error={formik.errors[field]}
          />
          <FloatingLabel htmlFor={field} text={tStatuses(`form.${field}`)} />
          {formik.touched[field] && formik.errors[field] && (
            <p className="mt-1 text-xs italic text-red-500">{formik.errors[field]}</p>
          )}
        </div>
      ))}
    </EditFormWrapper>
  );
};

export default EditUserPage;
