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

    this.auth(this);
  }


  auth(menu) {
    axios({
      method: 'post',
      url: '/auth', 
      headers: {
        "Access-Control-Allow-Origin": '*',
      },
      data: {
        username: "user1",
        password: "abcxyz"
      }
    }).then(function (response) {
      console.log(response);
      menu.setState({token: response.data.access_token});
    }).catch(function(error) {
      console.log(error);
    })
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
      return (<h1>Implement me</h1>)
    }
  }
}

// ========================================

ReactDOM.render(
  <Menu />,
  document.getElementById('root')
);

