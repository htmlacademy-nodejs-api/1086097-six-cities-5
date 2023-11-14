import { Logger } from './logger.interface.js';
import {Logger as Pinoinstance, transport, pino} from 'pino';
import { getCurrentModuleDirectoryPath } from '../../helpers/file-system.js';
import { resolve } from 'node:path';
import { injectable } from 'inversify';
import chalk from 'chalk';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: Pinoinstance;
  constructor() {
    const modulePaht = getCurrentModuleDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePaht, '../../../', logFilePath);

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug',
        },
        {
          target: 'pino/file',
          options: {},
          level: 'info',
        },
      ]
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created...');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(chalk.red(error, message, ...args));
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(chalk.green(message, ...args));
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(chalk.yellow(message, ...args));
  }
}
