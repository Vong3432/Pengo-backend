import { BaseCommand } from '@adonisjs/core/build/standalone'
import { join } from 'path'

export default class Interface extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:interface'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Generate interface file for Services'

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
    const name = await this.prompt.ask('Enter interface name', { hint: 'Coupon' })
    const filePath = 'contracts/interfaces';

    this.generator
      .addFile(
        name,
        {
          extname: '.interface.ts',
          pattern: 'pascalcase'
        })
      .appRoot(this.application.appRoot)
      .destinationDir(filePath)
      .useMustache()
      .stub(join(__dirname, './templates/interface.txt'))
      .apply({ resourceful: true })

    await this.generator.run();
  }
}
