export enum StatusMessage {
  NOT_IMPORT_FILE = 'Can\'t import data from file:',
  FALILED_PARSE = 'Failed to parse json content.',
  FALILED_READ = 'Failed to read version from',
  NOT_GENERATE = 'Can\'t generate data',
  NOT_LOAD = 'Can\'t load data from',
}

export enum LoggerMessage {
  INITIALIZATION = 'Application initialization',
  NOT_READ_ENV = 'Can\'t read .env file. Perhaps the file does not exists.',
  READ_ENV = '.env file found and successfully parsed!',
}
