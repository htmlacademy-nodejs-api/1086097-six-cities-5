#!/usr/bin/env node
import { CLIApplication, ImportCommand, HelpCommand, VersionCommand } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand()
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
