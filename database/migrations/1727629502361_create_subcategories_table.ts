import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subcategories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories').onDelete('CASCADE')
      

      table.timestamp('created_at')
      table.timestamp('updated_at')

      this.defer(async (db) => {
        await db.table(this.tableName).multiInsert([{
          name: 'Coolers',
          category_id: 1,
        },{
          name: 'Disco Rígido',
          category_id:1,
        },{
          name: 'Placa-Mãe',
          category_id:1,
        },{
          name: 'Fonte',
          category_id:1,
        },{
          name: 'Memória RAM',
          category_id:1,
        },{
          name: 'Processador',
          category_id:1,
        },{
          name: 'Teclado e Mouse',
          category_id:2,
        },{
          name: 'Mouse Pad',
          category_id:2,
        },{
          name: 'Fone',
          category_id:2,
        },{
          name: 'Microfone',
          category_id:2,
        },{
          name: 'Cadeira',
          category_id:3,
        },{
          name: 'Gabinete',
          category_id:3,
        },{
          name: 'Monitor',
          category_id:3,
        }])
      })
    })
  }
 
  async down() {
    this.schema.dropTable(this.tableName)
  }
}