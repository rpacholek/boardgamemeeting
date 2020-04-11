import React from 'react';
import ReactDOM from 'react-dom';
import {DelayInput} from 'react-delay-input';
import List from 'react-list-select';
import axios from 'axios';
import './list-style.css';

function GameDisplay(props) {
  console.log(props)
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
      "status": {
        "possesed": true,
        "in_delivery": false,
        "borrowed": false,
        "on_radar": false,
        "new": false,
      },
      "found": [],
    }
    this.state = {...this.clear_state};
    this.toggleStatus = this.toggleStatus.bind(this);
    this.addGame = this.addGame.bind(this);
  }

  search(name) {
    if (name) {
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
        console.log(response)
        this.setState({
          found: response.data
        })
      }).catch( error => {
        console.log(error);
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
        }).catch( error => {
          console.log(error);
        })
      this.setState({...this.clear_state});
      this.props.onSubmit();
    }
  }

  toggleStatus(key){
    let statuses = this.state.status;
    statuses[key] = ! statuses[key];
    this.setState({status: statuses});
  }

  render(){
    let stats = Object.keys(this.state.status).map( (key) => 
      <Checkbox label={key} value={this.state.status[key]} onClick={() => this.toggleStatus(key)} />
    )

    let itemList = [];
    this.state.found.forEach(o => {itemList.push(o.name)});
    let selected = [];
    if (this.state.selected.name){
      selected.push(itemList.indexOf(this.state.selected.name));
    }

    return (
      <div>
     <div className="columns">
        <div className="column">
          <DelayInput
            minLength={2}
            delayTimeout={1000}
            onChange={event => this.search(event.target.value)} />

          <div>
            <List
              items={itemList}
              multiple={false}
              selected={selected}
              onChange={(selected) => {this.setState({selected: this.state.found[selected]})}} />
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
  return (
      <div className="column">
        <input type="checkbox" checked={props.value} onClick={props.onClick} /><label className="game-list-label">{props.label}</label>
      </div>
  )
}

class GameListItem extends React.Component {

  render() {
    const game = this.props.game;
    let stats = (<h1>No games</h1>);
    if (game && game.status) {
      stats = Object.keys(game.status).map( (key) => 
        <Checkbox label={key} value={game.status[key]} />
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
          <button>Remove</button>
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
      <GameListItem game={game} /> 
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
          console.log(response)
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
        <AddGame token={this.props.token} onSubmit={() => this.updateGames()}/>
        <hr />
        <GameList render_games={this.state.render_games} /> 
      </div>
    );
  }
}
