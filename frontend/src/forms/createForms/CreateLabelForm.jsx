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
  const { showToast } = useEntityToast();
  const { t: tValidation } = useTranslation('validation');

  const handleSubmit = async values => {
    try {
      await labelsApi.create(values);
      showToast({ type: 'label', action: 'created', titleKey: 'successTitle' });
      router.push(routes.app.labels.list());
    } catch (e) {
      showToast({ type: 'label', action: 'failedDelete', titleKey: 'errorTitle', type: 'error' });
      console.error(e);
    }
  };

  return (
    <CreateFormMixin
      initialValues={{ name: '' }}
      validationSchema={Yup.object({
        name: Yup.string().required(tValidation('nameRequired')).min(1, tValidation('min1Symbol')),
      })}
      onSubmit={handleSubmit}
      fields={['name']}
      tNamespace="labels"
      submitText="create"
    />
  );
};

export default CreateLabelPage;
