'use client';

import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { statusesApi } from '../../api/statusesApi';
import CreateFormMixin from './CreateFormMixin';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';
import { handleFormError } from '../../utils/errorsHandlers';

interface FormValues {
  name: string;
}

const CreateStatusPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useEntityToast();
  const { t: tValidation } = useTranslation('validation');

  const handleSubmit = async (values: FormValues) => {
    try {
      await statusesApi.create(values);
      showToast({ type: 'status', action: 'created', titleKey: 'successTitle' });
      router.push(routes.app.statuses.list());
    } catch (e) {
      handleFormError(e, { type: 'status', toast: showToast });
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
      tNamespace="statuses"
      submitText="create"
    />
  );
};

export default CreateStatusPage;
