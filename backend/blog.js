'use strict';

const Hapi = require('@hapi/hapi');
const Redis = require('redis');
const Inert = require('@hapi/inert');

const init = async () => {
    // Create a new Hapi server
    const server = Hapi.server({
        port: 3030,
        host: 'localhost'
    });

    // Register the Inert plugin
    await server.register(Inert);

    // Create a Redis client
    const redisClient = Redis.createClient({ url: 'redis://localhost:6379' });

    // Connect to Redis
    await redisClient.connect();

    // Serve static files (HTML, JS)
    server.route({
        method: 'GET',
        path: '/{file*}',
        handler: {
            directory: {
                path: 'public',
                redirectToSlash: true,
                index: true
            }
        }
    });

    // API endpoint to store text
    server.route({
        method: 'POST',
        path: '/store',
        handler: async (request, h) => {
            const { text } = request.payload;
            await redisClient.set('anggasaputra', text);
            return { text };
        }
    });

    // Start the server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// Handle errors gracefully
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// Initialize the server
init();
