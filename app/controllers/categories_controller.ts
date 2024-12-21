import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import Subcategory from '#models/subcategory'

export default class CategoriesController {
    async show({ view, params }: HttpContext) {
        const categories = await Category.findOrFail(params.id)
        await categories.load('subCategories')

        return view.render('pages/categories/show', { categories })
      }
}


    