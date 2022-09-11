import mysql from 'mysql2/promise';
import { dbConfig } from '../../g';

export default async function handler(req, res) {
    if (!req.method == 'GET') res.status(405).json({ error: 'Only GET permitted' });

    const dbConn = await mysql.createConnection(dbConfig);

    try {
        const query = 'SELECT * FROM posts';
        const values = [];
        const [data] = await dbConn.execute(query, values);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
