const prepareTaskViewData = async (app) => {
  const [statuses, users, labels] = await Promise.all([
    app.objection.models.status.query(),
    app.objection.models.user.query(),
    app.objection.models.label.query(),
  ]);

  return {
    statuses: statuses || [],
    executors: users || [],
    labels: labels || [],
  };
};

export default prepareTaskViewData;
