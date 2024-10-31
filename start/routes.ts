/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
router
  .group(() => {
    router.get('/', [UsersController, 'index']).as('index')
    router.get('/:id', [UsersController, 'show']).where('id', router.matchers.number()).as('show')
    router.post('/', [UsersController, 'store']).as('store')
    router.get('/new', [UsersController, 'create']).as('create')
  })
  .prefix('users')
  .as('users')

  
    router.get('/adm', async ({ view }) =>{
      return view.render('pages/adm')
    })
    router.get('/login', [AuthController, 'create']).as('auth.create')
    router.post('/login', [AuthController, 'store']).as('auth.store')
    //router.get('/logout', [AuthController, 'destroy']).as('auth.destroy')
  
  router
    .group(() => {
      router.get('/', [ProductsController, 'index']).as('index')
      router.get('/:id', [ProductsController, 'show']).where('id', router.matchers.number()).as('show')
      router.get('/new/', [ProductsController, 'create']).as('create')
      router.post('/', [ProductsController, 'store']).as('store')
      router.get('/remove/:id', [ProductsController, 'destroy']).as('destroy')
      router.post('/update/:id', [ProductsController, 'update']).as('update')
      router.get('/list', [ProductsController, 'list']).as('list')
      router.get('/alter/:id', [ProductsController, 'alter']).as('alter')
      
    })
    .prefix('product')
    .as('products')