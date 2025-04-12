import React from 'react';
import Task from '../../../components/Task';

const getTask = async id => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/tasks/${id}`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Task not found');
  return res.json();
};

const TaskPage = async ({ params }) => {
  const task = await getTask(params.id);

  return (
    <div className="container mx-auto mt-8">
      <Task task={task} />
    </div>
  );
};

export default TaskPage;
