import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'bulma'
import InputRange from 'react-input-range';


// Filter functions
function getAllOwners(games){
    let owners = new Set();
    games.forEach(game => {
      if (game.owners) {
        game.owners.forEach(owner => owners.add(owner));
      } else {
        //console.log(game);
        //owners.add("Unknown");
      }
    });
    return Array.from(owners);
}

function filterOwners(games, owners) {
  let returnGames = [];
  games.forEach(game => {
    if (game.owners){
      for(let i=0; i<owners.length; i++){
        if (game.owners.indexOf(owners[i]) != -1){
          returnGames.push(game);
          break;
        }
      }
    }
  });
  return returnGames;
}

function filterPlayers(games, value){
  let returnGames = [];
  games.forEach(game => {
    if (! ((value.max < game.min_players) || (game.max_players < value.min))){
      returnGames.push(game);
    }
  });
  return returnGames;
}

function filterScore(games, value){
  let returnGames = [];
  games.forEach(game => {
    if ((value.min <= game.rating) && (game.rating <= value.max)){
      returnGames.push(game);
    }
  });
  return returnGames;
}

function filterWeight(games, value){
  let returnGames = [];
  games.forEach(game => {
    if ((value.min <= game.weight) && (game.weight <= value.max)){
      returnGames.push(game);
    }
  });
  return returnGames;
}

function filterTime(games, value){
  let returnGames = [];
  games.forEach(game => {
    if ((value.min <= game.time) && (game.time <= value.max)){
      returnGames.push(game);
    }
  });
  return returnGames;
}


// Filters

class OwnerFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modifier: props.modifier,
      games: props.games,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let owners = [];
    for(let i=0; i<event.target.selectedOptions.length; ++i){
      owners.push(event.target.selectedOptions[i].value);
    };

    this.state.modifier(games => filterOwners(games, owners));
  }

  render() {
    const owners = getAllOwners(this.props.games);
    const owners_options = owners.map((owner) =>
      <option className="filter-option">{owner}</option>
    );

    return (
      <div>
        <select className="select is-multiple filter-select" onChange={this.handleChange}  multiple size="5">
          {owners_options}
        </select> 
      </div>
    )
  }
}

class GameStatusFilter extends React.Component {
  /*
   *  Expected statuses/labels:
   *  - new
   *  - possesed 
   *  - rented
   *  - on_radar
   *  - in_delivery
   */
  render(){
    const statuses = ["possesed", "new", "on radar", "soon", "not available"];
    const status_options = statuses.map((o) => 
      <option className="filter-option">{o}</option>
    );
    return (
      <div>
        <select className="filter-select select is-multiple" multiple size="5">
          {status_options}
        </select>
      </div>
    )
  }
}

class PlayersFilter extends React.Component {
  constructor(props) {
    super(props);
   this.state = {
      modifier: props.modifier,
      games: props.games,
      value: {min: 3, max:4}
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState(value);
    this.state.modifier(games => filterPlayers(games, value.value));
  }

  render(){
    return (
      <div className="game-range">
        <h3>Number of players</h3>
        <InputRange 
            minValue={1} 
            maxValue={10} 
            step={1} 
            value={this.state.value} 
            allowSameValues={true} 
            onChange={value => this.handleChange({value})} />
      </div>
    )
  }
}

class ScoreFilter extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      modifier: props.modifier,
      games: props.games,
      value: {min: 1, max:10}
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState(value);
    this.state.modifier(games => filterScore(games, value.value));
  }
  render(){
    return (
      <div className="game-range">
        <h3>Average rating</h3>
        <InputRange
          minValue={1} 
          maxValue={10} 
          step={0.1} 
          formatLabel={value => value.toFixed(1)} 
          value={this.state.value} 
          allowSameValues={true} 
          onChange={value => this.handleChange({value})} />
      </div>
    )
  }
}
class WeightFitler extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      modifier: props.modifier,
      games: props.games,
      value: {min: 2, max:4}
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState(value);
    this.state.modifier(games => filterWeight(games, value.value));
  }

  render(){
    return (
      <div className="game-range">
        <h3>Average weight</h3>
        <InputRange 
          minValue={1} 
          maxValue={5} 
          step={0.1} 
          formatLabel={value => value.toFixed(1)} 
          value={this.state.value} 
          allowSameValues={true} 
          onChange={value => this.handleChange({value})} />
      </div>
    )
  }
}

class TimeFitler extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      modifier: props.modifier,
      games: props.games,
      value: {min: 5, max: 240}
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState(value);
    this.state.modifier(games => filterTime(games, value.value));
  }

  render(){
    return (
      <div className="game-range">
        <h3>Time</h3>
        <InputRange 
          minValue={5} 
          maxValue={240} 
          step={10} 
          value={this.state.value} 
          allowSameValues={true} 
          onChange={value => this.handleChange({value})} />
      </div>
    )
  }
}


// Exported components

export default
class GameFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modifiers: Array(),
      displayFunc: props.displayGames,
    }

    this.applyFilter = this.applyFilter.bind(this);
    this.filterGames = this.filterGames.bind(this);
  }


  applyFilter(i) {
    return func => {
      this.state.modifiers[i] = func;
      this.filterGames();
    }
  }

  filterGames() {
    let games = this.props.games;
    this.state.modifiers.forEach(func => {
      if (func) {
        games = func(games);
      }
    });

    this.state.displayFunc(games);
  }

  render() {
    return (
      <div className="filter-wrapper">
      <section className="filters">
        <div className="columns">
        <div className="column">
          <OwnerFilter modifier={this.applyFilter(0)} games={this.props.games} />
          <GameStatusFilter  modifier={this.applyFilter(1)} games={this.props.games} />
        </div>
        <div className="column">
          <PlayersFilter  modifier={this.applyFilter(2)} games={this.props.games} />
          <ScoreFilter  modifier={this.applyFilter(3)} games={this.props.games} />
          <WeightFitler  modifier={this.applyFilter(4)} games={this.props.games} />
          <TimeFitler  modifier={this.applyFilter(5)} games={this.props.games} />
        </div>
        </div>
      </section>
      </div>
    )
  }
}
