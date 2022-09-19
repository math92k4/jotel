import Router from 'next/router';

export default function SignIn() {
    async function handleSubmit(event) {
        event.preventDefault();

        //Json from formdata
        const form = event.target;
        const data = {
            user_name: form.user_name.value,
            user_password: form.user_password.value,
        };

        // Post to api
        const conn = await fetch('/api/sign-in', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(conn.status);

        // Error handling
        if (conn.status !== 200) {
            const res = await conn.json();
            console.log(res);
            return;
        }

        // Succes
        Router.push('/');
    }

    // DOM
    return (
        <main className='orange'>
            <div className='centerize'>
                <form className='sign_form' onSubmit={handleSubmit}>
                    <h1>Sign in</h1>
                    <div>
                        <label htmlFor="user_name">Username</label>
                        <input required type="text" pattern='[A-Za-z]{2,20}' minLength="2" maxLength="20" name="user_name" id="user_name" />
                    </div>
                    <div>
                        <label htmlFor="user_password">Password</label>
                        <input required type="password" pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}' minLength="8" maxLength="20" name="user_password" id="user_password" />
                    </div>
                    <button>Sign in</button>
                </form>
            </div>
        </main>
    );
}
