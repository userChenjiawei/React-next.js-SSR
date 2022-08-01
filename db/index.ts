import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserAuth, Article, Comment, Tag } from './entity/index';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

const AppDataSource = new DataSource({
  type: 'mysql',
  host,
  port,
  username,
  password,
  database,
  entities: [User, UserAuth, Article, Comment, Tag],
  synchronize: false,
  logging: true,
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap

export default AppDataSource;
