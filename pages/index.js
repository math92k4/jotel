import Post from '../components/post';
import { useState } from 'react';
import { verify } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { dbConfig } from '../g';

export default function Home({ data }) {
    // TODO handle db-conn error
    const [posts, setPosts] = useState(data);
    const [postOffset, setPostOffset] = useState(15);
    const [moreToLoad, setMoreToLoad] = useState(data.length == 15 ? true : false);

    // Load more posts from server
    async function fetchPostChunk() {
        const conn = await fetch(`/api/posts?ofs=${postOffset}`, {
            method: 'GET',
        });
        const newOffset = await conn.json();
        if (newOffset.length < 15) setMoreToLoad(false);
        setPosts(posts.concat(newOffset));
        setPostOffset(postOffset + 15);
    }

    // DOM
    return (
        <main>
            <section>
                {posts.map((post) => {
                    return <Post post={post} key={post.post_id} />;
                })}
                {moreToLoad ? <button onClick={() => fetchPostChunk()}>MORE</button> : <p>This is the end...</p>}
            </section>
        </main>
    );
}

// SSR
export async function getServerSideProps(context) {
    const cookie = context.req.cookies.jwt;
    try {
        const decodedJwt = verify(cookie, process.env.JWT_SECRET);
    } catch (err) {}

    // GET posts

    const dbConn = await mysql.createConnection(dbConfig);
    try {
        const query = 'SELECT * FROM posts LIMIT 15';
        const [data] = await dbConn.execute(query);
        console.log(data);
        return {
            props: {
                data,
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
