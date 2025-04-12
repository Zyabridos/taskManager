'use client';

import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, FormikHelpers } from 'formik';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { tasksApi } from '../../api/tasksApi';
import SelectField from '../UI/SelectField';
import MultiSelectField from '../UI/MultiSelectField';
import { TransparentGraySubmitBtn } from '../../components/Buttons';
import useEntityToast from '@/hooks/useEntityToast';
import { handleFormError } from '../../utils/errorsHandlers';

interface Option {
  id: number;
  name: string;
}

interface Task {
  name: string;
  description: string;
  statusId: number;
  executorId: number | null;
  labels: Option[];
}

interface MetaData {
  statuses: Option[];
  executors: Option[];
  labels: Option[];
}

interface TaskFormValues {
  name: string;
  description: string;
  statusId: number | string;
  executorId: number | string;
  labels: number[];
}

const EditTaskForm: React.FC = () => {
  const params = useParams();
  const taskId = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const router = useRouter();
  const { t: tTasks } = useTranslation('tasks');
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');
  const { showToast } = useEntityToast();

  const [task, setTask] = useState<Task | null>(null);
  const [meta, setMeta] = useState<MetaData>({
    statuses: [],
    executors: [],
    labels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskData, metaData] = await Promise.all([
          tasksApi.getById(taskId),
          tasksApi.getMeta(),
        ]);
        setTask(taskData);
        setMeta(metaData);
      } catch (e) {
        handleFormError(e, { type: 'task', toast: showToast, fallbackAction: 'failedUpdate' });
      }
    };
    fetchData();
  }, [taskId, tErrors, showToast]);

  const formik = useFormik<TaskFormValues>({
    enableReinitialize: true,
    initialValues: task
      ? {
          name: task.name,
          description: task.description || '',
          statusId: task.statusId,
          executorId: task.executorId ?? '',
          labels: task.labels?.map(label => label.id) || [],
        }
      : {
          name: '',
          description: '',
          statusId: '',
          executorId: '',
          labels: [],
        },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')),
      description: Yup.string(),
      statusId: Yup.number().required(tValidation('statusRequired')),
      executorId: Yup.number().nullable(),
      labels: Yup.array().of(Yup.number()),
    }),
    onSubmit: async (values: TaskFormValues, _helpers: FormikHelpers<TaskFormValues>) => {
      try {
        const preparedValues = {
          ...values,
          statusId: Number(values.statusId),
          executorId: values.executorId ? Number(values.executorId) : null,
          labels: values.labels.map(Number),
        };

        await tasksApi.update(taskId, preparedValues);
        showToast({ type: 'task', action: 'updated', titleKey: 'successTitle' });
        router.push(routes.app.tasks.list());
      } catch (e) {
        handleFormError(e, { type: 'task', toast: showToast, fallbackAction: 'failedUpdate' });
      }
    },
  });

  if (!task) {
    return <p className="text-center text-gray-500">{tTasks('loading')}</p>;
  }

  return (
    <div className="mx-auto mt-8 w-[90%]">
      <form className="flex rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 p-8 md:w-full">
          {/* Name */}
          <div className="relative mb-6">
            <input
              {...formik.getFieldProps('name')}
              id="name"
              type="text"
              placeholder=" "
              className={`peer h-14 w-full rounded border px-3 pt-5 pb-2 text-sm text-gray-700 shadow focus:ring-2 focus:outline-none ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <label
              htmlFor="name"
              className="absolute top-2 left-3 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              {tTasks('form.name')}
            </label>
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-500 italic">{formik.errors.name}</p>
            )}
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
            <TransparentGraySubmitBtn buttonText={tTasks('form.edit')} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
