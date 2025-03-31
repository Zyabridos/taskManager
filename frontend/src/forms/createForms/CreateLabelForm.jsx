'use client';

import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { labelsApi } from '../../api/labelsApi';
import CreateFormMixin from './CreateFormMixin';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';

const CreateLabelPage = () => {
  const router = useRouter();
  const { showSuccess, showError } = useEntityToast();
  const { t: tValidation } = useTranslation('validation');

  const handleSubmit = async values => {
    try {
      await labelsApi.create(values);
      showSuccess('label', 'created', 'successTitle');
      router.push(routes.app.labels.list());
    } catch (e) {
      showError('label', 'failedCreate', 'errorTitle');
      console.error(e);
    }
  };

  return (
    <CreateFormMixin
      initialValues={{ name: '' }}
      validationSchema={Yup.object({
        name: Yup.string()
          .required(tValidation('nameRequired'))
          .min(1, tValidation('min1Symbol')),
      })}
      onSubmit={handleSubmit}
      fields={['name']}
      tNamespace="labels"
      submitText="create"
    />
  );
};

export default CreateLabelPage;
