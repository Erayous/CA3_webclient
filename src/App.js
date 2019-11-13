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
			<h2>Data Received from server</h2>
			<h3>{dataFromServer}</h3>
		</div>
	)
}

const Header = () => {
  return (
    <ul className="header">
      <li>
        <NavLink exact to="/">Startside</NavLink>
      </li>
      <li>
        <NavLink to="/topics">REST 1</NavLink>
      </li>
      <li>
        <NavLink to="/rest2">REST 2</NavLink>
      </li>
      <li>
        <NavLink to="/rest3">REST 3</NavLink>
      </li>
    </ul>
  )
}

export default function NestingExample(props) {
  const {info} = props;
  return (
    <Router>
      <div>
      <Header />
        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/topics">
            <Topics info={info}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
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

  return (
    <div>
      <h2>Velkommen til CA3</h2>
      <hr/>
      <p>I denne CA3 opgave, vil du kunne benytte vores menu til at navigere rundt i vores endpoints.</p>

      {!loggedIn ? (<LogIn login={login} />) :
        (<div>
          <LoggedIn user={user} />
          <p className="LoggedInP">Du er nu logget ind</p>
          <button onClick={logout}>Log ud</button>
        </div>)}
      
    </div>
  );
}

function Topics(props) {
  const {info} = props;

  let { path, url } = useRouteMatch()
  const x = useRouteMatch()
  console.log("-->", x)

  const listItems = info.map(t => <li key={t.id}><NavLink to={`${url}/${t.id}`}>{t.title}</NavLink></li>)

  return (
    <div>
      <h2>Topics</h2>
      <p>Count: {info.length}</p>
      <ul>
        {listItems}
      </ul>

      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:topicId`}>
          <Topic info={info}/>
        </Route>
      </Switch>
    </div>
  );
}

function Topic({info}) {

  let { topicId } = useParams();
  const topic = info.find((t) => t.id === topicId);
  

  return (
    <div>
      <h3>{topicId}</h3>
      <p>{topic.title}</p>
      <p>{topic.info}</p>
    </div>
  );
}
