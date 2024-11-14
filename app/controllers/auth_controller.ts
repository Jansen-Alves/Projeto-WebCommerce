import type { HttpContext } from '@adonisjs/core/http'
import { createAuthValidator } from '#validators/auth'
import User from '#models/user'
import authConfig from '#config/auth'

export default class AuthController {
    async create({view }: HttpContext){
        return view.render('pages/auth/create')
      }
    
      async store({auth, request, response}: HttpContext){
        try{
        const payload = await request.validateUsing(createAuthValidator)
        
        const user = await User.verifyCredentials(payload.email, payload.password)
        await auth.use('web').login(user)

        return response.redirect().toRoute('/index')
        }catch(exception){

        }
      }
      
      async destroy({auth,response}: HttpContext){
        await auth.use('web').logout()

        return response.redirect().toRoute('auth.create')

      }
    
    
}