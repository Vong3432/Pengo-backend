import { BaseCommand, flags, args } from '@adonisjs/core/build/standalone'
import { join } from 'path'

export default class Interface extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:interface'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Make a interface file for Services'

  @flags.boolean({
    name: 'restful',
    description: "Determine is new interface is for RESTful operation",
  })
  public restful: boolean

  @args.string({
    name: 'interface',
    description: "Name for the interface",
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
    const filePath = 'contracts/interfaces';

    if (this.restful === true) {
      this.generator
        .addFile(
          this.name,
          {
            extname: '.interface.ts',
            pattern: 'pascalcase'
          })
        .appRoot(this.application.appRoot)
        .destinationDir(filePath)
        .useMustache()
        .stub(join(__dirname, './templates/restful-interface.txt'))
        .apply({ resourceful: true })
    }
    else {
      this.generator
        .addFile(
          this.name,
          {
            extname: '.interface.ts',
            pattern: 'pascalcase'
          })
        .appRoot(this.application.appRoot)
        .destinationDir(filePath)
        .useMustache()
        .stub(join(__dirname, './templates/interface.txt'))
        .apply({ resourceful: true })

    }

    await this.generator.run();
  }
}
