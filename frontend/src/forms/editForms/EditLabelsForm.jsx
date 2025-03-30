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

const EditUserPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t: tLables } = useTranslation('labels');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        const label = await labelsApi.getById(id);
        setInitialValues({
          name: label.name,
        });
      } catch {
        alert(tErrors('labelNotFound'));
        router.push(routes.app.labels.list());
      }
    };
    fetchLabel();
  }, [id, router, tErrors]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
    }),
    onSubmit: async values => {
      try {
        await labelsApi.update(id, values);
        router.push(routes.app.labels.list());
      } catch (e) {
        console.log(e);
        alert(tErrors('updateLabelFailed'));
      }
    },
  });

  if (!initialValues) {
    return <p>{tLables('loading')}</p>;
  }

  return (
    <EditFormWrapper
      title={tLables('form.editTitle')}
      onSubmit={formik.handleSubmit}
      buttonText={tLables('form.update')}
    >
      {['name'].map(field => (
        <div className="relative mb-6" key={field}>
          <FormInput
            id={field}
            type={'text'}
            field={formik.getFieldProps(field)}
            touched={formik.touched[field]}
            error={formik.errors[field]}
          />
          <FloatingLabel htmlFor={field} text={tLables(`form.${field}`)} />
          {formik.touched[field] && formik.errors[field] && (
            <p className="mt-1 text-xs text-red-500 italic">{formik.errors[field]}</p>
          )}
        </div>
      ))}
    </EditFormWrapper>
  );
};

export default EditUserPage;
