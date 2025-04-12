'use client';

import React from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import SelectField from '../forms/UI/SelectField';
import { TransparentGraySubmitBtn } from './Buttons';

interface Option {
  id: number;
  name: string;
}

interface TaskFilterProps {
  statuses: Option[];
  executors: Option[];
  labels: Option[];
  onFilter: (values: TaskFilterValues) => void;
  initialValues?: TaskFilterValues;
}

interface TaskFilterValues {
  status: string;
  executor: string;
  label: string;
  isCreatorUser: boolean;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  statuses,
  executors,
  labels,
  onFilter,
  initialValues,
}) => {
  const { t: tTasks } = useTranslation('tasks');

  const formik = useFormik<TaskFilterValues>({
    initialValues: {
      status: '',
      executor: '',
      label: '',
      isCreatorUser: false,
      ...initialValues,
    },
    enableReinitialize: true, // follow changes in initialValues
    onSubmit: (values: TaskFilterValues) => {
      onFilter(values);
    },
  });

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 md:flex-row">
          <SelectField
            id="status"
            label={tTasks('form.status')}
            options={statuses}
            field={formik.getFieldProps('status')}
            error={formik.errors.status}
            touched={formik.touched.status}
          />

          <SelectField
            id="executor"
            label={tTasks('form.executor')}
            options={executors}
            field={formik.getFieldProps('executor')}
            error={formik.errors.executor}
            touched={formik.touched.executor}
          />

          <SelectField
            id="label"
            label={tTasks('form.labels')}
            options={labels}
            field={formik.getFieldProps('label')}
            error={formik.errors.label}
            touched={formik.touched.label}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="isCreatorUser"
            name="isCreatorUser"
            checked={formik.values.isCreatorUser}
            onChange={formik.handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isCreatorUser" className="text-sm text-gray-700">
            {tTasks('filter.onlyMyTasks')}
          </label>
        </div>

        <div className="mt-6">
          <TransparentGraySubmitBtn buttonText={tTasks('filter.show')} />
        </div>
      </form>
    </div>
  );
};

export default TaskFilter;
