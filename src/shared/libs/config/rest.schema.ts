import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

enum SchemaDoc {
  PORT = 'Port for incoming connections',
  SALT = 'Salt for password hash',
  DB_HOST = 'IP address of the database server (MongoDB)',
  DB_USER = 'Username to connect to the database',
  DB_PASSWORD = 'Password to connect to the database',
  DB_PORT = 'Port to connect to the database (MongoDB)',
  DB_NAME = 'Database name (MongoDB)',
}

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: SchemaDoc.PORT,
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: SchemaDoc.SALT,
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: SchemaDoc.DB_HOST,
    format: String,
    // format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: SchemaDoc.DB_USER,
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: SchemaDoc.DB_PASSWORD,
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: SchemaDoc.DB_PORT,
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: SchemaDoc.DB_NAME,
    format: String,
    env: 'DB_NAME',
    default: 'buy-and-sell'
  },
});
