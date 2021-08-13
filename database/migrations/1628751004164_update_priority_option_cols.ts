import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PriorityOptions extends BaseSchema {
  protected tableName = 'priority_options'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('dpo_id').unsigned().references('defined_priority_options.id');
      table.string('column').notNullable();
      table.string('str_value').nullable();
      table.string('int_value').nullable();
      table.enum('conditions', ['LARGER', 'LARGER_EQUAL', 'EQUAL', 'LESSER', 'LESSER_EQUAL']).notNullable();
      table.integer('is_active').unsigned().notNullable().defaultTo(1);
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
    })
  }
}
