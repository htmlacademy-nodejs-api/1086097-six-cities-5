import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

enum SchemaDoc {
  PORT = 'Port for incoming connections',
  SALT = 'Salt for password hash',
  DB_HOST = 'IP address of the database server (MongoDB)',
}

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
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
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
});
