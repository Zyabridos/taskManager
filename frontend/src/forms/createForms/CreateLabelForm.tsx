'use client';

import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { labelsApi } from '../../api/labelsApi';
import CreateFormMixin from './CreateFormMixin';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';
import { handleFormError } from '../../utils/errorsHandlers';

interface FormValues {
  name: string;
}

const CreateLabelPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useEntityToast();
  const { t: tValidation } = useTranslation('validation');

  const handleSubmit = async (values: FormValues) => {
    try {
      await labelsApi.create(values);
      showToast({ type: 'label', action: 'created', titleKey: 'successTitle' });
      router.push(routes.app.labels.list());
    } catch (e) {
      handleFormError(e, { type: 'label', toast: showToast });
    }
  };

  return (
    <CreateFormMixin<FormValues>
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
