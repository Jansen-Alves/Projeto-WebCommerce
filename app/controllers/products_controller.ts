import Product from '#models/product'
import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { createProductValidator  } from '#validators/product'
import Subcategory from '#models/subcategory'
import path from 'path'
import { fileURLToPath } from 'url';
import Approval from '#models/approval'

export default class ProductsController {
  async index({ view,params,request}: HttpContext) {
    const categories = await Category.query().orderBy('id', 'asc').preload('subCategories')
    const subcategories = await Subcategory.query().orderBy('category_id', 'asc')
    //console.log("chegou na função")
    const page = request.input('page', 1)
    const limit = 10
    //requere todo os rows da tabela Product
    //const product = await Product.all()
    //const  = await data.json()

    const payload = request.only(['name','subcategory'])
    const query =  Product.query()
    const subcategory = params.subcategory || payload.subcategory
    const category = params.category
  
    console.log("resposta de form", payload)

  if(payload.name != null && payload.name.length && payload.subcategory != null){
    await query.where((builder) => {
      builder
        .where('name', 'like', `%${payload.name}%`)
        .orWhere('description', 'like', `%${payload.name}%`);
    })
    .andWhere('subcategoryId', payload.subcategory)
  }else if (payload.name != null && payload.name.length){
    await query.where('name', 'like', `%${payload.name}%`).orWhere('description', 'like', `%${payload.name}%`)

  }else if(category > 0){
    query.where('categoryId',category )

  }else if(subcategory != null){
    query.where('subcategoryId', subcategory)
  }
    await query.preload('category').preload('subCategory')
    const product = await query.paginate(page,limit)
    return view.render('pages/products/index', {product, subcategories, categories})
  }

  async list({ view,request}: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const payload = request.only(['name'])
    const query = Product.query()
    if (payload.name != null && payload.name.length){
     query.where('name', 'like', `%${payload.name}%`).orWhere('description','like',`%${payload.name}%`)
  } 
    const product = await query.paginate(page,limit)
    return view.render('pages/products/list', {product})
  }

  async create({view }: HttpContext){
    const categories = await Category.query().orderBy('id', 'asc').preload('subCategories')
    const subcategories = await Subcategory.query().orderBy('category_id', 'asc')
    return view.render('pages/products/create',{categories, subcategories})
  }

  async store({request, response, session}: HttpContext){
    const __filename = fileURLToPath(import.meta.url); // Caminho completo do arquivo atual
    const __dirname = path.dirname(__filename); 
    try{
    //console.log("entrou", request.body())
    const imgSrc = request.file('imagem', {
      extnames: ['jpg', 'png', 'jpeg'],
      size: '4mb',
    });

    //console.log(imgSrc)
    const payload = await request.validateUsing(createProductValidator)
   // console.log("depois do validador", payload.imgSrc)
    const add = await Subcategory.findByOrFail('id', payload.subcategoryId)
    payload.categoryId = add?.categoryId
    
    if (imgSrc) {
      const imageName = `${new Date().getTime()}`;
      const uploadPath = path.join(__dirname, '..', 'uploads', add.name);

      console.log("path", imageName)
      await imgSrc.move(uploadPath);
      payload.imgSrc = `/app/uploads/${add.name}/${imgSrc.clientName}`
      }
    console.log(payload)
    session.flash('sucess.product','Produto cadastrado com sucesso!');
    const product = await Product.create(payload)
    return response.redirect().toRoute('products.show', {id: product.id})
    }catch(error){
      console.error(error);

    // Armazena uma mensagem de erro na sessão em caso de falha
    session.flash({ error: { product: 'Erro ao cadastrar o produto. Verifique os dados e tente novamente.' }});
//session.flash({ errors: { login: 'Não encontramos nenhuma conta válida' } })
    return response.redirect('back');
    }
  }

  async show({view, params, auth}: HttpContext) {
    
    const user = auth.user
    let likeexiste = null
    const productId = params.id
    const product = await Product.findOrFail(productId)
    await product.load('category')
    await product.load('subCategory')
    const similars = await Product.query().where('subcategoryId', product.subcategoryId)
    if(user){
        console.log("pegou")
       likeexiste = await Approval.query().where('userId', user.id).andWhere('productId', params.id).first()
    }

    //const product = await data.json()
    
    return view.render('pages/products/show', {product, likeexiste: !!likeexiste, similars})
  }

  

  async alter({view, params }: HttpContext){
    const product = await Product.findOrFail(params.id)
    const categories = await Category.query().orderBy('id', 'asc').preload('subCategories')
    const subcategories = await Subcategory.query().orderBy('category_id', 'asc')
    
    return view.render('pages/products/alter',{product, categories, subcategories})
  }
  
  async destroy({ params, response}: HttpContext){
    const product = await Product.findOrFail(params.id)
    console.log(params.id)
    await product.delete()
    return response.redirect().toRoute('products.list')
    
    
  }

  async update({ params, request, response}: HttpContext){
    
    const product = await Product.findOrFail(params.id)
    const altered = request.only(['name', 'price', 'description','stocked', 'subcategoryId'])

    const filteredaltered = Object.fromEntries(
      Object.entries(altered).filter(([key, value]) => value !== null && value !== '')
    )
    product.merge(filteredaltered)

    await product.save()

    return response.redirect().toRoute('products.list')
  }
}