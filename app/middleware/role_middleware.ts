import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class RoleMiddleware {
  redirectTo = '/index'

  async handle(ctx: HttpContext, next: NextFn,options: {
    guards?: (keyof Authenticators)[]
  } = {}) {
 
    try {
      // Verifique se o usuário está autenticado
      await ctx.auth.use('web').authenticate()
      // Verifique o atributo específico do usuário
      const user = ctx.auth.user
      if (!user || user.roleId !== 2) {
       return ctx.response.redirect().toRoute(this.redirectTo)
      }

      // Se o usuário tem a permissão correta, continue
      return next()

    } catch {
      return ctx.response.redirect().toRoute(this.redirectTo)
    }
   
  }
}