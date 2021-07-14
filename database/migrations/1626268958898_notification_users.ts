import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class NotificationUsers extends BaseSchema {
  protected tableName = 'notification_user'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('notification_id').unsigned().references('notifications.id').onDelete('CASCADE')
      table.integer('is_read').unsigned().defaultTo(0)
      table.integer('is_sent').unsigned().defaultTo(1)
      table.dateTime('send_at').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
