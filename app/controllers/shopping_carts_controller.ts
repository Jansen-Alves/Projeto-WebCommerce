import type { HttpContext } from '@adonisjs/core/http'
import ShoppingCart from '#models/shopping_cart'
export default class ShoppingCartsController {

    async store({auth, request, response}: HttpContext){
        try {
            const user = auth.user
            if (!user) {
              return response.unauthorized('Usuário não logado')
            }
      
            const productId = request.input('product_id')
      
            // Verifica se o produto já está no carrinho
            const existingItem = await ShoppingCart.query()
              .where('user_id', user.id)
              .andWhere('product_id', productId)
              .first()
      
            if (existingItem) {
              return response.badRequest('Product already in cart')
            }
      
            // Adiciona ao carrinho
            await ShoppingCart.create({
              userId: user.id,
              productId: productId,
            })
      
            return response.ok({ message: 'Produto adicionado ao carrinho' })
          } catch (error) {
            console.error(error)
            return response.internalServerError('Algo deu errado')
          }

    }
}