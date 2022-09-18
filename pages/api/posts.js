import mysql from 'mysql2/promise';
import { dbConfig, IsValidSerial, CleanString, IsValidText } from '../../g';
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
    //
    //
    //
    //
    // GET REQUEST - takes ofs as param
    if (req.method === 'GET') {
        // init non-existing user
        let userId = 0;

        // Get cookie - apply that user if it exist
        const cookie = req.cookies.jwt;
        try {
            decoded = verify(cookie, process.env.JWT_SECRET);
            userId = decoded.uid;
        } catch {}

        // Default offset
        let offSet = 0;

        // Offset from url-params
        if (req.query.ofs && IsValidSerial(req.query.ofs)) {
            offSet = req.query.ofs;
        }
        console.log(offSet);

        // Connect do DB and get posts in chunks of 15
        const dbConn = await mysql.createConnection(dbConfig);

        try {
            const query = 'CALL SELECT_posts(?,?)';
            const [[data]] = await dbConn.execute(query, [userId, offSet]);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        } finally {
            dbConn.destroy();
        }

        //
        //
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
        const postIAt = Math.round(Date.now() / 1000);

        // VALIDATE SESSION IN DB
        const dbConn = await mysql.createConnection(dbConfig);
        try {
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
            const postQuery = `CALL INSERT_post(?,?,?)`;
            const [[[post]]] = await dbConn.execute(postQuery, [userId, postText, postIAt]);

            // SUCCES
            return res.status(200).json({ post: post });

            // dbConn error
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: 'Server eroor' });
        } finally {
            dbConn.destroy();
        }

        //
        //
        //
        //
        // DELETE post
    } else if (req.method === 'DELETE') {
        // Validate the id
        if (!req.query.id && IsValidSerial(req.query.id)) {
            return res.status(400).json({ message: 'No id provided' });
        }
        const postId = req.query.id;

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
        const dbConn = await mysql.createConnection(dbConfig);
        try {
            const selQuery = `SELECT * FROM sessions 
                            WHERE session_id = ? AND fk_user_id = ? 
                            LIMIT 1`;
            const [session] = await dbConn.execute(selQuery, [sessionId, userId]);

            // Fail if array is empty
            if (!session.length) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Validation complete
            // Delete post in db
            const delQuery = `CALL DELETE_post(?, ?)`;
            await dbConn.execute(delQuery, [userId, postId]);
            return res.status(200).json({ message: 'Post deleted' });

            // Server error
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: 'Server error' });
        } finally {
            dbConn.destroy();
        }

        //
        //
        //
        //
        // Method not allowed
    } else {
        return res.status(405).json({ error: 'GET, POST and DELETE permitted' });
    }
}
