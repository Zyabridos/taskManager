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
      router.push(`${routes.app.labels.list()}?created=label`);
    } catch (e) {
      console.log('error', e);
      router.push(`${routes.app.labels.list()}?failedDelete=label`);
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
      tNamespace="lables"
      submitText="create"
    />
  );
};

export default CreateLabelPage;
