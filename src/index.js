import { ApolloServer } from 'apollo-server';
import connectDatabase from './database';
import globalQuery from './graphql/TypeDefinitions';
import globalResolvers from './graphql/GlobalResolvers';
import { getUser } from './graphql/utils'


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
    context: async ({ req }) => {
      const token = req.headers.authorization ? req.headers.authorization : '';
      const { user } = await getUser(token);
      return {
        user,
      };
    },
  });

  server.listen().then(({ url }) => {
    console.log(`#### Server ready at ${url}`);
  });
})()
