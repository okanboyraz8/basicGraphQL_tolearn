// References: https://graphql.org/
// https://dev.to/codesphere/how-to-build-a-graphql-server-with-nodejs-and-express-2g8j

// to run without nodemon: "node server"

const express = require('express');
// Now, we can use GraphQLHTTP. We will use this as express middleware. To import:
const { graphqlHTTP } = require('express-graphql')
const myGraphQLSchema = require('./schema');

const app = express();

// Now we can use this function. (graphqlHTTP).
// So, where will we use it? We will use the app after it is created. We can use it with use.
// The first parameter is the url information. Then we add GraphQL HTTP. And we add objects into it.
app.use('/graphql', graphqlHTTP({
    schema: myGraphQLSchema,
    graphiql: true
    // graphiql: a test environment
}))

app.listen(4000, () => {
    console.log('Server is running on 4000!');
})