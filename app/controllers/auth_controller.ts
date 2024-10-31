import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    async create({view }: HttpContext){
        return view.render('pages/auth/create')
      }
    
      async store({view, response}: HttpContext){
        return response.redirect().toRoute('home')
      }
    
    
}