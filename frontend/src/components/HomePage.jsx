'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        {t('views.welcome.hello')}
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        {t('views.welcome.description')}
      </p>
      <a
        className="inline-block bg-gray-700 text-white text-lg font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
        href="https://github.com/Zyabridos/taskManager"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('views.welcome.more')}
      </a>
    </div>
  );
};

export default HomePage;

// Стилизация контейнера (div)
// p-10 — отступы внутри блока.
// bg-white shadow-lg rounded-lg — белый фон, тень и скруглённые углы.

// Стилизация заголовка (h1)
// text-4xl — крупный размер шрифта.
// font-bold — жирное начертание.
// text-gray-800 — тёмно-серый цвет текста.
// mb-4 — отступ снизу.

// Стилизация описания (p)
// text-lg — средний размер шрифта.
// text-gray-600 — более светлый оттенок серого.
// mb-6 — отступ снизу.
// Стилизация кнопки (a)

// inline-block — ведёт себя как кнопка.
// bg-blue-600 — тёмно-синий цвет фона.
// bg-gray-700 - темно-серый
// text-white — белый текст.
// text-lg font-bold — крупный и жирный текст.
// py-3 px-6 — вертикальные и горизонтальные отступы.
// rounded-lg — скруглённые углы.
// shadow-md — небольшая тень.
// hover:bg-blue-700 transition duration-300 — изменение цвета при наведении с плавным эффектом.
// rel="noopener noreferrer" — для безопасности открытия в новом окне.
