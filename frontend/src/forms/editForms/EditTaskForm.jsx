'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EditFormWrapper from './EditFormWrapper';
import FormInput from '../ui/FormInput';
import FloatingLabel from '../ui/FloatingLabel';
import { tasksApi } from '../../api/tasksApi';
import SelectField from '../UI/SelectField';
import MultiSelectField from '../UI/MultiSelectField';
import routes from '../../routes';

const EditTaskPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation(['tasks', 'validation', 'errors']);

  const [initialValues, setInitialValues] = useState(null);
  const [options, setOptions] = useState({
    statuses: [],
    executors: [],
    labels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const task = await tasksApi.getById(id);
        const { statuses, executors, labels } = await tasksApi.getFormOptions();
        setInitialValues({
          name: task.name,
          description: task.description || '',
          statusId: task.statusId || '',
          executorId: task.executorId || '',
          labels: task.labels?.map(label => label.id) || [],
        });
        setOptions({ statuses, executors, labels });
      } catch (e) {
        alert(t('errors:taskNotFound'));
        router.push(routes.app.tasks.list());
      }
    };

    fetchData();
  }, [id, router, t]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      name: '',
      description: '',
      statusId: '',
      executorId: '',
      labels: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('validation:nameRequired')),
    }),
    onSubmit: async values => {
      try {
        await tasksApi.update(id, values);
        router.push(routes.app.tasks.list());
      } catch (e) {
        alert(t('errors:updateTaskFailed'));
      }
    },
  });

  if (!initialValues) return <p>{t('tasks:loading')}</p>;

  return (
    <EditFormWrapper
      title={t('tasks:form.editTitle')}
      onSubmit={formik.handleSubmit}
      buttonText={t('tasks:form.update')}
    >
      <div className="relative mb-6">
        <FormInput
          id="name"
          type="text"
          field={formik.getFieldProps('name')}
          touched={formik.touched.name}
          error={formik.errors.name}
        />
        <FloatingLabel htmlFor="name" text={t('tasks:form.name')} />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="mb-1 block text-sm text-gray-600">
          {t('tasks:form.description')}
        </label>
        <textarea
          id="description"
          {...formik.getFieldProps('description')}
          rows="3"
          className="w-full rounded border border-gray-300 p-2 text-sm text-gray-700 shadow focus:ring-2 focus:outline-none"
        />
      </div>

      <SelectField
        id="statusId"
        label={t('tasks:form.status')}
        options={options.statuses}
        value={formik.values.statusId}
        onChange={formik.handleChange}
        error={formik.touched.statusId && formik.errors.statusId}
      />

      <SelectField
        id="executorId"
        label={t('tasks:form.executor')}
        options={options.executors}
        value={formik.values.executorId}
        onChange={formik.handleChange}
        error={formik.touched.executorId && formik.errors.executorId}
      />

      <MultiSelectField
        id="labels"
        label={t('tasks:form.labels')}
        options={options.labels}
        value={formik.values.labels}
        onChange={formik.handleChange}
        error={formik.touched.labels && formik.errors.labels}
      />
    </EditFormWrapper>
  );
};

export default EditTaskPage;
