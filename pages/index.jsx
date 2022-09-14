import { useState } from 'react';
import PostContainer from '../components/posts/PostContainer.jsx';
import PostModal from '../components/PostModal.jsx';
import { verify } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { dbConfig } from '../g';

export default function Index({ initPosts, userId }) {
    const [posts, setPosts] = useState(initPosts);

    // DOM
    return (
        <main>
            <section>
                {!userId && <h1>Sign up</h1>}
                <PostContainer userId={userId} posts={posts} setPosts={setPosts} />
                {userId && <PostModal posts={posts} setPosts={setPosts} />}
            </section>
        </main>
    );
}

// SSR
export async function getServerSideProps(context) {
    const cookie = context.req.cookies.jwt;
    let userId = false;
    try {
        const decodedJwt = verify(cookie, process.env.JWT_SECRET);
        userId = decodedJwt.uid;
    } catch (err) {}

    // GET posts
    const dbConn = await mysql.createConnection(dbConfig);
    try {
        const query = 'SELECT * FROM `posts` ORDER BY post_iat DESC LIMIT 15';
        const [initPosts] = await dbConn.execute(query);
        return {
            props: {
                initPosts,
                userId,
            },
        };
    } catch (error) {
        return {
            props: {
                error: 'Server error',
            },
        };
    } finally {
        dbConn.destroy();
    }
}
