import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { labelsApi } from '../../api/labelsApi';
import CreateFormMixin from './CreateFormMixin';
import routes from '../../routes';

const CreateLabelPage = () => {
  const router = useRouter();
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const handleSubmit = async values => {
    try {
      await labelsApi.create(values);
      router.push(routes.app.labels.list());
    } catch (e) {
      console.log('error', e);
      alert(tErrors('createLabelFailed'));
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
      tNamespace="lables"
      submitText="create"
    />
  );
};

export default CreateLabelPage;
