import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'bulma'
import InputRange from 'react-input-range';

import GameFilter from './filters.js'; 

class Game extends React.Component {
  render() {
    if (this.props.value.official_name != null) {
      const owners = this.props.value.owner.map((owner) =>
        <span key={owner} className="column">{owner}</span>
      )
      return (
        <div className="card game-card">
            <div className="game-main">
                <div className="game-image">
                  <img src={this.props.value.image} alt={this.props.value.official_name} className="game-front" />
                </div>
                <div className="game-title-bar">
                  <h1 className="game-title is-size-3">{this.props.value.official_name}</h1>
                </div>
            </div>
            <div className="card-footer game-footer">
              <div className="game-inner-footer">
                <div className="columns game-stats is-small">
                  <div className="column"> <img src="/icons/timer.svg" className="miniature" /> {this.props.value.time}</div>
                  <div className="column"> <img src="/icons/people.svg" className="miniature" /> {this.props.value.min_player}-{this.props.value.max_player}</div>
                  <div className="column"> <img src="/icons/star.svg" className="miniature" /> {this.props.value.score.toFixed(2)}</div>
                  <div className="column"> <img src="/icons/cog.svg" className="miniature" /> {this.props.value.weight.toFixed(2)}</div>
                </div>
                <div className="columns game-owner">
                  {owners} 
                </div>
              </div>
            </div>
        </div>
      )
    } else {
      return null;
    }
  }
}
 

class GameTable extends React.Component {

  render() {
    const games = this.props.render_games;
    const gameList = games.map((game) =>
      <tr>
        <td>{game.official_name}</td>
        <td>{game.owner.join(', ')}</td>
        <td>{game.time}</td>
        <td>{game.min_player}-{game.max_player}</td>
        <td>{game.score.toFixed(2)}</td>
        <td>{game.weight.toFixed(2)}</td>
      </tr>
    );

    return (
      <div className="game-table">
        <table>
          <tr>
            <td>Name</td>
            <td>Owns</td>
            <td>Time</td>
            <td>People</td>
            <td>Score</td>
            <td>Weight</td>
          </tr>
          {gameList}
        </table>
      </div>
    )
  }
}

class GamePanel extends React.Component {
  render() {
    const games = this.props.render_games;
    const gameList = games.map((game) =>
      <Game key={game.objectid} value={game} />
    );

    return (
      <section className="game">
        {gameList}
      </section>
    )
  }
}


export default
class Games extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      render_games: [],
      view: 0,
      token: props.token,
    }
    

    this.displayGames = this.displayGames.bind(this);
    this.update = this.update.bind(this);

    this.update()
  }

  displayGames(games) {
    this.setState({
      render_games: games,
    })
  }

  update() {
    if(this.props.token !== "") {
      axios({
        method: 'get',
        url: 'http://localhost:5000/api/games', 
        headers: {
          "Access-Control-Allow-Origin": '*',
          "Authorization": "JWT " + this.props.token,
        },
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
  }

  render() {
    return (
      <div className="centered">
        <GameFilter games={this.state.games} displayGames={this.displayGames} />
        <div className="tabs is-centered is-large">
          <ul>
            <li className={this.state.view == 0 && "is-active"}><a onClick={()=> this.setState({view: 0})}>Grid</a></li>
            <li className={this.state.view == 1 && "is-active"}><a onClick={()=> this.setState({view: 1})}>Table</a></li>
            <li className={this.state.view == 2 && "is-active"}><a onClick={()=> this.setState({view: 2})}>Stats</a></li>
          </ul>
        </div>
        {this.state.view == 0 && <GamePanel render_games={this.state.render_games} />}
        {this.state.view == 1 && <GameTable render_games={this.state.render_games} />}
        {this.state.view == 2 && <h1>TODO</h1>}
      </div>
    );
  }
}
