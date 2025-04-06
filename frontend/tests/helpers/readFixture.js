import fs from 'fs/promises';
import path from 'path';

const readFixture = async filename => {
  const filePath = path.resolve('./__fixtures__', filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export default readFixture;
