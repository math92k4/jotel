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
            <div className='centerize'>
                <form className='sign_form' onSubmit={handleSubmit}>
                    <h1>Sign up</h1>
                    <div>
                        {/* <label htmlFor='user_name'>Username</label> */}
                        <input placeholder='Username' required minLength="2" pattern='[A-Za-z]{2,20}' maxLength="20" type="text" name="user_name" id="user_name" />
                        <p>Must contain 2-20 characters (a-z)</p>
                    </div>
                    <div>   
                        {/* <label htmlFor='user_password'>Username</label> */}
                        <input placeholder='Password' required minLength="8" pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}' maxLength="20" type="password" name="user_password" id="user_password" />
                        <p>Uppercase letters: A-Z. lowercase letters: a-z, numbers: 0-9.</p>
                    </div>
                    <button>Sign up</button>
                </form>
            </div>
        </main>
    );
}
