import mysql from 'mysql2/promise';
import { hash } from 'bcrypt';
import { IsValidName, IsValidPassword, dbConfig } from '../../g';

export default async function handler(req, res) {
    // Validate method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST permitted' });
    }

    // Get and validate client data
    // user_name
    const userName = req.body.user_name;
    if (!IsValidName(userName)) {
        return res.status(400).json({ errorKey: 'user_name', message: 'Invalid username ' });
    }
    // user_password
    const userPassword = req.body.user_password;
    if (!IsValidPassword(userPassword)) {
        return res.status(400).json({ errorKey: 'user_password', message: 'Invalid password ' });
    }
    // Hash password
    const hashed = await hash(userPassword, 10);

    // Connect and insert to db
    const dbConn = await mysql.createConnection(dbConfig);
    try {
        const query = `CALL INSERT_user(?, ?)`;
        const values = [userName, hashed];
        const [data] = await dbConn.execute(query, values);

        // CREATE JWT

        // Succes
        return res.status(200).json({ info: 'User created' });

        // Error
    } catch (error) {
        // If userName already in db
        if (error.message.includes(userName)) {
            res.status(409).json({ error: 'Username already registred' });
        }
        return res.status(500).json({ error: 'Server error' });
    } finally {
        dbConn.destroy();
    }
}

// const decoded = jwt.verify(token, "secret")
