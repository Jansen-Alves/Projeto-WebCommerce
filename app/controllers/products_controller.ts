 import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'


export default class ProductsController {
  async index({ view,request}: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    //requere todo os rows da tabela Product
    //const product = await Product.all()
    //const  = await data.json()

    const payload = request.only(['nome'])
    const query = Product.query()
    if (payload.nome != null && payload.nome.length){
     query.where('nome', 'like', `%${payload.nome}%`)
  } 
    const product = await query.paginate(page,limit)
    return view.render('pages/products/index', {product})
  }


  async show({view, params}: HttpContext) {
    const product = await Product.findOrFail(params.id)
    //const product = await data.json()
    return view.render('pages/products/show', {product})
  }

  async create({view, params }: HttpContext){
    return view.render('pages/products/create')
  }
  async store({request}: HttpContext){
    const payload = request.only(['nome', 'price', 'description'])

    const insert = await Product.create(payload)

    return payload
  }
  async destroy({ params }: HttpContext){
    const product = await Product.findOrFail(params.id)

    await product.delete()
    return {
      message: `sucesso na remoção de ${params.id}`
    }
  }

  async update({ params, request}: HttpContext){
    const product = await Product.findOrFail(params.id)

    const altered = request.only(['nome'])

    product.merge(altered)

    await product.save()

    return product
  }
}