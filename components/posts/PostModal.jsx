import { useEffect, useState } from 'react';

export function PostModal ({ posts, setPosts }) {
    const [postModal, setPostModal] = useState(false);

    useEffect(() => {
        if (postModal) {
            document.querySelector("textarea").focus();
        }
    },[postModal])

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
                <div className='post_modal_bg'>
                    <div className='post_modal'>
                        <form onSubmit={handleSubmit}>
                            <textarea required name='post_text' rows='4' minLength={1} maxLength={150} placeholder="Write post here"></textarea>
                            <button>Post</button>
                        </form>
                        <button className='close_modal' onClick={() => setPostModal(false)}>✕</button>
                    </div>
                </div>
            )}
            {!postModal && <button className='modal_toggler' onClick={() => setPostModal(true)}>+</button>}
        </>
    );
};
