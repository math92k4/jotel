import { useState } from 'react';

const PostModal = ({ posts, setPosts }) => {
    const [postModal, setPostModal] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const postText = form.post_text.value;
        // TODO: Validate text

        const data = {
            post_text: postText,
        };

        const conn = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await conn.json();
        form.reset();
        setPostModal(false);
        setPosts([res.post, ...posts]);
        window.scrollTo(0, 0);
    }

    return (
        <>
            {postModal && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <input hidden name="user_id" type="text"></input>
                        <textarea name="post_text" placeholder="Write post here"></textarea>
                        <button>Post</button>
                    </form>
                    <button onClick={() => setPostModal(false)}>X</button>
                </div>
            )}
            {!postModal && <button onClick={() => setPostModal(true)}>+</button>}
        </>
    );
};
export default PostModal;
