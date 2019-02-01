import { ApolloServer, gql } from 'apollo-server'
import config from './config'

const types = ['user']

export const start = async () => {
  const typeDefs = gql`
    type User {
        id: ID!
        name:String!
        permissions : [Permission]
    }

    type Permission {
      id: ID!
      name: String!
    }

    type Query {
      user(id: Int, name: String) : User
      users(name: String) : [User]
    }

    schema {
      query: Query
    }
  `
  const resolvers = {
    Query: {
      user() {
        return { id: 1, name: 'Max Gilbert' }
      },
      users() {
        return [
          { 
            id: 1, name: 'Max Gilbert',
            permissions: [
              { 
                id: 1,
                name : "Can add things"
              }
            ]
          },
          { id: 2, name: 'Souban Quadri', permissions : []},
          { id: 3, name: 'Matthew Rothwell', permissions : [] }
        ]
      }
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })


  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
