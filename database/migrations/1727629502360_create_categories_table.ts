import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
    
    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([{
        name: 'Hardware',
      },{
        name: 'Periférico',
      },{
        name: 'Acessórios'
      }])
    })
    
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}