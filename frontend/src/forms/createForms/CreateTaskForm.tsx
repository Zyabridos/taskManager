'use client';

import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { tasksApi } from '../../api/tasksApi';
import SelectField from '../UI/SelectField';
import MultiSelectField from '../UI/MultiSelectField';
import { TransparentGraySubmitBtn } from '../../components/Buttons';
import useEntityToast from '../../hooks/useEntityToast';

interface Option {
  id: number;
  name: string;
}

interface MetaData {
  statuses: Option[];
  executors: Option[];
  labels: Option[];
}

interface FormValues {
  name: string;
  description: string;
  statusId: string;
  executorId: string;
  labels: number[];
}

const CreateTaskPage: React.FC = () => {
  const router = useRouter();
  const { t: tTasks } = useTranslation('tasks');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');
  const { showToast } = useEntityToast();

  const [meta, setMeta] = useState<MetaData>({
    statuses: [],
    executors: [],
    labels: [],
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const data = await tasksApi.getMeta();
        setMeta(data);
      } catch (e) {
        console.error(e);
        alert(tErrors('loadMetaFailed'));
      }
    };
    fetchMeta();
  }, [tErrors]);

  const initialValues: FormValues = {
    name: '',
    description: '',
    statusId: '',
    executorId: '',
    labels: [],
  };

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
      description: Yup.string(),
      statusId: Yup.number().required(tValidation('statusRequired')),
      executorId: Yup.number().nullable(),
      labels: Yup.array().of(Yup.number()),
    }),
    onSubmit: async (values, _formikHelpers: FormikHelpers<FormValues>) => {
      try {
        const preparedValues = {
          ...values,
          statusId: Number(values.statusId),
          executorId: values.executorId ? Number(values.executorId) : null,
          labels: values.labels.map(Number),
        };

        await tasksApi.create(preparedValues);
        showToast({ type: 'task', action: 'created', titleKey: 'successTitle' });
        router.push(routes.app.tasks.list());
      } catch (e: any) {
        if (e.response?.status === 422) {
          showToast({
            type: 'label',
            action: 'alreadyExists',
            titleKey: 'errorTitle',
            toastType: 'error',
          });
        } else {
          console.error('Submit error:', e);
          showToast({
            type: 'task',
            action: 'failedDelete',
            titleKey: 'errorTitle',
            toastType: 'error',
          });
        }
      }
    },
  });

  return (
    <div className="flex">
      <form className="w-[90%] w-full rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 p-6">
          {/* Name */}
          <div className="relative mb-2">
            <input
              {...formik.getFieldProps('name')}
              id="name"
              type="text"
              placeholder=" "
              className={`peer h-14 w-full rounded border px-3 pb-2 pt-5 text-sm text-gray-700 shadow focus:outline-none focus:ring-2 ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <label htmlFor="name" className="floating-label">
              {tTasks('form.name')}
            </label>
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs italic text-red-500">{formik.errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="relative mb-2">
            <textarea
              {...formik.getFieldProps('description')}
              id="description"
              placeholder=" "
              rows={4}
              className="peer h-32 w-full resize-y rounded border border-gray-300 px-3 pb-2 pt-5 text-sm text-gray-700 shadow focus:outline-none focus:ring-2"
            />
            <label htmlFor="description" className="floating-label">
              {tTasks('form.description')}
            </label>
          </div>

          {/* Status */}
          <SelectField
            id="statusId"
            label={tTasks('form.status')}
            options={meta.statuses}
            field={formik.getFieldProps('statusId')}
            touched={formik.touched.statusId}
            error={formik.errors.statusId}
          />

          {/* Executor */}
          <SelectField
            id="executorId"
            label={tTasks('form.executor')}
            options={meta.executors}
            field={formik.getFieldProps('executorId')}
            touched={formik.touched.executorId}
            error={formik.errors.executorId}
          />

          {/* Labels */}
          <MultiSelectField
            id="labels"
            label={tTasks('form.labels')}
            options={meta.labels}
            value={formik.values.labels}
            onChange={(selected: number[]) => formik.setFieldValue('labels', selected)}
            error={typeof formik.errors.labels === 'string' ? formik.errors.labels : undefined}
            touched={formik.touched.labels}
          />

          <div className="mt-[-20px] self-start">
            <TransparentGraySubmitBtn buttonText={tTasks('form.create')} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskPage;
