import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Approval extends BaseModel {
  @column({ isPrimary: true })
  declare id: number


  @column()
  declare userId: number

  @belongsTo(()=> User)
  declare user: BelongsTo <typeof User>

  @column()
  declare productId: number

  @belongsTo(()=> Product)
  declare product: BelongsTo <typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}