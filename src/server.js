import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    type User {
        id: Int!
        name:Sring!

    }

    type Permission {
        id: Int!
        name:Sring!
    }

    type Query {
        user: User
        users: [User]!
        permission: Permission
        permissions: [Permission]!
      }

    schema {
      query: Query
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const userResolver = {
    Query: {
      user() {
        return { id: 1, name: 'Max Gilbert' }
      },
      users() {
        return [
          { id: 1, name: 'Max Gilbert' },
          { id: 2, name: 'Souban Quadri' },
          { id: 3, name: 'Matthew Rothwell' }
        ]
      }
    }
  }

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: userResolver,
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
