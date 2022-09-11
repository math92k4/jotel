import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

export default function SignOut() {
    return (
        <>
            <h1>Redirect</h1>
            <p>Might not be the right way :pPpPpPpp</p>
        </>
    );
}

export async function getServerSideProps(context) {
    const theJwt = context.req.cookies.jwt;

    // No jwt = end
    if (!theJwt) {
        return {
            redirect: {
                permanent: false,
                destination: '/sign-in',
            },
        };
    }

    try {
        // Decode jwt
        const decodedJwt = verify(theJwt, process.env.JWT_SECRET);
        const cookieData = {
            user_id: decodedJwt.uid,
            session_id: decodedJwt.sid,
        };

        // Call api to delete jwt from db
        const conn = await fetch('http://localhost:3000/api/sign-out', {
            method: 'DELETE',
            body: JSON.stringify(cookieData),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await conn.json();

        // Error
    } catch (err) {
        console.log(err.message);

        // Delete cookie and redirect no matter what
    } finally {
        context.res.setHeader(
            'Set-Cookie',
            cookie.serialize('jwt', '', {
                maxAge: -1,
                path: '/',
            })
        );

        return {
            redirect: {
                permanent: false,
                destination: '/sign-in',
            },
        };
    }
}
