const Hapi = require('@hapi/hapi');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const init = async () => {
    const server = Hapi.server({
        port: 3030,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'] // Allow all origins
            }
        }
    });

    // MySQL connection
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1182',
        database: 'smx_database'
    });

    // Login route
    server.route({
        method: 'GET',
        path: '/login',
        handler: async (request, h) => {
            try {
                const { username, password } = request.query;

                if (!username || !password) {
                    return h.response({ message: 'Username and password are required' }).code(400);
                }

                console.log(`Checking login for username: ${username}`);

                const [rows] = await db.execute('SELECT * FROM smx_administrator_table WHERE username = ?', [username]);
                console.log('Query result:', rows);

                if (rows.length === 0) {
                    return h.response({ message: 'User not found' }).code(404);
                }

                const user = rows[0];
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return h.response({ message: 'Invalid credentials' }).code(401);
                }

                return { message: 'Login successful', user: user };
            } catch (err) {
                console.error('Login error:', err);
                return h.response({ message: 'Internal server error' }).code(500);
            }
        }
    });

    // Register route
    server.route({
        method: 'POST',
        path: '/register',
        handler: async (request, h) => {
            try {
                const { username, full_name, email, password, previledge } = request.payload;

                if (!username || !full_name || !email || !password || !previledge) {
                    return h.response({ message: 'All fields are required' }).code(400);
                }

                console.log(`Registering user: ${username}`);

                const [existingUser] = await db.execute('SELECT * FROM smx_administrator_table WHERE username = ?', [username]);
                console.log('Existing user check result:', existingUser);

                if (existingUser.length > 0) {
                    return h.response({ message: 'Username already exists' }).code(400);
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const [result] = await db.execute(
                    'INSERT INTO smx_administrator_table (username, full_name, email, password, previledge) VALUES (?, ?, ?, ?, ?)',
                    [username, full_name, email, hashedPassword, previledge]
                );

                console.log('Registration result:', result);

                return { message: 'User registered successfully', userId: result.insertId };
            } catch (err) {
                console.error('Registration error:', err);
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
                const [rows] = await db.execute('SELECT * FROM smx_administrator_table');
                return { users: rows };
            } catch (err) {
                console.error('Dashboard error:', err);
                return h.response({ message: 'Internal server error' }).code(500);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/user',
        handler: async (request, h) => {
            try {
                const [rows] = await db.execute('SELECT * FROM smx_user_table');
                return { users: rows };
            } catch (err) {
                console.error('Dashboard error:', err);
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
