/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController  = () => import('#controllers/auth_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const ShoppingCartController = () => import('#controllers/shopping_carts_controller')


router
  .group(() => {
    router.get('/', [UsersController, 'index']).as('index').use(middleware.adm())
    router.get('/:id', [UsersController, 'show']).where('id', router.matchers.number()).as('show').use(middleware.adm())
    router.post('/', [UsersController, 'store']).as('store')
    router.get('/new', [UsersController, 'create']).as('create')
    router.get('/alter/:id',[UsersController, 'alter']).as('alter')
    router.post('/update/:id', [UsersController, 'update']).as('update').use(middleware.auth())
    router.post('/role', [UsersController, 'role']).as('role').use(middleware.adm())
  })
  .prefix('users')
  .as('users')

  router.get('/categorias/:id', [CategoriesController, 'show'])

  router.get('/shopping-cart/add/:id', [ShoppingCartController, 'store']).use(middleware.auth()).as('shoppingCart.add')
  router.get('/shopping-cart/remove/:id',[ShoppingCartController,'remove']).use(middleware.auth()).as('shoppingCart.remove')
  router.get('/shopping-cart/:id', [ShoppingCartController, 'show']).use(middleware.auth()).as('shoppingCart.show')
  router.get('/shopping-cart/destroy/:id',[ShoppingCartController,'destroy']).use(middleware.auth()).as('shoppingCart.destroy')
  
    router.get('/index', async({view}) =>{
      return view.render('pages/main')
    }).as('main')

    router.get('/init', async({view}) =>{
      return view.render('pages/inicio')
    }).as('teste')

    router.get('/adm', async ({ view }) =>{
      return view.render('pages/adm')
    }).as('auth.adm').use(middleware.auth())

    router.get('/login', [AuthController, 'create']).as('auth.create')
    router.post('/login', [AuthController, 'store']).as('auth.store')
    router.get('/logout', [AuthController, 'destroy']).as('auth.destroy')
  
    router.get('product/', [ProductsController, 'index']).as('products.index')
    router.get('product/:id', [ProductsController, 'show']).where('id', router.matchers.number()).as('products.show')
  router
    .group(() => {
      router.get('/new/', [ProductsController, 'create']).as('create')
      router.post('/', [ProductsController, 'store']).as('store')
      router.get('/remove/:id', [ProductsController, 'destroy']).as('destroy')
      router.post('/update/:id', [ProductsController, 'update']).as('update')
      router.get('/list', [ProductsController, 'list']).as('list')
      router.get('/alter/:id', [ProductsController, 'alter']).as('alter')
      
    })
    .prefix('product')
    .as('products').use(middleware.adm())