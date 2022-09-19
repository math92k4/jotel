import PostContainer from '../components/posts/PostContainer.jsx';
import { verify } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { dbConfig } from '../g';

export default function Index({ initPosts, userId }) {

    // DOM
    return (
        <>
        <main>
            <header><img src="svgs/jotel.svg" alt="Jotel logo" /></header>
            <section className='post_section'>
                {!userId && <h1>Sign up</h1>}
                <PostContainer userId={userId} initPosts={initPosts} />
            </section>
        </main>
        </>
    );
}

// SSR
export async function getServerSideProps(context) {
    const cookie = context.req.cookies.jwt;
    let userId = 0;
    try {
        const decodedJwt = verify(cookie, process.env.JWT_SECRET);
        userId = decodedJwt.uid;
    } catch (err) {}

    // GET posts
    const dbConn = await mysql.createConnection(dbConfig);
    try {
        const query = 'CALL SELECT_posts(?,?)';
        const [[initPosts]] = await dbConn.execute(query, [userId, 0]);
        console.log(initPosts)
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
