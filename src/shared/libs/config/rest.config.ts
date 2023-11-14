import { Config } from './config.interface.js';
import { config } from 'dotenv';
// import { DotenvParseOutput, config } from 'dotenv';
import { Logger } from '../logger/index.js';
import { LoggerMessage } from '../../helpers/const.js';
import { configRestSchema, RestSchema } from './rest.schema.js';
import { injectable, inject } from 'inversify';
import { Component } from '../../types/component.enum.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor (@inject(Component.Logger) private readonly logger: Logger){
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(LoggerMessage.NOT_READ_ENV);
    }

    // считывание значений из .env
    configRestSchema.load({});
    try {
      configRestSchema.validate({ allowed: 'strict'});
    } catch {
      this.logger.error('Error', new Error('Value not found in .env'));
    }

    this.config = configRestSchema.getProperties();
    this.logger.info(LoggerMessage.READ_ENV);
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
