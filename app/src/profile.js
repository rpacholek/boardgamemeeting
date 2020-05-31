import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      invitations: [],
      init: false,
    };

    this.list_invitations = this.list_invitations.bind(this);
    this.list_friends = this.list_friends.bind(this);
    this.delete_friend = this.delete_friend.bind(this);
    this.delete_invitation = this.delete_invitation.bind(this);
    this.accept_invitation = this.accept_invitation.bind(this);
    this.invite = this.invite.bind(this);

    if (!this.state.init) {
      this.setState({init: true});
      this.list_invitations();
      this.list_friends();
    }

    this.new_password_field = null;
    this.invite_field = null;
  }

  list_invitations() {
    axios({
      method: 'GET',
      url: '/api/user/invitations',
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Authorization": "JWT " + this.props.token,
      }
    }).then( response => {
      this.setState({
        invitations: response.data
      })
    })
    console.log("list_invitations");
  }

  list_friends() {
    axios({
      method: 'GET',
      url: '/api/user/friends',
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Authorization": "JWT " + this.props.token,
      }
    }).then( response => {
      console.log("ASDASA")
      console.log(response.data)
      this.setState({
        friends: response.data
      })
    })
    console.log("list_friends");
  }

  delete_friend(name) {
    axios({
      method: 'DELETE',
      url: '/api/user/friends/'+name,
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Authorization": "JWT " + this.props.token,
      }
    }).then( response => {
      this.list_friends();
    })
    console.log("delete_friend");
  }

  delete_invitation(name) {
    axios({
      method: 'DELETE',
      url: '/api/user/invitations/'+name,
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Authorization": "JWT " + this.props.token,
      }
    }).then( response => {
      this.list_invitations();
    })
    console.log("delete_invitation");
  }

  accept_invitation(name) {
    axios({
      method: 'POST',
      url: '/api/user/invitations/'+name,
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Authorization": "JWT " + this.props.token,
      }
    }).then( response => {
      this.list_friends();
      this.list_invitations();
    })
    console.log("accept_invitation");
  }

  invite(name) {
    if (name) {
      axios({
        method: 'POST',
        url: '/api/user/invitations',
        headers: {
          "Access-Control-Allow-Origin": '*',
          "Authorization": "JWT " + this.props.token,
        },
        data: {
          friend: name.value
        }
      }).then( response => {
        this.list_invitations();
      })
    console.log("invite");
    }
  }

  change(password_field) {
    password_field.disabled = true;
    axios({
      method: 'POST',
      url: '/api/user/password',
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Authorization": "JWT " + this.props.token,
      },
      data: {
        password: password_field.value
      }
    }).then( response => {
    })
  }

  render() {
    let friends = this.state.friends.map(friend => 
      <tr>
        <td>{friend}</td>
        <td>
          <button onClick={_ => this.delete_friend(friend)}>D</button>
        </td>
      </tr>
    )

    let invitations = this.state.invitations.map(inv =>
      <tr>
        <td>{inv}</td>
        <td><button onClick={_ => this.delete_invitation(inv)}>N</button></td>
        <td><button onClick={_ => this.accept_invitation(inv)}>Y</button></td>
      </tr>
    )

    return (
      <div className="profile-box">
        <div>
          New password:
          <input type="password" ref={c => this.new_password_field = c} />
          <button onClick={_ => this.change(this.new_password_field)}>Change</button>
        </div>
        <div className="columns">
          <div className="column">
            <h1>Friends</h1>
            <table>
              <thead>
                <tr>
                  <th>Friends</th>
                  <th>No more</th>
                </tr>
              </thead>
              <tbody>
                {friends}
              </tbody>
            </table>
          </div>
          <div className="column">
            <h1>Invitations</h1>
            <table>
              <thead>
                <tr>
                  <th>Invitations</th>
                  <th>No</th>
                  <th>Yes</th>
                </tr>
              </thead>
              <tbody>
                {invitations}
              </tbody>
            </table>
            <input ref={c => this.invite_field = c} />
            <button onClick={_ => this.invite(this.invite_field)}>Invite</button>
          </div>
        </div>
      </div>
    )
  }
}
