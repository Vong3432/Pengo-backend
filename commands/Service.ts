import { args, BaseCommand } from '@adonisjs/core/build/standalone'
import { join } from 'path'

export default class Service extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'service'

  // @args.string({ description: 'File name for the service' })
  // public name: string

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Generate service file that handles orm logic for controller'

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
    const name = await this.prompt.ask('Enter file name', { hint: 'Coupon' })
    const filePath = 'app/Services/' + name.toLowerCase();

    this.generator
      .addFile(name, {
        extname: '.ts',
        suffix: 'Service',
        pattern: 'pascalcase'
      })
      .appRoot(this.application.appRoot)
      .destinationDir(filePath)
      .useMustache()
      .stub(join(__dirname, './templates/service.txt'))
      .apply({ name })

    await this.generator.run();
  }

  public async completed() {
    this.logger.action('create').succeeded('Created successfully')

    // this.logger.action('create').skipped('File already exists')

    if (this.error)
      this.logger.action('create').failed(this.error, 'Something went wrong')
  }
}
