import { Command } from './command.interface.js';
// import got from 'got';
import axios from 'axios';
import { MockServerData } from '../../shared/types/index.js';
// import { appendFile } from 'node:fs/promises';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';

import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { StatusMessage } from '../../shared/helpers/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  private async load(url: string) {
    try {
      this.initialData = await (await axios.get(url)).data;
      console.log(this.initialData);
    } catch {
      throw new Error(`${StatusMessage.NOT_LOAD} ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      // await appendFile(
      //   filepath,
      //   `${tsvOfferGenerator.generate()}\n`,
      //   { encoding: 'utf8' }
      // );
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    // Код для получения данных с сервера.
    // Формирование объявлений.

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error(StatusMessage.NOT_GENERATE);

      // if (error instanceof Error) {
      //   console.error(error.message);
      // }
      console.error(getErrorMessage(error));
    }
  }
}
