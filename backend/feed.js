'use strict';

const Hapi = require('@hapi/hapi');
const Redis = require('redis');
const Inert = require('@hapi/inert'); // Add this line

const init = async () => {
    // Create a new Hapi server
    const server = Hapi.server({
        port: 3032,
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

    // API endpoint to get the current counter value
    server.route({
        method: 'GET',
        path: '/count',
        handler: async (request, h) => {
            const count = await redisClient.get('counter') || 0;
            return { count: parseInt(count) };
        }
    });

    // API endpoint to increment the counter
    server.route({
        method: 'POST',
        path: '/increment',
        handler: async (request, h) => {
            const newCount = await redisClient.incr('counter');
            return { count: newCount };
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
