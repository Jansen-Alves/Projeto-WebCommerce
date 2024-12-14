import Approval from '#models/approval'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApprovalsController {
    async store({auth, view, response, params}: HttpContext){
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

              return view.render('pages/products/show', productId)
            }
           
            product.approvals += 1
            await product.save()
            // Adiciona ao carrinho
            await Approval.create({
              userId: user.id,
              productId: productId,
            })
      
            return view.render('pages/products/show', productId)
          } catch (error) {
            console.error(error)
            return response.internalServerError('Algo deu errado')
          }

    }
}