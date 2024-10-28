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

  async list({ view,request}: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const payload = request.only(['nome'])
    const query = Product.query()
    if (payload.nome != null && payload.nome.length){
     query.where('nome', 'like', `%${payload.nome}%`)
  } 
    const product = await query.paginate(page,limit)
    return view.render('pages/products/index_adm', {product})
  }


  async show({view, params}: HttpContext) {
    const product = await Product.findOrFail(params.id)
    //const product = await data.json()
    return view.render('pages/products/show', {product})
  }

  async create({view, params }: HttpContext){
    return view.render('pages/products/create')
  }

  async alter({view, params }: HttpContext){
    const product = await Product.findOrFail(params.id)

    return view.render('pages/products/alter',{product})
  }
  async store({request, response}: HttpContext){
    const payload = request.only(['nome', 'price', 'description'])

    await Product.create(payload)

    return response.redirect().toRoute('products.index')
  }
  async destroy({ params, response}: HttpContext){
    const product = await Product.findOrFail(params.id)
    console.log(params.id)
    await product.delete()
    return response.redirect().toRoute('products.list')
    
    
  }

  async update({ params, request, response}: HttpContext){
    
    const product = await Product.findOrFail(params.id)
    const altered = request.only(['nome', 'price', 'description'])

    const filteredaltered = Object.fromEntries(
      Object.entries(altered).filter(([key, value]) => value !== null && value !== '')
    )
    product.merge(filteredaltered)

    await product.save()

    return response.redirect().toRoute('products.list')
  }
}