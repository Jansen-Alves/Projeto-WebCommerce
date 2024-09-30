 import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'


export default class ProductsController {
  async index() {
    const data = await fetch('https://fakestoreapi.com/products')
    const product = await data.json()
    return product
  }
  async show({params}: HttpContext) {
    const data = await fetch(`https://fakestoreapi.com/products/${params.id}`)
    const product = await data.json()
    return product
  }

  async create({ params }: HttpContext){
    const product = await Product.create({nome: 'lapis'})
    return product
  }
 
}