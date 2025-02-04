"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => {
        console.log("Users data:", response.data);
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto flex-grow py-10 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {t("views.users.title")}
      </h1>
      {loading ? (
        <p className="text-center text-lg text-gray-500">
          {t("views.users.loading")}
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  {t("views.users.id")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  {t("views.users.fullName")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  {t("views.users.email")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  {t("views.users.createdAt")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  {t("views.users.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {`${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/users/${user.id}/edit`}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium mr-2 transition duration-300"
                      >
                        {t("views.users.edit")}
                      </a>
                      <button className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-medium transition duration-300">
                        {t("views.users.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {t("views.users.noUsers")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;

// Основной контейнер:
// container mx-auto flex-grow py-10 px-4
// Центрирование страницы и отступы сверху/снизу.
// flex-grow позволяет занимать всё доступное пространство.

// Заголовок (h1):
// text-4xl font-bold text-gray-800 mb-8
// Увеличенный размер шрифта, жирный текст и тёмный цвет.

// Таблица:
// overflow-x-auto bg-white shadow-lg rounded-lg
// Скролл по горизонтали на мобильных устройствах.
// Тень и скруглённые углы для карточного вида.

// Шапка таблицы:
// bg-gray-800 text-white
// Тёмный фон и белый текст.
// uppercase
// Преобразование заголовков в верхний регистр.

// Строки таблицы:
// hover:bg-gray-100
// Подсветка строки при наведении.

// Кнопки (действия):
// bg-blue-600 hover:bg-blue-700 — для кнопки редактирования.
// bg-red-600 hover:bg-red-700 — для кнопки удаления.
// transition duration-300 — анимация наведения.
