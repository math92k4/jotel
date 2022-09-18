import Post from './Post.jsx';
import { useEffect, useState } from 'react';
import {PostModal} from "./PostModal"

export default function PostContainer({ userId, initPosts }) {
    const [posts, setPosts] = useState(initPosts);
    const [postOffset, setPostOffset] = useState(15);
    const [moreToLoad, setMoreToLoad] = useState(posts.length == 15 ? true : false);


    // FETCH chunk of posts using offset
    async function fetchPostChunk() {
        const conn = await fetch(`/api/posts?ofs=${postOffset}`, {
            method: 'GET',
        });
        const newOffset = await conn.json();
        if (newOffset.length < 15) setMoreToLoad(false);
        setPosts([...posts, ...newOffset]);
    }

    // Updates offset when posts added to DOM
    useEffect(() => {
        setPostOffset(posts.length);
    }, [posts]);

    // DOM
    return (
        <div id="post_container">
            {posts.map((post) => {
                return <Post userId={userId} post={post} key={post.post_id} />;
            })}
            {userId && <PostModal posts={posts} setPosts={setPosts} />}
            {moreToLoad ? <button className='load_more' onClick={() => fetchPostChunk()}>MORE</button> : <p>This is the end...</p>}
        </div>
    );
}
