export const getStatusesFromDB = async (db) => {
  const statuses = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM statuses', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
  return statuses;
};

export const getUsersFromDB = async (db) => {};
