'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from './EditFormWrapper';
import { statusesApi } from '../../api/statusesApi';
import FormInput from '../ui/FormInput';
import FloatingLabel from '../ui/FloatingLabel';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';

const EditStatusForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showUpdated, showError } = useEntityToast();
  const { t: tStatuses } = useTranslation('statuses');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await statusesApi.getById(id);
        setInitialValues({ name: status.name });
      } catch {
        showError('status', 'failedUpdate');
        router.push(routes.app.statuses.list());
      }
    };
    fetchStatus();
  }, [id, router, showError]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || { name: '' },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
    }),
    onSubmit: async values => {
      try {
        await statusesApi.update(id, values);
        showUpdated('status');
        router.push(routes.app.statuses.list());
      } catch (e) {
        console.error(e);
        showError('status', 'failedUpdate');
      }
    },
  });

  if (!initialValues) return <p>{tStatuses('loading')}</p>;

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
            type="text"
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

export default EditStatusForm;
