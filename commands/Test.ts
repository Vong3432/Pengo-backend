import { BaseCommand, args } from '@adonisjs/core/build/standalone'
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
    const filePath = 'tests/';

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
      .stub(join(__dirname, './templates/test.txt'))
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
