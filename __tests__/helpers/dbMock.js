import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbMock = await open({
  filename: ':memory:', // In-memory database for testing
  driver: sqlite3.Database,
});

export default dbMock;
