'use client';

import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { TransparentGraySubmitBtn } from '../../components/Buttons';

interface CreateFormMixinProps<T> {
  initialValues: T;
  // eslint-disable-next-line
  validationSchema: any;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<void>;
  fields: (keyof T)[];
  tNamespace: string;
  submitText: string;
}

// eslint-disable-next-line
const CreateFormMixin = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  tNamespace,
  submitText,
}: CreateFormMixinProps<T>) => {
  const { t: tNamespaceT } = useTranslation(tNamespace);

  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="mx-auto mt-4 w-[100%]">
      <form className="flex rounded bg-white shadow-md" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 p-8 md:w-full">
          {fields.map(field => (
            <div className="relative mb-6" key={String(field)}>
              <input
                {...formik.getFieldProps(field as string)}
                id={String(field)}
                type="text"
                placeholder=" "
                className={`peer h-14 w-full rounded border px-3 pt-5 pb-2 text-sm text-gray-700 shadow focus:ring-2 focus:outline-none ${
                  formik.touched[field] && formik.errors[field]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              <label
                htmlFor={String(field)}
                className="absolute top-2 left-3 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                {tNamespaceT(`form.${field as string}`)}
              </label>

              <div className="min-h-[20px] overflow-hidden">
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-xs text-red-500 italic">{formik.errors[field] as string}</p>
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

export default CreateFormMixin;
