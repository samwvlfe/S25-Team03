import React from 'react';

export default function Login() {
    return (
        <div class="account-form">
            <form>
                <label>Username:</label>
                <br />
                <input id="username" type="text" />
                <br />
                <label>Password:</label>
                <br />
                <input id="password" type="text" />
                <br />
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}