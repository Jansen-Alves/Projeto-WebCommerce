import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'
import hash from '@adonisjs/core/services/hash'


export default class UsersController {


  async index({ view,request}: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const payload = request.only(['nome'])
    const query = User.query()
    if (payload.nome != null && payload.nome.length){
     query.where('fullname', 'like', `%${payload.nome}%`)
  } 
    const user = await query.paginate(page,limit)
    return view.render('pages/users/list', {user})
  }

  async store({ request, response }: HttpContext) {
    console.log('alou')
    
    const payload = await request.validateUsing(createUserValidator)
    const user = new User()
    console.log(payload.email)
    user.merge(payload)

    await user.save()
   
    
    return response.redirect().toRoute('auth.create')
  }
  async role({request, response}: HttpContext){
    const payload = request.all()
    console.log(payload)
    const user = await User.findOrFail(payload.id)
    user.roleId = 2
    await user.save()

    response.redirect().toRoute('/adm')

  }
  async create({view }: HttpContext){
    return view.render('pages/users/create')
  }

  

  async show({view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    //const product = await data.json()
    return view.render('pages/users/show', {user})
  }
}