import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'
import hash from '@adonisjs/core/services/hash'
let sequence = 3

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'doe@gmail.com',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'doe@gmail.com',
  },
  {
    id:3,
    name: 'Jana Doe',
    email: 'doenna@gmail.com',
  }
]

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
    const senha = request.only(['password'])

    const payload = request.only(['fullName', 'email', 'password'])
    payload.password = await hash.make(senha.password)

    const user = await User.create(payload)

    return response.redirect().toRoute('users.show', { id: user.id })
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