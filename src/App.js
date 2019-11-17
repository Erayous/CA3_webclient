import React, {useState, useEffect} from "react";
import facade from "./apiFacade";

import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  useParams,
  useRouteMatch
} from "react-router-dom";

function LogIn({login}) {
	const init = {username: "", password: ""};
	const [loginCredentials, setLoginCredentials] = useState(init);

	const performLogin = (evt) => {
		evt.preventDefault();
		login(loginCredentials.username, loginCredentials.password);
	}
	const onChange = (evt) => {
		setLoginCredentials({...loginCredentials, [evt.target.id]: evt.target.value})
	}

	return (
		<div>
      <div className="card">
        <div className="card-container">
        <h2>Login</h2>
        <p className="notLoggedInP">For at kunne bruge alle vores REST-endpoints bedes du logge ind.</p>
        <form onChange={onChange}>
          <br/>
          <input placeholder="Brugernavn" id="username"/>
          <br/>
          <input placeholder="Adgangskode" id="password"/>
          <br></br>
          <button className="btn btn-warning btn-cons" onClick={performLogin}>Login</button>
        </form>
        </div>
      </div>
		</div>
	)

}

function LoggedIn({user}) {
	const [dataFromServer, setDataFromServer] = useState("Loading...")

	useEffect(() => {
		facade.fetchData(user).then(data => setDataFromServer(data.msg));
	}, [user])

	return (
		<div>
			{dataFromServer}
		</div>
	)
}

const FetchData = ({user}) => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    facade.fetchData_API(user).then(data => setData(data));
  }, [user]);

  return (
    <div>
      <h2>Star Wars API:</h2>
      <p>{Data.map((data, index) => <li key={index}>{data}</li>)}</p>
    </div>
  )
}

const Header = () => {
  return (
    <div>
          <ul className="header">
            <li><NavLink exact to="/">Startside</NavLink></li>
            <li><NavLink exact to="/api">API</NavLink></li>
          </ul>
    </div>
  )
}


export default function App(){
  return (
    <Router>
      <div>

      <Header/>
        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/api">
            <API/>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

function Home() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState("");  

  const logout = () => {
		facade.logout();
		setLoggedIn(false)
	}
	const login = (user, pass) => {
		facade.login(user, pass)
			.then(res => setLoggedIn(true));
    setUser(user);

  }
  const token = localStorage.getItem("jwtToken");
  
  return (
    
    <div>
      <h2>Velkommen til CA3</h2>
      <hr/>
      <p>I denne CA3 opgave, vil du kunne benytte vores menu til at navigere rundt i vores endpoints.</p>

      {!loggedIn ? (<LogIn login={login} />) :
        (<div>
          <p className="LoggedInP">Du er nu logget ind</p>
          <hr/>
          <p>Serveren svarede: </p>
          <p style={{fontSize: "12px"}}><LoggedIn user={user} /></p>
          
          {/* <p style={{fontSize: "12px"}}>Token: {token}</p> */}

          <button onClick={logout}>Log ud</button>
        </div>)}
      
    </div>
  );
}

function API(){

  return (
    <FetchData />
  )
}
