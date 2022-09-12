import Post from '../components/post';
import { useState } from 'react';
import { verify } from 'jsonwebtoken';

export default function Home({ data }) {
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

    // GET posts
    const url = 'http://localhost:3000/api/posts';
    const conn = await fetch(url, {
        method: 'GET',
    });
    const data = await conn.json();
    console.log(data);

    try {
        const decodedJwt = verify(cookie, process.env.JWT_SECRET);
    } catch (err) {}

    return {
        props: {
            data,
        },
    };
}
