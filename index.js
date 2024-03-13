import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from "./schema.js";
import db from './_db.js'

const resolvers = {
    Query: {
        games() {
            console.log('get games')
            return db.games
        },
        authors() {
            return db.authors
        },
        reviews() {
            return db.reviews
        },
        review(_parent, { id }) {
            return db.reviews.find(review => review.id === id)
        },
        game(_parent, { id }) {
            return db.games.find(game => game.id === id)
        },
        author(_parent, { id }) {
            return db.authors.find(author => author.id === id)
        }
    },
    Game: {
        reviews(_parent) {
            return db.reviews.filter(r => r.game_id === _parent.id)
        }
    },
    Author: {
        reviews(_parent) {
            return db.reviews.filter(r => r.author_id === _parent.id)
        }
    },
    Review: {
        game(_parent) {
            return db.games.find(g => g.id === _parent.author_id)
        },
        author(_parent) {
            return db.authors.find(a => a.id === _parent.author_id)
        }
    },
    Mutation: {
        deleteGame(_parent, {id}) {
            db.games = db.games.filter(g => g.id !== id);
            return db.games
        },
        addGame(_parent, args) {
            const newGame = {
                ...args.game,
                id: Math.floor(Math.random() * 100000).toString(),
            }
            db.games.push(newGame);
            return newGame;
        },
        updateGame(_parent, args) {
            db.games = db.games.map(g => {
                if (g.id === args.id) {
                    return {
                        ...g,
                        ...args.game
                    }
                }
                return g
            })
            return db.games.find(g => g.id === args.id)
        }
    }
    
}

// create apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000
    }
})

console.log('Server ready at port ', 4000, url);

