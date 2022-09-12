import mysql from 'mysql2/promise';
import { dbConfig } from '../../g';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Only DELETE permitted' });
    }

    // GET user + session id
    const sessionId = req.body.session_id;
    const userId = req.body.user_id;

    // DELETE session
    try {
        const dbConn = await mysql.createConnection(dbConfig);
        const query = `DELETE FROM sessions WHERE session_id = ? AND fk_user_id = ?`;
        const values = [sessionId, userId];
        const [result] = await dbConn.execute(query, values);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Server error' });
    } finally {
        dbConn.destroy();
    }

    return res.status(200).json({ message: 'Session deleted' });
}
