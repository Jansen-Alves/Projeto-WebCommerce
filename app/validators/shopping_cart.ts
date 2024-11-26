import vine from '@vinejs/vine'

export const createShoppingCartValidator = vine.compile(
    vine.object({
        user_id: vine.number(),
        product_id: vine.number()
    })
  )
  