import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import  Category  from '#models/category'
import Subcategory from './subcategory.js'
import ShoppingCart from './shopping_cart.js'
export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare price: number

  @column()
  declare categoryId: number

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @column()
  declare subcategoryId: number

  @belongsTo(() => Subcategory)
  declare subCategory: BelongsTo<typeof Subcategory>

  @column()
  declare stocked: number

  @column()
  declare imgSrc: string | null
  
  @hasMany(()=> ShoppingCart)
  declare shoppingCart: HasMany<typeof ShoppingCart>
  
  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}