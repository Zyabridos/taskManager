import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { statusesApi } from '../../api/statusesApi';
import CreateFormMixin from './CreateFormMixin';
import routes from '../../routes';

const CreateStatusPage = () => {
  const router = useRouter();
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const handleSubmit = async (values) => {
    try {
      await statusesApi.create(values);
      router.push(routes.app.statuses.list());
    } catch (e) {
      alert(tErrors('createStatusFailed'));
    }
  };

  return (
    <CreateFormMixin
      initialValues={{ name: '' }}
      validationSchema={Yup.object({
        name: Yup.string().required(tValidation('nameRequired')).min(3, tValidation('min1Symbol')),
      })}
      onSubmit={handleSubmit}
      fields={['name']}
      tNamespace="statuses"
      submitText="create"
    />
  );
};

export default CreateStatusPage;
