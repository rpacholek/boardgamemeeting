import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-input-range/lib/css/index.css'
import Games from './list.js';
import MyGames from './add.js';
import axios from 'axios';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      website: 1,
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
    console.log(user + " " + password)
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
      console.log(response);
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
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item {this.state.website == 0 && 'is-active'}" 
              onClick={()=>this.setState({website:0})}>
            List
          </a>
        </div>
        <div className="navbar-start">
          <a className="navbar-item {this.state.website == 1 && 'is-active'}"
              onClick={()=>this.setState({website:1})}>
            MyGames
          </a>
        </div>
        <div className="navbar-start">
          <a className="navbar-item" onClick={()=>this.setState({website:2})}>
            Meeting
          </a>
        </div>
      </div>
    </nav>
    <div>
      {this.state.website == 0 && <Games token={this.state.token} />}
      {this.state.website == 1 && <MyGames token={this.state.token} />}
      {this.state.website == 2 && <h1>Meeting</h1>}
    </div>
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

