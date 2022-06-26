import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import cors from 'cors';

const typeDefs = gql`

  type Book {
    title: String!
    author: String!
    id: String!
  }

  type Query {
    books: [Book!]!
  }

  type Mutation {
    addBook(title: String!): Boolean!
  }

`;

const books = [
  {
    title: 'As increveis aventura de tim tim no mundo darknes',
    author: 'Guilherme Campos',
    id: '1'
  }
];

const resolvers = {
  Query: {
    books: () => books
  },
  Mutation: {
    addBook: (parent: any, args: any): boolean => {

      console.log(parent, args);

      books.push({
        title: 'As increveis aventura de tim tim no mundo darknes',
        author: 'Guilherme Campos',
        id: `${books.length + 1}`
      });

      return true;

    }
  }
};

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express();
  app.use(cors());
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);