import { memo, useState } from 'react';
import { epochToTime } from '../../g';
import Router from 'next/router';

const Post = memo(({ post, userId }) => {
    const [likes, setLikes] = useState(post.post_likes);
    const [isLiked, setIsLiked] = useState(false);

    async function likePost(event) {
        const btn = event.target;
        const postId = btn.parentElement.parentElement.dataset.post_id;
        let likeType = false;
        if (btn.dataset.like) likeType = true;

        const data = {
            user_id: userId,
            post_id: postId,
            like_type: likeType,
        };
        const conn = await fetch('/api/post-likes', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const res = await conn.json();

        if (likeType) setLikes(likes + 1);
        else setLikes(likes - 1);
        setIsLiked(true);
    }

    return (
        <article data-post_id={post.post_id}>
            <div onClick={() => Router.push('/post/' + post.post_id)}>
                <p className="time">{epochToTime(post.post_iat)}</p>
                <p className="post_text">{post.post_text}</p>
            </div>
            <div className={`likes ${isLiked || userId ? 'disabled' : ''}`}>
                <button data-like="true" onClick={!isLiked && userId ? likePost : undefined}>
                    +
                </button>
                <p>{likes}</p>
                <button onClick={!isLiked && userId ? likePost : undefined}>-</button>
            </div>
        </article>
    );
});

export default Post;
