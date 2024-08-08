// Import required modules
const Hapi = require('@hapi/hapi');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1182',
    database: 'smx_database'
};

// Create Hapi server
const init = async () => {
    const server = Hapi.server({
        port: 3031,
        host: 'localhost'
    });

    // Define route for accessing the user table
    server.route({
        method: 'GET',
        path: '/user',
        handler: async (request, h) => {
            let connection;
            try {
                // Create a connection to the database
                connection = await mysql.createConnection(dbConfig);

                // Execute a query to fetch data from the user table
                const [rows] = await connection.execute('SELECT * FROM smx_user_table');
                
                // Return the fetched data as the response
                return h.response(rows).code(200);
            } catch (err) {
                console.error('Database error:', err);
                return h.response('Error accessing database').code(500);
            } finally {
                if (connection) {
                    // Close the database connection
                    await connection.end();
                }
            }
        }
    });

    // Start the server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// Handle server initialization errors
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
