export default async function cleanTestData(db) {
  // Drop the `users` table
  await db.exec('DROP TABLE IF EXISTS users;');
}
