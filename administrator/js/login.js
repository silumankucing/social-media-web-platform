const Hapi = require('@hapi/hapi');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const init = async () => {
    const server = Hapi.server({
        port: 3030,
        host: 'localhost'
    });

    // Create MySQL connection
    const db = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '1182',
        database: 'smx_database'
    });

    // Register route
    server.route({
        method: 'POST',
        path: '/register',
        handler: async (request, h) => {
            const { username, full_name, email, password, previledge } = request.payload;

            if (!username || !full_name || !email || !password || !previledge) {
                return h.response({ message: 'All fields are required' }).code(400);
            }

            try {
                // Check if user already exists
                const [rows] = await db.query('SELECT * FROM smx_administrator_table WHERE username = ?', [username]);
                if (rows.length > 0) {
                    return h.response({ message: 'Username already exists' }).code(400);
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user
                await db.query(
                    'INSERT INTO smx_administrator_table (username, full_name, email, password, previledge) VALUES (?, ?, ?, ?, ?)',
                    [username, full_name, email, hashedPassword, previledge]
                );

                return h.response({ message: 'User registered successfully' }).code(201);
            } catch (err) {
                console.error(err);
                return h.response({ message: 'Internal server error' }).code(500);
            }
        }
    });

    // Login route
    server.route({
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            const { username, password } = request.payload;

            if (!username || !password) {
                return h.response({ message: 'Username and password are required' }).code(400);
            }

            try {
                const [rows] = await db.query('SELECT * FROM smx_administrator_table WHERE username = ?', [username]);
                if (rows.length === 0) {
                    return h.response({ message: 'No username or password match' }).code(401);
                }

                const user = rows[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return h.response({ message: 'No username or password match' }).code(401);
                }

                return h.response({ message: 'Login successful' }).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ message: 'Internal server error' }).code(500);
            }
        }
    });

    // Dashboard route
    server.route({
        method: 'GET',
        path: '/dashboard',
        handler: async (request, h) => {
            try {
                const [rows] = await db.query('SELECT * FROM smx_administrator_table');
                return h.response(rows).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ message: 'Internal server error' }).code(500);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
