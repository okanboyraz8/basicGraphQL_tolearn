const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID
} = require('graphql');

// var personeller = [
//     { id: '1', isim: 'Alexis', yas: 20, email: 'alexis@gmail.com' },
//     { id: '2', isim: 'McAlister', yas: 25, email: 'mcalister@gmail.com' },
//     { id: '3', isim: 'Dominik', yas: 30, email: 'dominik@gmail.com' },
//     { id: '4', isim: 'Szoboszlai', yas: 35, email: 'szoboszlai@gmail.com' },
// ]

// Note: We will use the resolve function to access this information.
// This information can be found somewhere in an API, database or by adding it as shown in the figure.
// All we need to do is write the correct access codes in resolve.
// When the Personnel Query runs, we need to access the data: resolve function

const PersonelType = new GraphQLObjectType({
    name: 'Personel',
    // fields must be created as a function
    fields: () => ({
        id: { type: GraphQLString },
        isim: { type: GraphQLString },
        email: { type: GraphQLString },
        yas: { type: GraphQLInt }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    // fields must be created as an array
    fields: {
        personel: {
            type: PersonelType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                // access to data
                // for (let i = 0; i < personeller.length; i++) {
                //     if (personeller[i].id === args.id) {
                //         return personeller[i];
                //         // Let's examine GraphQLList.
                //         // Currently, we can manually access the data in the data only through one ID.
                //         // Well, if we want to access more than one personnel with the Personnel Query,
                //         // we will define a type using GraphQLList, just like Personnel.
                //         // We will also use Personnel Type in GraphQLList.
                //         //Thus, we will be able to access more than one data with this type.
                //     }
                // }
                return axios.get('http://localhost:3000/personeller/' + args.id).
                    then(res => res.data);
            }
        },
        // "new" was added later! because when not added such error was received:
        // type: GraphQLList(PersonelType), || TypeError: Class constructor GraphQLList cannot be invoked without 'new'
        personeller: {
            type: new GraphQLList(PersonelType),
            resolve(parent, args) {
                // return personeller;
            }
        }
        // We wrote two different queries in RootQuery:
        // 1. personel 2. personeller
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        personelEkle: {
            type: PersonelType,
            args: {
                isim: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                yas: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return axios.post('http://localhost:3000/personeller', {
                    isim: args.isim,
                    email: args.email,
                    yas: args.yas,
                }).then(res => res.data)
            }
        },
        personelSil: {
            type: PersonelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return axios.delete('http://localhost:3000/personeller/' + args.id).
                    then(res => res.data);
            }
        },
        personelGuncelle: {
            type: PersonelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                isim: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                yas: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(_, args) {
                return axios.patch('http://localhost:3000/personeller/' + args.id).
                    then(res => res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
})