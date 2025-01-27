import { LoginPicture } from '../Attachments/Attachments';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import { withZodSchema } from 'formik-validator-zod';
import { z } from 'zod';

const SignupForm = () => {
  const { t } = useTranslation();

  // Функция отправки данных на сервер
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log('Отправляемые данные:', values);
    try {
      // const response = await axios.post('/api/users', {
      const response = await axios.post('/users', {
        data: values,
      });

      alert(t('Yay'));
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      if (error.response && error.response.data) {
        setErrors(error.response.data.details || {});
      } else {
        alert(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const RegisterFormSchema = z.object({
    firstName: z
      .string()
      // .required("It is a requiered field")
      .min(1, 'Should be at least 1 character long'),
    lastName: z
      .string()
      // .required("It is a requiered field")
      .min(1, 'Should be at least 1 character long'),
    email: z.string().email('Invalid email'),
    // .required("It is a requiered field"),
    password: z
      .string()
      .min(2, 'Password should be at least 2 characters long'),
    // .max(16, "Password should be at most 16 characters long"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    onSubmit: handleSubmit,
    validate: withZodSchema(RegisterFormSchema),
  });
  return (
    // flex-grow позволяет занимать свободное место между шапкой и футером
    <div className="flex items-center justify-center flex-grow">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
          <LoginPicture t={t} />
        </div>

        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
            {t('views.signup.title')}
          </h1>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* First Name Input */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2 sr-only"
                htmlFor="email"
              >
                {t('views.signup.firstNameLabel')}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={t('views.signup.firstNamePlaceholder')}
              />
              {formik.errors.firstName && formik.touched.firstName && (
                <div className="text-sm mt-2 text-red-600">
                  {formik.errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name Input */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2 sr-only"
                htmlFor="email"
              >
                {t('views.signup.lastNameLabel')}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={t('views.signup.lastNamePlaceholder')}
              />
              {formik.errors.lastName && formik.touched.lastName && (
                <div className="text-sm mt-2 text-red-600">
                  {formik.errors.lastName}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2 sr-only"
                htmlFor="email"
              >
                {t('views.signup.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={t('views.signup.emailPlaceholder')}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-sm mt-2 text-red-600">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2 sr-only"
                htmlFor="password"
              >
                {t('views.signup.passwordLabel')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={t('views.signup.passwordPlaceholder')}
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-sm mt-2 text-red-600">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
            >
              {t('views.signup.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
