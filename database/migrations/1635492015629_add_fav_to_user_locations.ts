import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserLocation extends BaseSchema {
  protected tableName = 'user_location'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('is_fav').unsigned().defaultTo(0)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('is_fav')
    })
  }
}
