import { useState } from 'react'
import './App.css'
import axios from 'axios'

const serverURL = "http://localhost:3000";

function App() {
    type UsersLogin = {
        name: string,
        password: string,
    }

    const [login, setLogin] = useState<UsersLogin>({
        // telling Typescript what shape the state should have -> passing <UsersLogin> as a type parameter
        name: " ",
        password: " ",
    })


    const loginSubmit = async (e) => {
        e.preventDefault();
        console.log('ged')
        console.log(login)
        const response = await axios.post(serverURL + "/login", login);
        // post login to the backend and then store the response in a variable--> so i can use it 
        console.log(response)

    }

    return (
        <>
            <form onSubmit={loginSubmit}>
                <div>

                    Name
                    <input value={login.name} onChange={(e) => setLogin(prevDetails => ({ ...prevDetails, name: e.target.value }))} />
                </div>
                <div>
                    Password
                    <input value={login.password} onChange={(e) => setLogin(prevDetails => ({ ...prevDetails, password: e.target.value }))} />
                </div>
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default App
