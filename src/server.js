require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = 2020;

server.listen({ port: PORT }).then(() => {
    console.log(`Listening on port ${PORT}...`);
});