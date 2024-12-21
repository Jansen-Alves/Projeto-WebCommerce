import Approval from '#models/approval'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApprovalsController {
    async store({auth, response, params}: HttpContext){
        try {
            const user = auth.user
            if (!user) {
              return response.unauthorized('Usuário não logado')
            }
            
            const productId = params.id
            //const productId = request.input('product_id')
            const product = await Product.findByOrFail('id', productId)

            // Verifica se o produto já está no carrinho
            const existingItem = await Approval.query()
              .where('user_id', user.id)
              .andWhere('product_id', productId)
              .first()
            
            if (existingItem) {
              await existingItem.delete()
              product.approvals -= 1
              await product.save()
            }else{
            product.approvals += 1
            await product.save()
            // Adiciona ao carrinho
            await Approval.create({
              userId: user.id,
              productId: productId,
            })
            }
            return response.redirect().toRoute('products.show',{id: productId})
          } catch (error) {
            console.error(error)
            return response.internalServerError('Algo deu errado')
          }

    } async remove ({auth, response, params}: HttpContext){
      try {
          const user = auth.user
          if (!user) {
            return response.unauthorized('Usuário não logado')
          }
          
          const productId = params.id
          //const productId = request.input('product_id')
          const product = await Product.findByOrFail('id', productId)

          // Verifica se o produto já está no carrinho
          const existingItem = await Approval.query()
            .where('user_id', user.id)
            .andWhere('product_id', productId)
            .first()
          
          if (existingItem) {
            await existingItem.delete()
            product.approvals += 1
            await product.save()
          }else{
          product.approvals -= 1
          await product.save()
          // Adiciona ao carrinho
          await Approval.create({
            userId: user.id,
            productId: productId,
          })
          }
          return response.redirect().toRoute('products.show',{id: productId})
        } catch (error) {
          console.error(error)
          return response.internalServerError('Algo deu errado')
        }

  }

  async show({ params, view }: HttpContext) {
    try {
      const approval = await Approval.query().where('userId', params.id).preload('product')


      return view.render('pages/approval/show', { approval })
    }catch{
      return Response.error
    }
  }

  async cont({params, view}: HttpContext){
    try{
      const approval = await Approval.query().where('userId', params.id).andWhere('active', true).preload('product')
      let cont = 0
      
      //await carts?.load('product')
      //console.log(carts)
      for(const approve of approval){
        cont += 1; // Soma a quantidade de cada item
      }

      return { cont }; // Retorna o contador como JSON
  } catch (error) {
      console.error('Erro ao buscar o contador:', error);
      return { cont: 0 }; // Retorno padrão em caso de erro
  }
  }

  async deactive({response, params,auth}: HttpContext){
    try{
      const user = auth.user
      const productId = params.id
      if (!user) {
        return response.unauthorized('Usuário não logado')
      }
      if(productId > 0){
      const cart = await Approval.query().where('userId', user.id).andWhere('productId', params.id).first()
      if(cart != null){
        cart.active = false
        await cart.save()
       
      }else{
        await Approval.create({
          userId: user.id,
          productId: productId,
          active: false,
        })
      }
      
    }else{
      await Approval.query().where('userId', user.id).update({ active: false })
    }
    return response.redirect().toRoute('products.show', {id: productId})
  }catch{
    return response.internalServerError()
  }
  }
}