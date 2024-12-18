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
import Product from '#models/product'


const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController  = () => import('#controllers/auth_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const ShoppingCartController = () => import('#controllers/shopping_carts_controller')
const ApprovalsController = () => import('#controllers/approvals_controller')

router.get('/login', [AuthController, 'create']).as('auth.create')
router.post('/login', [AuthController, 'store']).as('auth.store')
router.get('/logout', [AuthController, 'destroy']).as('auth.destroy')

router.get('/index', async({view}) =>{
  const perifericos = await Product.query().where('categoryId', 2).orderBy('approvals', 'desc').preload('subCategory').limit(3)
  return view.render('pages/main', {perifericos})
}).as('main')

router.get('/init', async({view}) =>{
  return view.render('pages/inicio')
}).as('teste')

router.get('/adm', async ({ view }) =>{
  return view.render('pages/adm')
}).as('auth.adm').use(middleware.auth())

router.post('/approval/:id', [ApprovalsController, 'store']).as('approval.store').use(middleware.auth())
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
  router
  .group(() => {
  router.get('/add/:id/:mod', [ShoppingCartController, 'store']).as('add')
  router.get('/remove/:id',[ShoppingCartController,'remove']).as('remove')
  router.get('/cont/:id', [ShoppingCartController, 'cont']).as('cont')
  router.get('/:id', [ShoppingCartController, 'show']).as('show')
  router.get('/destroy/:id',[ShoppingCartController,'destroy']).as('destroy')
  router.get('/deactive/:id',[ShoppingCartController,'deactive']).as('deactive')
  })
  .prefix('shopping-cart').
  as('shoppingCart').use(middleware.auth())


  
  
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