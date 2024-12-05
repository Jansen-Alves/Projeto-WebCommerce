import Product from '#models/product'
import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { createProductValidator  } from '#validators/product'
import Subcategory from '#models/subcategory'
import path from 'path'
import { fileURLToPath } from 'url';

export default class ProductsController {
  async index({ view,request}: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    //requere todo os rows da tabela Product
    //const product = await Product.all()
    //const  = await data.json()

    const payload = request.only(['name'])
    const query = Product.query()
    if (payload.name != null && payload.name.length){
     query.where('name', 'like', `%${payload.name}%`)
  } 
    const product = await query.paginate(page,limit)
    return view.render('pages/products/index', {product})
  }

  async list({ view,request}: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const payload = request.only(['name'])
    const query = Product.query()
    if (payload.name != null && payload.name.length){
     query.where('name', 'like', `%${payload.name}%`)
  } 
    const product = await query.paginate(page,limit)
    return view.render('pages/products/list', {product})
  }

  async create({view }: HttpContext){
    const categories = await Category.query().orderBy('id', 'asc').preload('subCategories')
    const subcategories = await Subcategory.query().orderBy('category_id', 'asc')
    return view.render('pages/products/create',{categories, subcategories})
  }

  async store({request, response}: HttpContext){
    const __filename = fileURLToPath(import.meta.url); // Caminho completo do arquivo atual
    const __dirname = path.dirname(__filename); 
    //console.log("entrou", request.body())
    const imgSrc = request.file('imagem', {
      extnames: ['jpg', 'png', 'jpeg'],
      size: '4mb',
    });

    console.log(imgSrc)
    const payload = await request.validateUsing(createProductValidator)
    console.log("depois do validador", payload.imgSrc)
    const add = await Subcategory.findBy('id', payload.subcategoryId)
    payload.categoryId = add?.categoryId
    
    if (imgSrc) {
      const imageName = `${new Date().getTime()}`;
      const uploadPath = path.join(__dirname, '..', 'uploads', imageName);

      console.log("path", imageName)
      await imgSrc.move(uploadPath);
      payload.imgSrc = `app/uploads/${imageName}/${imgSrc.clientName}`
      }
    console.log(payload)
    const product = await Product.create(payload)
    return response.redirect().toRoute('products.show', {id: product.id})
  }

  async show({view, params}: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.load('category')
    //const product = await data.json()
    return view.render('pages/products/show', {product})
  }

  

  async alter({view, params }: HttpContext){
    const product = await Product.findOrFail(params.id)
    const categories = await Category.all()
    return view.render('pages/products/alter',{product, categories})
  }
  
  async destroy({ params, response}: HttpContext){
    const product = await Product.findOrFail(params.id)
    console.log(params.id)
    await product.delete()
    return response.redirect().toRoute('products.list')
    
    
  }

  async update({ params, request, response}: HttpContext){
    
    const product = await Product.findOrFail(params.id)
    const altered = request.only(['name', 'price', 'description', 'category_id'])

    const filteredaltered = Object.fromEntries(
      Object.entries(altered).filter(([key, value]) => value !== null && value !== '')
    )
    product.merge(filteredaltered)

    await product.save()

    return response.redirect().toRoute('products.list')
  }
}