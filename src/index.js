import { ApolloServer } from 'apollo-server';
import connectDatabase from './database';
import globalQuery from './graphql/TypeDefinitions';
import globalResolvers from './graphql/GlobalResolvers';
import jwt from './graphql/accounts/jwt'
import fs from 'fs'


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
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context;
      } else {
        const token = req.headers.authorization ? req.headers.authorization : '';
        
        if(token) {
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

  server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`#### Server ready at ${url}`);
    console.log(`#### Subscriptions ready at ${subscriptionsUrl}`);
  });
})()
