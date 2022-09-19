import { memo, useState } from 'react';
import { epochToTime } from '../../g';
import Router from 'next/router';
import { useRouter } from 'next/router';

const Post = memo(({ post, userId }) => {
    const [likes, setLikes] = useState(post.post_likes);
    const [isLiked, setIsLiked] = useState(post.is_like);


    async function likePost(event) {
        const btn = event.target;
        const postId = btn.parentElement.dataset.post_id;
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
        setIsLiked(likeType ? 1 : 0);
    }

    return (
        <article className='post'>
            <div className='top_bar'>
                <p className='time'>{epochToTime(post.post_iat)} <span></span></p>
            </div>
            <div className='flexer'>
                <div className='stretcher' onClick={() => Router.push('/post/' + post.post_id)}>
                    <p className="post_text" >{post.post_text}</p>
                    <div className='bottom_bar'>
                        <p className='comments'>{post.post_comments}</p>
                    </div>
                </div>
                <div data-post_id={post.post_id} className={`likes ${isLiked == 1 || isLiked == 0 || !userId ? 'disabled' : ''}`}>
                    <button className={`up ${isLiked == 0 ? 'hollow' : ''}`} data-like="true" onClick={!isLiked && userId ? likePost : undefined}>
                    &#8963;
                    </button>
                    <p>{likes}</p>
                    <button className={`down ${isLiked == 1 ? 'hollow' : ''}`} onClick={!isLiked && userId ? likePost : undefined}>&#8963;</button>
                </div>
            </div>
        </article>
    );
});

export default Post;
