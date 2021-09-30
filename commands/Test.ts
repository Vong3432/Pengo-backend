import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import { join } from 'path'

export default class Test extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:test'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Make a new test file'

  @args.string({
    name: 'interface',
    description: "Name for the test file",
  })
  public name: string

  @flags.boolean({description: 'Create test for HTTPs service'})
  public https: boolean


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
    const filePath = this.https ? 'tests/https/' : 'tests/';

    this.generator
      .addFile(
        this.name,
        {
          extname: '.spec.ts',
          pattern: 'snakecase'
        })
      .appRoot(this.application.appRoot)
      .destinationDir(filePath)
      .useMustache()
      .stub(join(__dirname, this.https ? './templates/test-http.txt' : './templates/test.txt'))
      .apply({ resourceful: true })

    await this.generator.run();

  }

  public async completed() {
    this.logger.action('create').succeeded('Created successfully')

    // this.logger.action('create').skipped('File already exists')

    if (this.error)
      this.logger.action('create').failed(this.error, 'Something went wrong')
  }
}
