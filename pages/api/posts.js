import mysql from 'mysql2/promise';
import { dbConfig, IsValidSerial, CleanString, IsValidName, IsValidText } from '../../g';
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
    //
    //
    // GET REQUEST - takes ofs as param
    if (req.method === 'GET') {
        // Default offset
        let offSet = 0;

        // Offset from url-params
        if (req.query.ofs && IsValidSerial(req.query.ofs)) {
            offSet = req.query.ofs;
        }

        // Connect do DB and get posts in chunks of 15
        try {
            const dbConn = await mysql.createConnection(dbConfig);
            const query = 'SELECT * FROM posts LIMIT 15 OFFSET +';
            const [data] = await dbConn.execute(query, [offSet]);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

        //
        //
        // POST REQUEST
    } else if (req.method === 'POST') {
        // Validate postText
        const postText = CleanString(req.body.post_text);
        if (!IsValidText(postText)) {
            return res.status(400).json({ error_key: 'post_text' });
        }

        // Validate session
        // Get cookie
        const cookie = req.cookies.jwt;
        if (!cookie) return res.status(401).json({ message: 'Unauthorized' });

        // Decode jwt
        let decoded = '';
        try {
            decoded = verify(cookie, process.env.JWT_SECRET);

            // Can't decode
        } catch {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = decoded.uid;
        const sessionId = decoded.sid;

        // VALIDATE SESSION IN DB
        try {
            const dbConn = await mysql.createConnection(dbConfig);
            const selQuery = `SELECT * FROM sessions 
                            WHERE session_id = ? AND fk_user_id = ? 
                            LIMIT 1`;
            const [session] = await dbConn.execute(selQuery, [sessionId, userId]);

            // Fail if array is empty
            if (!session.length) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Validation complete
            // INSERT post to db
            const postQuery = `INSERT INTO posts (fk_user_id, post_text)
                                VALUES(?,?)`;
            const [post] = await dbConn.execute(postQuery, [userId, postText]);

            // dbConn error
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: 'Server eroor' });
        }

        // SUCCES
        return res.status(200).json({ error: 'TODO: return the data' });

        //
        //
        // Method not allowed
    } else {
        return res.status(405).json({ error: 'Only GET and POST permitted' });
    }
}
