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

  async store({ request, session, response }: HttpContext) {
    try{
      console.log('store')
      const data = await request.only(['birthday'])
      const payload = await request.validateUsing(createUserValidator)
      const user = new User() 
      payload.birthday = data.birthday
      console.log(payload )
      user.merge(payload)

      await user.save()
      return response.redirect().toRoute('auth.create')
    }catch(exception){
      if (exception.messages) {
        // Captura os erros de validação
        console.log(exception.messages.errors);
    
        // Flash somente os campos relevantes
        session.flashOnly(['fullName', 'email', 'password']);
    
        // Armazena os erros na sessão
        session.flash({
          errors: exception.messages.errors,
        }); 
       
      }else {
        // Para outros tipos de erros
        console.error(exception); // Log de erro para depuração
        session.flash({
          errors: { login: 'Não encontramos nenhuma conta válida' },
        });
      }
      return response.redirect('back')
    }
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

  async alter({view, params }: HttpContext){
    const user = await User.findOrFail(params.id)

    return view.render('pages/users/alter',{user})
  }

  async update({ params, request, response}: HttpContext){
    
    const user = await User.findOrFail(params.id)
    const payload = request.body()

    const filteredaltered = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => value !== null && value !== '')
    )
    user.merge(filteredaltered)

    await user.save()

    return response.redirect().toRoute('/index')
  }

  async show({view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    //const product = await data.json()
    return view.render('pages/users/show', {user})
  }
}