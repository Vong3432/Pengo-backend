import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserLocation extends BaseSchema {
  protected tableName = 'user_location'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('street');

    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('street');
    })
  }
}
