import type { HttpContext } from '@adonisjs/core/http'
import ShoppingCart from '#models/shopping_cart'
export default class ShoppingCartsController {

    async store({auth, request, response, params}: HttpContext){
        try {
            const user = auth.user
            if (!user) {
              return response.unauthorized('Usuário não logado')
            }
            
            const productId = params.id
            //const productId = request.input('product_id')
      
            // Verifica se o produto já está no carrinho
            const existingItem = await ShoppingCart.query()
              .where('user_id', user.id)
              .andWhere('product_id', productId)
              .first()
      
            if (existingItem) {
              return response.badRequest('Produto já no carrinho')
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
    async show({params, view}: HttpContext){
      try{
        const carts = await ShoppingCart.query().where('userId', params.id).preload('product')
        //await carts?.load('product')
        //console.log(carts)
        return view.render('pages/cart/show',{carts})

      }catch{
        return Response.error
      }
    }

    async remove({response, params,auth}: HttpContext){
      try{
        const user = auth.user
        if (!user) {
          return response.unauthorized('Usuário não logado')
        }
        const cart = await ShoppingCart.query().where('userId', user.id).andWhere('productId', params.id).first()
        if(cart){
          cart.active = false
          await cart.save()
        }
    }catch{
      return response.internalServerError()
    }
    }


    async destroy({response, params, auth}: HttpContext){
      const user = auth.user
      if (!user) {
        return response.unauthorized('Usuário não logado')
      }
      await ShoppingCart.query().where('userId', user.id).andWhere('productId', params.id).delete()
      return response.redirect().toRoute('product.list')
    }
}