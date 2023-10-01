import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interface.js';
import { createOffer, getErrorMessage, StatusMessage } from '../../shared/helpers/index.js';
import chalk from 'chalk';


export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(chalk.blueBright(`${count} rows imported.`));
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
      console.log(fileReader);
    } catch (err) {
      console.error(chalk.red(`${StatusMessage.NOT_IMPORT_FILE} ${filename}`));
      console.error(getErrorMessage(err));
    }
  }
}
