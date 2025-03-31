'use client';

import React from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { TransparentGraySubmitBtn } from '../../components/Buttons';
import withAuth from '../../components/Protected/withAuth';

const CreateFormMixin = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  tNamespace,
  submitText,
}) => {
  const { t: tNamespaceT } = useTranslation(tNamespace);
  const { t: tValidation } = useTranslation('validation');

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="mx-auto mt-8 w-[90%]">
      <form className="flex rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 p-8 md:w-full">
          {fields.map(field => (
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
                {tNamespaceT(`form.${field}`)}
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
              buttonText={tNamespaceT(`form.${submitText}`)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreateFormMixin);
