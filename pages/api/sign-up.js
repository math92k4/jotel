import mysql from 'mysql2/promise';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
import { IsValidName, IsValidPassword, dbConfig, CookieOptions } from '../../g';

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
        const [[[data]]] = await dbConn.execute(query, values);

        const jwtUser = {
            uid: data.fk_user_id,
            sid: data.session_id,
        };
        const jwt = sign(jwtUser, process.env.JWT_SECRET);
        console.log(jwt);

        // Set cookie
        res.setHeader('Set-Cookie', cookie.serialize('jwt', jwt, CookieOptions));

        // SUCCES
        return res.status(200).json({ info: 'Successfully created' });

        // Error
    } catch (error) {
        // If userName already in db
        if (error.message.includes(userName)) {
            return res.status(409).json({ error: 'Username already registred' });
        }
        return res.status(500).json({ error: 'Server error' });
    } finally {
        dbConn.destroy();
    }
}
