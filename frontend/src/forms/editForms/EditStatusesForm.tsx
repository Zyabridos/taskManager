'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from './EditFormWrapper';
import { statusesApi } from '../../api/statusesApi';
import FormInput from '../UI/FormInput';
import FloatingLabel from '../UI/FloatingLabel';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';

interface StatusFormValues {
  name: string;
}

const EditStatusForm: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const { showToast } = useEntityToast();
  const { t: tStatuses } = useTranslation('statuses');
  const { t: tValidation } = useTranslation('validation');

  const [initialValues, setInitialValues] = useState<StatusFormValues | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await statusesApi.getById(id);
        setInitialValues({ name: status.name });
      } catch (e) {
        showToast({
          type: 'status',
          action: 'failedUpdate',
          titleKey: 'errorTitle',
          toastType: 'error',
        });
        router.push(routes.app.statuses.list());
      }
    };
    fetchStatus();
  }, [id, router, showToast]);

  const handleSubmit = async (
    values: StatusFormValues,
    _helpers: FormikHelpers<StatusFormValues>
  ) => {
    try {
      await statusesApi.update(id, values);
      showToast({ type: 'status', action: 'updated', titleKey: 'successTitle' });
      router.push(routes.app.statuses.list());
    } catch (e: any) {
      if (e.response?.status === 422) {
        showToast({
          type: 'status',
          action: 'alreadyExists',
          titleKey: 'errorTitle',
          toastType: 'error',
        });
      } else {
        console.error(e);
        showToast({
          type: 'status',
          action: 'failedUpdate',
          titleKey: 'errorTitle',
          toastType: 'error',
        });
      }
    }
  };

  const formik = useFormik<StatusFormValues>({
    enableReinitialize: true,
    initialValues: initialValues || { name: '' },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
    }),
    onSubmit: handleSubmit,
  });

  if (!initialValues) return <p>{tStatuses('loading')}</p>;

  return (
    <EditFormWrapper
      title={tStatuses('form.editTitle')}
      onSubmit={formik.handleSubmit}
      buttonText={tStatuses('form.update')}
    >
      {(Object.keys(initialValues) as (keyof StatusFormValues)[]).map((field) => (
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
            <p className="mt-1 text-xs italic text-red-500">{formik.errors[field] as string}</p>
          )}
        </div>
      ))}
    </EditFormWrapper>
  );
};

export default EditStatusForm;
