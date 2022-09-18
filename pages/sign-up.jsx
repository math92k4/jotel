import Router from 'next/router';

export default function SignUp() {
    // Submition
    async function handleSubmit(event) {
        event.preventDefault();
        //Json from formdata
        const form = event.target;
        const data = {
            user_name: form.user_name.value,
            user_password: form.user_password.value,
        };

        // Post to api
        const conn = await fetch('/api/sign-up', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Error handling
        if (!conn.status == 200) {
            console.log('error happened');
            return;
        }

        // Succes
        Router.push('/');
    }

    // DOM
    return (
        <main>
            <form className='sign_form' onSubmit={handleSubmit}>
                <label>
                    Username
                    <input type="text" name="user_name" id="user_name" />
                </label>
                <label>
                    Username
                    <input type="password" name="user_password" id="user_password" />
                </label>
                <button>Sign up</button>
            </form>
        </main>
    );
}
