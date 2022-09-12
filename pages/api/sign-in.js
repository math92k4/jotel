import mysql from 'mysql2/promise';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
import { IsValidName, IsValidPassword, CookieOptions, dbConfig } from '../../g';

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

    try {
        // Connect and insert to db
        const dbConn = await mysql.createConnection(dbConfig);
        const query = `SELECT user_id, user_password FROM users
                        WHERE user_name = ? LIMIT 1`;
        const values = [userName];
        const [user] = await dbConn.execute(query, values);

        // No user found - return 400
        if (!user.length) {
            return res.status(400).json({ info: 'Wrong username or password' });
        }

        // Does passwd match?
        const isMatch = await compare(userPassword, user[0].user_password);
        if (!isMatch) {
            return res.status(400).json({ info: 'Wrong username or password' });
        }

        // Insert session to db
        const sesQuery = `INSERT INTO sessions (fk_user_id) VALUES(?)`;
        const [session] = await dbConn.execute(sesQuery, [user[0].user_id]);
        const sessionId = session.insertId;

        // Create jwt
        const jwtUser = {
            uid: user[0].user_id,
            sid: sessionId,
        };
        const jwt = sign(jwtUser, process.env.JWT_SECRET);

        // Set cookie
        res.setHeader('Set-Cookie', cookie.serialize('jwt', jwt, CookieOptions));

        // SUCCES
        return res.status(200).json({ info: 'Successfully signed in' });

        // Error
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Server error' });
    } finally {
        dbConn.destroy();
    }
}
