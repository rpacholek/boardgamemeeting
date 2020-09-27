import React from 'react';
import ReactDOM from 'react-dom';
import {DelayInput} from 'react-delay-input';
import List from 'react-list-select';
import axios from 'axios';
import StatusMap from './list/status_map.js';
import './list-style.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function GameDisplay(props) {
  return (
    <div>
        <div>
          <img src={props.image} />
        </div>
        <p>{props.name || "Find the game"}</p>
    </div>
  )
}

class AddGame extends React.Component {
  constructor(props) {
    super(props);
    this.clear_state = {
      "selected": {
        "name": false,
        "image": "",
        "id": 0
      },
      "selected_id": -1,
      "status": StatusMap.defaultDBMap(),
      "found": [],
      "isSearching": false,
    }

    this.state = {...this.clear_state};
    this.toggleStatus = this.toggleStatus.bind(this);
    this.addGame = this.addGame.bind(this);

    this.search_status_ref = React.createRef();
  }

  search(name) {
    if (name) {
      this.setState({
        isSearching: true,
      })
      axios({
        method: 'POST',
        url: '/api/search',
        headers: {
          "Access-Control-Allow-Origin": '*',
          "Authorization": "JWT " + this.props.token,
        },
        data: {
          search: name,
        }
      }).then( response => {
        console.log(response.data);
        this.setState({
          found: response.data,
          isSearching: false,
          selected_id: -1,
        })
      }).catch( error => {
        console.log(error);
        this.setState({
          isSearching: false,
        })
      })
    }
  }

  addGame(){
    if (this.state.selected.id > 0) {
      axios({
          method: 'POST',
          url: '/api/user/game',
          headers: {
            "Access-Control-Allow-Origin": '*',
            "Authorization": "JWT " + this.props.token,
          },
          data: {
            id: this.state.selected.id,
            name: this.state.selected.name,
            status: this.state.status 
          }
        }).then(response => {
          this.props.refresh();
        }).catch( error => {
          console.log(error);
        })
      this.setState({...this.clear_state});
    }
  }




  toggleStatus(key){
    let statuses = this.state.status;
    statuses[key] = ! statuses[key];
    this.setState({status: statuses});
  }

  render(){
    let stats = Object.keys(this.state.status).map( (key) => 
      <Checkbox label={StatusMap.displayName(key)} value={this.state.status[key]} onClick={() => this.toggleStatus(key)} />
    )

    let itemList = [];
    this.state.found.forEach(o => {itemList.push(o.name)});
    let selected = [];
    if (this.state.selected_id != -1){
      selected.push(this.state.selected_id);
    }

    return (
      <div>
     <div className="columns">
        <div className="column">
          <div>
            <DelayInput
              minLength={2}
              delayTimeout={1000}
              onChange={event => this.search(event.target.value)} />
            <span className={"icon is-medium "+(this.state.isSearching?"":"is-hidden")} ref={this.search_status_ref}>
              <span className="fa-stack">
                  <AiOutlineLoading3Quarters className="fas fa-spinner fa-pulse spinner" />
              </span>
            </span>
          </div>

          <div>
            <List
              items={itemList}
              multiple={false}
              selected={selected}
              onChange={(selected) => {this.setState({selected: this.state.found[selected], selected_id: selected})}} />
          </div>
        </div>

        <div className="column">
          <GameDisplay name={this.state.selected.name} image={this.state.selected.image} /> 
        </div>

        <div className="column">
          {stats} 
        </div>
      </div>
      <button onClick={() => this.addGame()} >Submit</button>
      </div>
    )
  }
}

function Checkbox(props) {
  const value = props.value;
  return (
      <div className="column">
        <input type="checkbox" checked={value} onClick={props.onClick} /><label className="game-list-label">{props.label}</label>
      </div>
  )
}

class GameListItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      game: this.props.game,
      status: this.props.game.status,
    }

    this.updateGame = this.updateGame.bind(this);
    this.removeGame = this.removeGame.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }
  updateGame(){
        axios({
          method: 'PUT',
          url: '/api/user/game/' + this.state.game.info.id,
          headers: {
            "Access-Control-Allow-Origin": '*',
            "Authorization": "JWT " + this.props.token,
          },
          data: {
            status: this.state.status 
          }
        }).then(response => {
          this.props.refresh();
        }).catch( error => {
          console.log(error);
        })
  }

  removeGame(id){
        axios({
          method: 'DELETE',
          url: '/api/user/game/' + this.state.game.info.id,
          headers: {
            "Access-Control-Allow-Origin": '*',
            "Authorization": "JWT " + this.props.token,
          }
        }).then(response => {
          this.props.refresh();
        }).catch( error => {
          console.log(error);
        })
  }

  updateStatus(key, value) {
    let s = this.state.status;
    s[key] = value;
    this.setState(s);
    this.updateGame();
  }

  render() {
    const game = this.state.game;
    let stats = (<h1>No games</h1>);
    if (this.state.game && this.state.status) {
      stats = Object.keys(this.state.status).map( (key) => 
        <Checkbox label={StatusMap.displayName(key)} value={this.state.status[key]} onClick={(event) => {this.updateStatus(key, event.target.checked)}} />
      )
    }
    return (
      <div className="mygame-list columns">
        <div className="column is-2">
          <img src={this.props.game.info.image} className="game-list-minature" />
        </div>
        <div className="column  is-4">
          {this.props.game.info.name}
        </div>
        <div className="column is-4">
            {stats}
        </div>
        <div className="column is-1">
          <button onClick={() => this.removeGame()}>Remove</button>
        </div>
      </div>
    )
  }
}

class GameList extends React.Component {
 

  render() {
    const games = this.props.render_games;
    const gameList = games.map((game) =>
      <div>
      <GameListItem token={this.props.token} refresh={this.props.refresh} game={game} /> 
      <hr />
      </div>
    );

    return (
      <section className="game">
        {gameList}
      </section>
    )
  }
}

export default
class MyGames extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      render_games: [],
      view: true,
    }
    
    

    this.displayGames = this.displayGames.bind(this);
    this.updateGames = this.updateGames.bind(this);

    this.updateGames();
  }

  updateGames() {
    axios({
          method: 'GET',
          url: '/api/user/games',
          headers: {
            "Access-Control-Allow-Origin": '*',
            "Authorization": "JWT " + this.props.token,
          }
        }).then( response => {
           this.setState({
            games: response.data,
            render_games: response.data,
          })
        }).catch( error => {
          console.log(error);
        })
  }

  displayGames(games) {
    this.setState({
      render_games: games,
    })
  }

  render() {
    return (
      <div className="centered">
        <h1>The games</h1>
        <AddGame token={this.props.token} refresh={() => this.updateGames()}/>
        <hr />
        <GameList token={this.props.token} refresh={() => this.updateGames()} render_games={this.state.render_games} /> 
      </div>
    );
  }
}
