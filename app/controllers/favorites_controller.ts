import type { HttpContext } from '@adonisjs/core/http'
import Favorite from '#models/favorites'
import Product from '#models/product'

export default class FavoritesController {
  // Adiciona um item aos favoritos
  async store({ auth, request, response, params }: HttpContext) {
    try {
      const user = auth.user
      const previousUrl = request.header('Referer')
       
      if (!user) {
        return response.unauthorized('Usuário não logado')
      }

      const productId = params.id
      const product = await Product.findByOrFail('id', productId)
      // Verifica se o produto já está nos favoritos
      const existingFavorite = await Favorite.query()
        .where('user_id', user.id)
        .andWhere('product_id', productId)
        .first()

      if (existingFavorite) {
        await existingFavorite.delete()
        product.favorites = -1
        return response.redirect().toPath(previousUrl)
      }

      // Adiciona aos favoritos
      product.favorites += 1
      await product.save()
      await Favorite.create({
        userId: user.id,
        productId: productId,
      })

      return response.redirect().toPath(previousUrl)
    } catch (error) {
      console.error(error)
      return response.internalServerError('Algo deu errado')
    }
  }

  // Remove um item dos favoritos
  async remove({ auth, response, params }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized('Usuário não logado')
      }

      const productId = params.id

      // Remove o produto dos favoritos
      await Favorite.query()
        .where('user_id', user.id)
        .andWhere('product_id', productId)
        .delete()

      return response.redirect().toRoute('favorites.show', { id: user.id })
    } catch (error) {
      console.error(error)
      return response.internalServerError('Algo deu errado')
    }
  }
  
  // Exibe a lista de favoritos
  async show({ params, view }: HttpContext) {
    try {
      const favorites = await Favorite.query().where('userId', params.id).preload('product')


      return view.render('pages/favorites/show', { favorites })
    }catch{
      return Response.error
    }
  }

}
