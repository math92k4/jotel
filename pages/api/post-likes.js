import { verify } from 'jsonwebtoken';
import { IsValidSerial, dbConfig } from '../../g';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    //
    //
    //
    //
    // POST
    if (req.method == 'POST') {
        // Verify post_id
        const postId = req.body.post_id;
        if (!IsValidSerial(postId)) return res.status(400).json({ message: 'Not a valid post_id' });

        // Get like-type. True = +, False = -
        const likeType = req.body.like_type;

        // Verify cookie
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
        const isLike = req.body.like_type;

        // connect to db
        const dbConn = await mysql.createConnection(dbConfig);
        try {
            const query = `INSERT INTO post_likes (fk_post_id, fk_user_id, is_like)
                        VALUES(?,?,?)`;
            const [dbRes] = await dbConn.execute(query, [postId, userId, isLike]);

            if (dbRes.affectedRows == 0) return res.status(204);

            return res.status(200).json({ message: userId, postId });

            // ERROR
        } catch (err) {
            // Post_id doesnt exist
            if (err.message.includes('constraint fails')) {
                return res.status(204).json({ message: 'Post doesnt exist' });
            }
            // Like already in db
            if (err.message.includes('Duplicate entry')) {
                return res.status(409).json({ message: 'Cant like again' });
            }
            return res.status(500).json({ message: 'Server error' });

            // Destroy dbConn
        } finally {
            dbConn.destroy();
        }
    } else {
        return res.status(405).json({ message: 'Only POST permitted' });
    }
}
