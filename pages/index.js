import Post from '../components/post';
import { useState } from 'react';
import { verify } from 'jsonwebtoken';

export default function Home({ data }) {
    const [posts, setPosts] = useState(data);
    const [postOffset, setPostOffset] = useState(0);
    const [moreToLoad, setMoreToLoad] = useState(true);

    // Load more posts from server
    async function fetchPostChunk() {
        setPostOffset(postOffset + 15);
        const conn = await fetch('/api/posts-get');
        const newOffset = await conn.json();
        if (newOffset.length < 15) setMoreToLoad(false);
        setPosts(posts.concat(newOffset));
    }

    // DOM
    return (
        <main>
            {posts.map((post, idx) => {
                return <Post post={post} key={idx} />;
            })}

            {moreToLoad && <button onClick={() => setPostOffset(fetchPostChunk())}>MORE</button>}
            {!moreToLoad && <p>This is the end...</p>}
        </main>
    );
}

// SSR
export async function getServerSideProps(context) {
    const cookie = context.req.cookies.jwt;

    // GET posts
    const url = 'http://localhost:3000/api/posts-get';
    const conn = await fetch(url, {
        method: 'GET',
    });
    const data = await conn.json();

    try {
        const decodedJwt = verify(cookie, process.env.JWT_SECRET);
    } catch (err) {}

    return {
        props: {
            data,
        },
    };
}
