"use strict";
const GraphQLServer = require('graphql-yoga')

const users = [
    {
        name: 'Chomp',
        age: 47,
        friends: ['Alli', 'Jaws']
    }, {
        name: 'Alli',
        age: 62,
        friends: ['Chomp', 'Jaws']
    }, {
        name: 'Jaws',
        age: 35,
        friends: ['Alli', 'Chomp']
    },
]

const typeDefs = `
 type Query {
    user(name: String!): [User!]!
    friends(name: String!): [User!]
    
  }

  type User {
    name: String!
    age: Int!
    friends(name: String!): [User!]
  }
`

const resolvers = {
    Query: {
        user(parent, args, ctx, info) {
            if (!args.name) return users
            else return users.filter(user => {
                return user.name.toLowerCase().includes(args.name.toLowerCase())
            })
        }
    },
    User: {
        friends(parent, args, ctx, info) {
            const friends = []
            if (!args.name){ return users}
            else{
            parent.friends.forEach(friend => users.filter(user => {
                if (user.name.toLowerCase().includes(friend.toLowerCase()) && user.name.toLowerCase().includes(args.name.toLowerCase())) friends.push(user)
            }))

            return friends}
        }
    }

}
const server = new GraphQLServer.GraphQLServer({ typeDefs, resolvers })
const options = {
    port: process.env.PORT || 4000,
    playground: '/playground'
}
server.start(options, () => console.log('server running'))

