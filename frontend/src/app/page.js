'use client';

import { Trans, useTranslation } from 'react-i18next';
import { HrefButton } from '../components/Buttons';
import Head from 'next/head';

const HomePage = () => {
  const { t } = useTranslation('home');

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title>
      </Head>

      <div className="px-20 pt-20">
        <div className="relative max-w-[90%] rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center">
            <h1 className="text-7xl font-semibold text-slate-800">{t('heading')}</h1>
          </div>
          <p className="mb-4 block text-3xl font-medium leading-normal text-slate-800">
            <Trans
              i18nKey="description.main"
              t={t}
              components={{ 1: <strong />, 3: <strong />, 5: <strong /> }}
            />
          </p>
          <p className="mb-4 block text-2xl font-medium leading-normal text-slate-800">
            {t('description.secondary')}
          </p>

          <div className="absolute bottom-6 right-6">
            <HrefButton href="https://github.com/Zyabridos/taskManager" buttonText={t('button')} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
