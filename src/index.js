import express from 'express'
import http from 'http'
import { ApolloServer } from 'apollo-server-express';
import connectDatabase from './database';
import globalQuery from './graphql/TypeDefinitions';
import globalResolvers from './graphql/GlobalResolvers';
import jwt from './graphql/accounts/jwt'
import fs from 'fs'
import { PORT } from './config';


(async () => {

  try {
    const info = await connectDatabase();
    console.log(`#### Mongodb ready at ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error("#### Unable to connect to database");
    process.exit(1);
  }

  const server = new ApolloServer({
    typeDefs: globalQuery,
    resolvers: globalResolvers,
    debug: false,
    uploads: {
      maxFileSize: 2000000, // 2 MB
      maxFiles: 5
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: async (connectionParams, webSocket) => {
        if (connectionParams.authToken) {
          const user = await jwt.getUser(connectionParams.authToken);
          return {
            user,
          }
        }
      }
    },
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context;
      } else {
        const token = req.headers.authorization ? req.headers.authorization : '';

        if (token) {
          const user = await jwt.getUser(token);
          return {
            user,
          }
        }
      }
    },
  });

  fs.mkdir('uploads', { recursive: true }, (err) => {
    if (err) {
      console.error("#### Unable to create uploads folder");
      process.exit(1);
    };
  });

  const app = express();
  server.applyMiddleware({ app })

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: PORT }, () => {
    console.log(`#### Server ready at ${server.graphqlPath}`);
    console.log(`#### Subscriptions ready at ${server.subscriptionsPath}`);
  });
})()
