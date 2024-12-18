import { BaseModel, column, belongsTo} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Product from '#models/product'

export default class Favorites extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
  
  @column()
  declare productId: number
  
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column()
  declare active: boolean
}
