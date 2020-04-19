import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-input-range/lib/css/index.css'
import Games from './list.js';
import MyGames from './add.js';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };

    this.credentials = {
      login: "",
      password: ""
    }

    this.auth = this.auth.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  auth(user, password) {
    let menu = this;
    axios({
      method: 'post',
      url: '/auth', 
      headers: {
        "Access-Control-Allow-Origin": '*',
      },
      data: {
        username: user,
        password: password
      }
    }).then(function (response) {
      menu.setState({token: response.data.access_token});
    }).catch(function(error) {
      console.log(error);
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.auth(this.credentials.login.value, this.credentials.password.value);
    return false;
  }


  render() {
    if (this.state.token !== "") {
    return (
    <div>
      <Router>
       <div>
          <nav className="navbar is-link" role="navigation" aria-label="main navigation">
            <div className="navbar-menu">
              <div className="navbar-start">
                <Link to="/" className="navbar-item is-spaced" > 
                  List
                </Link>
                <Link to="/my-games" className="navbar-item is-spaced">
                  MyGames
                </Link>
                <Link to="/meeting" className="navbar-item is-spaced">
                  Meeting
                </Link>
              </div>
              <div className="navbar-end">
                <Link to="/profile" className="navbar-item is-spaced">
                  Profile
                </Link>
              </div>
            </div>
          </nav>
        </div>
        <Switch>
          <Route exact path="/">
            <Games token={this.state.token} />
          </Route>
          <Route path="/my-games">
            <MyGames token={this.state.token} />
          </Route>
          <Route path="/meeting">
            <h1>Meeting</h1>
          </Route>
          <Route path="/profile">
            <h1>Profile</h1>
          </Route>
        </Switch>
      </Router>
    </div>
    )
    } else {
      return (
     <div className={"modal " + (this.state.token ? "": "is-active")}>
      <div className="modal-background"></div>
      <div className="login-card modal-card">
        <div className="login-box box">
            <form onSubmit={this.handleSubmit}>
              <div className="login-input">
                <input className="input is-rounded" type="text" placeholder="Login" ref={(c) => this.credentials.login = c} />
              </div>
              <div className="login-input">
                <input className="input is-rounded" placeholder="Password" type="password" ref={(c) => this.credentials.password = c} />
              </div>
              <div className="login-submit">
                <button onClick={this.handleSubmit}  className="button is-link">Login</button>
              </div>
            </form>
        </div>
      </div>
    </div> 
      )
    }
  }
}

// ========================================

ReactDOM.render(
  <Menu />,
  document.getElementById('root')
);

