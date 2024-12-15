import type { HttpContext } from '@adonisjs/core/http'
import ShoppingCart from '#models/shopping_cart'
export default class ShoppingCartsController {

    async store({auth, response, params}: HttpContext){
        try {
            const user = auth.user
            if (!user) {
              return response.unauthorized('Usuário não logado')
            }
            
            const productId = params.id
            //const productId = request.input('product_id')
            console.log(productId)
            // Verifica se o produto já está no carrinho
            const existingItem = await ShoppingCart.query()
              .where('user_id', user.id)
              .andWhere('product_id', productId)
              .first()
      
            if (existingItem) {
              existingItem.quantity += 1
              existingItem.save()
              return response.redirect().toRoute('shoppingCart.show',{id: user.id})
            }
      
            // Adiciona ao carrinho
            await ShoppingCart.create({
              userId: user.id,
              productId: productId,
              quantity: 1,
            })
      
            return response.redirect().toRoute('products.show',{id: productId})
          } catch (error) {
            console.error(error)
            return response.internalServerError('Algo deu errado')
          }

    }

    async remove({auth, response, params}: HttpContext){
      try{
        const user = auth.user
        if (!user) {
          return response.unauthorized('Usuário não logado')
        }
        
        const productId = params.id
        //const productId = request.input('product_id')
        console.log(productId)
        // Verifica se o produto já está no carrinho
        const existingItem = await ShoppingCart.query()
          .where('user_id', user.id)
          .andWhere('product_id', productId)
          .first()
  
        if (existingItem) {
          existingItem.quantity -= 1
          if(existingItem.quantity == 0){
            existingItem.delete()
          }
          existingItem.save()
          return response.redirect().toRoute('shoppingCart.show',{id: user.id})
        }
      }catch(error){
        console.error(error)
        return response.internalServerError('Algo deu errado')
      }
    }

    async show({params, view}: HttpContext){
      try{
        const carts = await ShoppingCart.query().where('userId', params.id).preload('product')
        let somatorio = 0
        
        //await carts?.load('product')
        //console.log(carts)
        for(const cart of carts){
          somatorio += cart.product.price
        }
        const formatado = somatorio.toFixed(2);
        const frete = Math.trunc((somatorio* 0.15)*100)/100 
        return view.render('pages/cart/show',{carts, somatorio, formatado, frete})

      }catch{
        return Response.error
      }
    }

    async deactive({response, params,auth}: HttpContext){
      try{
        const user = auth.user
        if (!user) {
          return response.unauthorized('Usuário não logado')
        }
        const cart = await ShoppingCart.query().where('userId', user.id).andWhere('productId', params.id).first()
        if(cart){
          cart.active = false
          await cart.save()
          return response.redirect().toRoute('products.list')
        }
    }catch{
      return response.internalServerError()
    }
    }


    async destroy({response, params, auth}: HttpContext){
      const user = auth.user
      const productId = params.id
      if (!user) {
        return response.unauthorized('Usuário não logado')
      }
      await ShoppingCart.query().where('userId', user.id).andWhere('productId', productId).delete()
      return response.redirect().toRoute('products.show', {id: productId})
    }
}