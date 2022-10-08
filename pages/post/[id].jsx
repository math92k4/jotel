import mysql from 'mysql2/promise';
import { verify } from 'jsonwebtoken';
import { dbConfig } from '../../g';
import { SinglePost } from '../../components/posts/SinglePost';


export default function Post({ userId, post, comments }) {
    console.log(userId)

    return (<main>
                <header>
                    {!userId && <a onClick={() => Router.push("sign-up")} >Sign up</a>}
                    <img src="../svgs/jotel.svg" alt="Jotel logo" />
                    {!userId && <a onClick={() => Router.push("sign-in")} >Sign in</a>}
                </header>
                <SinglePost userId={userId} post={post}/>
            </main>)
}

export async function getServerSideProps(context) {
    const cookie = context.req.cookies.jwt;
    let userId = 0;
    try {
        const decodedJwt = verify(cookie, process.env.JWT_SECRET);
        userId = decodedJwt.uid;
    } catch (err) {}


    const postId = context.query.id;

    // GET posts
    const dbConn = await mysql.createConnection(dbConfig);
    try {
        const postQuery = 'CALL SELECT_single_post(?,?)';
        const [[[post]]] = await dbConn.execute(postQuery, [postId, userId]);

        const commentQuery = 'SELECT * FROM comments WHERE fk_post_id = ? LIMIT 15';
        const [comments] = await dbConn.execute(commentQuery, [postId]);

        return { 
            props: {
                userId,
                post,
                comments,
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




    // const postId = context.query.id;
    // return {
    //     props: {
    //         post: 'test1',
    //         comments: 'test',
    //     },
    // };
}
