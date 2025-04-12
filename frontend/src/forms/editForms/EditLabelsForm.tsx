'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from './EditFormWrapper';
import { labelsApi } from '../../api/labelsApi';
import FormInput from '../UI/FormInput';
import FloatingLabel from '../UI/FloatingLabel';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';
import { handleFormError } from '../../utils/errorsHandlers';

interface LabelFormValues {
  name: string;
}

const EditLabelForm: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const { showToast } = useEntityToast();
  const { t: tLabels } = useTranslation('labels');
  const { t: tValidation } = useTranslation('validation');

  const [initialValues, setInitialValues] = useState<LabelFormValues | null>(null);

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        const label = await labelsApi.getById(id);
        setInitialValues({ name: label.name });
      } catch (e) {
        console.error(e);
        showToast({
          type: 'label',
          action: 'failedUpdate',
          titleKey: 'errorTitle',
          toastType: 'error',
        });
        router.push(routes.app.labels.list());
      }
    };

    fetchLabel();
  }, [id, router, showToast]);

  const handleSubmit = async (
    values: LabelFormValues,
    _helpers: FormikHelpers<LabelFormValues>,
  ) => {
    try {
      await labelsApi.update(id, values);
      showToast({ type: 'label', action: 'updated', titleKey: 'successTitle' });
      router.push(routes.app.labels.list());
    } catch (e) {
      handleFormError(e, { type: 'label', toast: showToast, fallbackAction: 'failedUpdate' });
    }
  };

  const formik = useFormik<LabelFormValues>({
    enableReinitialize: true,
    initialValues: initialValues || { name: '' },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
    }),
    onSubmit: handleSubmit,
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
          <p className="mt-1 text-xs text-red-500 italic">{formik.errors.name}</p>
        )}
      </div>
    </EditFormWrapper>
  );
};

export default EditLabelForm;
