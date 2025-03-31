'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from './EditFormWrapper';
import { labelsApi } from '../../api/labelsApi';
import FormInput from '../ui/FormInput';
import FloatingLabel from '../ui/FloatingLabel';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';

const EditLabelForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showUpdated, showError } = useEntityToast();
  const { t: tLabels } = useTranslation('labels');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        const label = await labelsApi.getById(id);
        setInitialValues({ name: label.name });
      } catch (e) {
        console.error(e);
        showError('label', 'failedUpdate');
        router.push(routes.app.labels.list());
      }
    };

    fetchLabel();
  }, [id, router, showError]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || { name: '' },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
    }),
    onSubmit: async values => {
      try {
        await labelsApi.update(id, values);
        showUpdated('label');
        router.push(routes.app.labels.list());
      } catch (e) {
        console.error(e);
        showError('label', 'failedUpdate');
      }
    },
  });

  if (!initialValues) {
    return <p>{tLabels('loading')}</p>;
  }

  return (
    <EditFormWrapper
      title={tLabels('form.editTitle')}
      onSubmit={formik.handleSubmit}
      buttonText={tLabels('form.update')}
    >
      <div className="relative mb-6">
        <FormInput
          id="name"
          type="text"
          field={formik.getFieldProps('name')}
          touched={formik.touched.name}
          error={formik.errors.name}
        />
        <FloatingLabel htmlFor="name" text={tLabels('form.name')} />
        {formik.touched.name && formik.errors.name && (
          <p className="mt-1 text-xs italic text-red-500">{formik.errors.name}</p>
        )}
      </div>
    </EditFormWrapper>
  );
};

export default EditLabelForm;
