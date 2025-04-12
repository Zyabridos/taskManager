'use client';

import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import { DeleteButton, HrefButton } from './Buttons';
import routes from '../routes';

interface User {
  firstName: string;
  lastName: string;
}

interface Label {
  id: number;
  name: string;
}

interface Status {
  name: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  status: Status;
  labels: Label[];
  author: User;
  executor: User | null;
  createdAt: string;
}

interface TaskDetailsProps {
  task: Task | null;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const { t } = useTranslation('tasks');

  if (!task) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold">{task.name}</h1>

      <div className="grid gap-6 rounded-lg bg-white p-6 shadow md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="text-lg text-gray-800">{task.description}</p>
        </div>

        <div className="border-t border-gray-200 pt-4 md:col-span-1 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-block rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              {task.status?.name}
            </span>
            {task.labels?.map(label => (
              <span
                key={label.id}
                className="inline-block rounded bg-blue-500 px-3 py-1 text-xs font-semibold text-white"
              >
                {label.name}
              </span>
            ))}
          </div>

          <div className="mb-3 text-sm text-gray-600">
            <span className="mr-2 font-medium">{t('author')}:</span>
            <span>{`${task.author.firstName} ${task.author.lastName}`}</span>
          </div>

          <div className="mb-3 text-sm text-gray-600">
            <span className="mr-2 font-medium">{t('executor')}:</span>
            {task.executor ? (
              <span>{`${task.executor.firstName} ${task.executor.lastName}`}</span>
            ) : (
              <span className="text-gray-400 italic">{t('unassigned')}</span>
            )}
          </div>

          <div className="mb-3 text-sm text-gray-600">
            <span className="mr-2 font-medium">{t('createdAt')}:</span>
            <span>{format(new Date(task.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <HrefButton
              href={routes.app.tasks.edit(task.id)}
              buttonText={t('editBtn')}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
            />
            <DeleteButton
              onClick={() => {
                console.log('Delete task', task.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
