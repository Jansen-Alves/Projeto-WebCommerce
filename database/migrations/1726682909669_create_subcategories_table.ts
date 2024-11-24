import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subcategories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.integer('category_id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      this.defer(async (db) => {
        await db.table(this.tableName).multiInsert([{
          name: 'Coolers',
          category_id: 1,
        },{
          name: 'Disco rigido',
          category_id:1,
        },{
          name: 'Placa-mãe',
          category_id:1,
        },{
          name: 'Drive',
          category_id:1,
        },{
          name: 'Fontes',
          category_id:1,
        },{
          name: 'Memória RAM',
          category_id:1,
        },{
          name: 'Teclado e Mouse',
          category_id:2,
        },{
          name: 'Mouse Pad',
          category_id:2,
        },{
          name: 'Mesa Digitalizadora',
          category_id:2,
        },{
          name: 'Microfone',
          category_id:2,
        },{
          name: 'Cadeiras',
          category_id:3,
        },{
          name: 'Gabinetes',
          category_id:3,
        },{
          name: 'Monitores',
          category_id:3,
        }])
      })
    })
  }
 
  async down() {
    this.schema.dropTable(this.tableName)
  }
}