'use strict';

const { MongoClient } = require('mongodb');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const init = async () => {

    const server = Hapi.server({
        port: 3032,
        host: 'localhost'
    });

    await server.register(Inert);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();


async function listCollectionContent() {

    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('test_mongo_db');
        const collection = database.collection('test');

        const cursor = collection.find();
        const results = await cursor.toArray();

        if (results.length > 0) {
            results.forEach((doc, index) => {
                console.log(`${index + 1}. ${JSON.stringify(doc, null, 2)}`);
            });
        } else {
            console.log("No documents found!");
        }
    } finally {
        await client.close();
    }
}

listCollectionContent().catch(console.error);
