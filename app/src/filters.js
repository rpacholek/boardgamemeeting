import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'bulma'
import InputRange from 'react-input-range';
import List from 'react-list-select';
import StatusMap from './status_map.js';


// Filter functions
function getAllOwners(games){
    let owners = new Set();
    games.forEach(game => {
      if (game.owners) {
        game.owners.forEach(owner => owners.add(owner));
      } else {
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

function filterStatus(games, statuses) {
  let returnGames = [];
  games.forEach(game => {
    if (game.status){
      let keys = Object.keys(game.status);
      for (let k=0; k<keys.length; k++){
        let key = keys[k];
        for(let i=0; i<statuses.length; i++){
          if (game.status[key][statuses[i]]){
            returnGames.push(game);
            return;
          }
        }
      }
    }
  });
  return returnGames;
}

// Filters

class OwnerFilter extends React.Component {
  constructor(props) {
    super(props);
    console.log("Created");

    this.state = {
      modifier: props.modifier,
      games: props.games,
      selected: []
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(owners, selected) {
    this.setState({selected: selected});
    let selected_owners = [];
    for(let i=0; i<selected.length; ++i){
      selected_owners.push(owners[selected[i]]);
    };
    console.log(selected_owners);

    this.state.modifier(games => filterOwners(games, selected_owners));
  }

  render() {
    const owners = getAllOwners(this.props.games);
    console.log(this.state.selected);
    return (
      <div className="filter-list">
        <List
            items={owners}
            multiple={true}
            selected={this.state.selected}
            onChange={(selected) => {this.handleChange(owners, selected)}} />
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
  constructor(props) {
    super(props);
    this.state = {
      modifier: props.modifier,
      games: props.games,
      selected: [0]
    }
  }
  
  handleChange(statuses, selected) {
    console.log(selected);
    this.setState({selected: selected});
    let selected_status = [];
    for(let i=0; i<selected.length; ++i){
      selected_status.push(StatusMap.dbName(statuses[selected[i]]));
    };
    this.state.modifier(games => filterStatus(games, selected_status));
    // pass
  }

  render(){
    const statuses = StatusMap.getDisplayNames();
    return (
      <div className="filter-list">
        <List
            items={statuses}
            multiple={true}
            selected={this.state.selected}
            onChange={(selected) => {this.handleChange(statuses, selected)}} />
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
      value: {min: 1, max:10}
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
        <InputRange 
            minValue={1} 
            maxValue={10} 
            step={1} 
            value={this.state.value} 
            allowSameValues={true} 
            onChange={value => this.handleChange({value})} />
        <h3>Number of players</h3>
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
        <InputRange
          minValue={1} 
          maxValue={10} 
          step={0.1} 
          formatLabel={value => value.toFixed(1)} 
          value={this.state.value} 
          allowSameValues={true} 
          onChange={value => this.handleChange({value})} />
        <h3>Average rating</h3>
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
      value: {min: 1, max:5}
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
        <InputRange 
          minValue={1} 
          maxValue={5} 
          step={0.1} 
          formatLabel={value => value.toFixed(1)} 
          value={this.state.value} 
          allowSameValues={true} 
          onChange={value => this.handleChange({value})} />
        <h3>Average weight</h3>
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
        <InputRange 
          minValue={5} 
          maxValue={240} 
          step={10} 
          value={this.state.value} 
          allowSameValues={true} 
          onChange={value => this.handleChange({value})} />
        <h3>Time</h3>
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
        </div>
        <div className="column">
          <PlayersFilter  modifier={this.applyFilter(2)} games={this.props.games} />
          <ScoreFilter  modifier={this.applyFilter(3)} games={this.props.games} />
          <WeightFitler  modifier={this.applyFilter(4)} games={this.props.games} />
          <TimeFitler  modifier={this.applyFilter(5)} games={this.props.games} />
        </div>
        <div className="column">
          <GameStatusFilter  modifier={this.applyFilter(1)} games={this.props.games} />
        </div>
        </div>
      </section>
      </div>
    )
  }
}
