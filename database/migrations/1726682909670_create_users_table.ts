import { BaseSchema } from '@adonisjs/lucid/schema'
import Roles from '../../app/Enums/Roles.js'
import Hash from '@adonisjs/core/services/hash'
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('cpf').notNullable()
      table.date('birthday')
      table.integer('role_id').unsigned().references('id').inTable('roles').defaultTo(Roles.USER)
      table.string('password').notNullable()
   

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      this.defer(async (db) => {
        const hashedPassword = await Hash.make('12345')
        await db.table(this.tableName).multiInsert([{
          id:1,
          full_name: 'Jansen Alves',
          email: 'j.alves@gmail.com',
          cpf: '111.111.111-31',
          birthday: '2002-02-16',
          password:  hashedPassword,
          role_id: 2,
          created_at: new Date().toISOString(), // Define `created_at`
          updated_at: null

        }])
      })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}