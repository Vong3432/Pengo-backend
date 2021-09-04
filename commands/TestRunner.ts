import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import execa from 'execa'

export default class TestRunner extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'test:run'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Run single/multiple test file(s)'

  @flags.string()
  public file: string

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false,
  }

  public async run() {
    this.logger.info('Hello world!')

    // const fileNames: string = this.files.join(",");
    const testFilesPath: string = "/tests/"
    const fileNameWPath: string = testFilesPath + this.file

    try {
      const { stdout } = await execa('node', ['-r @adonisjs/assembler/build/register japaFile.ts $npm_config_file ', `--file=${this.file}.spec.ts`], {
        stdio: 'inherit',
        cwd: process.cwd()
      })

      this.logger.info(stdout);
    } catch (error) {
      console.log(error.isCanceled); // true
      this.logger.error(error);
    }
  }

  public async completed() {
    this.logger.info('All tests are executed.')

    // this.logger.action('create').skipped('File already exists')

    if (this.error)
      this.logger.info('The tests did not executed completely.')
  }
}
