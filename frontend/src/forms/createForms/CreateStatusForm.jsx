'use client';

import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { statusesApi } from '../../api/statusesApi';
import CreateFormMixin from './CreateFormMixin';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';

const CreateStatusPage = () => {
  const router = useRouter();
  const { showSuccess, showError } = useEntityToast();
  const { t: tValidation } = useTranslation('validation');

  const handleSubmit = async values => {
    try {
      await statusesApi.create(values);
      showSuccess('status', 'created', 'successTitle');
      router.push(routes.app.statuses.list());
    } catch (e) {
      showError('status', 'failedCreate', 'errorTitle');
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
      tNamespace="statuses"
      submitText="create"
    />
  );
};

export default CreateStatusPage;
