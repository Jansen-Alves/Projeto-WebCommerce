/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
router
  .group(() => {
    router.get('/', [UsersController, 'index']).as('lista')
    router.get('/:id', [UsersController, 'show']).where('id', router.matchers.number()).as('show')
    router.post('/', [UsersController, 'create']).as('create')
  })
  .prefix('users')
  .as('users')

  router
    .group(() => {
      router.get('/', [ProductsController, 'index']).as('lista')
      router.get('/:id', [ProductsController, 'show']).where('id', router.matchers.number()).as('show')
      router.post('/', [ProductsController, 'store']).as('create')
      router.delete('/:id', [ProductsController, 'destroy']).as('destroy')
      router.patch('/:id', [ProductsController, 'update']).as('update')
    })
    .prefix('product')
    .as('products')