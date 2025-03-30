'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { createStatus } from '../api/statusesApi';
import { TransparentGraySubmitBtn } from '../components/Buttons';
import routes from '../routes';

const CreateStatusForm = () => {
  const router = useRouter();
  const { t: tValidation } = useTranslation('validation');
  const { t: tErrors } = useTranslation('errors');
  const { t: tStatuses } = useTranslation('statuses');

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation('nameRequired')).min(3, tValidation('min1Symbol')),
    }),
    onSubmit: async values => {
      try {
        await createStatus(values);
        router.push(routes.app.statuses.list());
      } catch (e) {
        alert(tErrors('createStatusFailed'));
      }
    },
  });

  return (
    <div className="mx-auto mt-8 w-[90%]">
      <form className="flex rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 p-8 md:w-full">
          {['name'].map(field => (
            <div className="relative mb-6" key={field}>
              <input
                {...formik.getFieldProps(field)}
                id={field}
                type="text"
                placeholder=" "
                className={`peer h-14 w-full rounded border px-3 pt-5 pb-2 text-sm text-gray-700 shadow focus:ring-2 focus:outline-none ${
                  formik.touched[field] && formik.errors[field]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              <label
                htmlFor={field}
                className="absolute top-2 left-3 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                {tStatuses(`form.${field}`)}
              </label>

              <div className="min-h-[20px] overflow-hidden">
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-xs text-red-500 italic">{formik.errors[field]}</p>
                )}
              </div>
            </div>
          ))}
          <div className="mt-[-30px]">
            <TransparentGraySubmitBtn
              className="w-auto self-start"
              buttonText={tStatuses('form.create')}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateStatusForm;
