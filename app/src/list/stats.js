import React from 'react';
import ReactDOM from 'react-dom';

class GamePlayerStat extends React.Component {
  collect(games) {
    let owners = {};
    games.map(game => {
      game.owners.map(owner => {
        if(!owners[owner]) {
          owners[owner] = Array(9);
          for (let i = 0; i<10; i++) owners[owner][i] = 0;
        }
        for(let i = game.min_players-1; i < game.max_players; i++){
          owners[owner][i] += 1;
        }
      });
    });
    let keys = Object.keys(owners);
    let result = []
    for(let i = 0; i<keys.length; i++){
      let s = {owner: keys[i]};
      for(let j = 0; j<10; j++) {
        s[j] = owners[keys[i]][j];
      }
      result.push(s);
    }
    return result;
  }

  render() {
    let collected = this.collect(this.props.games);
    let entries = collected.map(game => 
      <tr>
        <th>{game.owner}</th>
        <th>{game[0]}</th>
        <th>{game[1]}</th>
        <th>{game[2]}</th>
        <th>{game[3]}</th>
        <th>{game[4]}</th>
        <th>{game[5]}</th>
        <th>{game[6]}</th>
        <th>{game[7]}</th>
        <th>{game[8]}</th>
        <th>{game[9]}</th>
      </tr>
    );
    return (
      <div>
        <h2>Player Stats</h2>
        <table className="table is-hoverable">
          <thead>
            <tr>
              <th>Who</th>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td>10</td>
            </tr>
          </thead>
          <tbody>
            {entries}
          </tbody>
        </table>
      </div>
    )
  }
}

class GameOwnedStat extends React.Component {
  collect(games) {
    let owners = {};
    let count = games.length;
    games.map((game) => {
      game.owners.map((owner) => {
        if (!owners[owner]) {
          owners[owner] = {
            count: 0,
            unique: 0,
            rating: 0,
            weight: 0,
          };
        }
        owners[owner].count += 1;
        if (game.owners.length == 1) {
          owners[owner].unique += 1;
        }
        owners[owner].rating += game.rating;
        owners[owner].weight += game.weight;
      });
    });
    let keys = Object.keys(owners);
    let result = [];
    for (let i = 0; i<keys.length; i++){
      let key = keys[i];
      result.push({
        owner: key,
        count: owners[key].count,
        unique: owners[key].unique,
        percent: owners[key].count*100/count,
        rating: owners[key].rating/(owners[key].count || 1),
        weight: owners[key].weight/(owners[key].count || 1),
      });
    }
    console.log(result);
    return result;
  }

  gen_summary(games) {
    console.log(games);
    let stats = {
      total: 0,
      unique: 0,
      rating: 0,
      weight: 0
    }
    games.map(game => {
      if (game.owners && game.owners.length > 0) {
        stats.unique += 1;
        stats.total += game.owners.length;
        stats.rating += game.rating;
        stats.weight += game.weight;
      }
    });
    stats.rating = stats.rating/games.length;
    stats.weight = stats.weight/games.length;
    return stats;
  }

  render() {
    let collected = this.collect(this.props.games);
    let entries = collected.map(game => 
      <tr>
        <th>{game.owner}</th>
        <td>{game.count}</td>
        <td>{game.unique}</td>
        <td>{game.percent.toFixed(2)}</td>
        <td>{game.rating.toFixed(2)}</td>
        <td>{game.weight.toFixed(2)}</td>
      </tr>
    );
    let summary = this.gen_summary(this.props.games);
    return (
      <div>
        <h2>General Stats</h2>
        
        <table className="table is-hoverable">
          <thead>
            <tr>
              <th>Who</th>
              <th>#</th>
              <th>Unique</th>
              <th>%</th>
              <th>Rating</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {entries}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>{summary.total}</th>
              <th>{summary.unique}</th>
              <th>-</th>
              <th>{summary.rating.toFixed(2)}</th>
              <th>{summary.weight.toFixed(2)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}

class GameStatusStats extends React.Component {
  collect(games) {
    console.log(games);
    let st = {}
    games.map(game => {
      let owners = Object.keys(game.status);
      for (let j = 0; j<owners.length; j++) {
        let keys = Object.keys(game.status[owners[j]]);
        for (let i = 0; i<keys.length; i++){
          let key = keys[i];
          if(!st[key]) {
            st[key] = {
              total: 0,
              rating: 0,
              weight: 0,
            };
          }
          if (game.status[owners[j]][key]) {
            st[key].total += 1;
            st[key].rating += game.rating;
            st[key].weight += game.weight;
          }
        }
      }
    })
    let result = [];
    let keys = Object.keys(st);
    for (let i = 0; i<keys.length; i++){
      let key = keys[i];
      result.push({
        st: key,
        count: st[key].total,
        rating: st[key].rating/(st[key].total || 1),
        weight: st[key].weight/(st[key].total || 1),
      });
    }
    return result;
  }

  render() {
    let collected = this.collect(this.props.games);
    let entries = collected.map(game => 
      <tr>
        <th>{game.st}</th>
        <td>{game.count}</td>
        <td>{game.rating.toFixed(2)}</td>
        <td>{game.weight.toFixed(2)}</td>
      </tr>
    );
    return (
      <div>
        <h2>Status Stats</h2>
        
        <table className="table is-hoverable">
          <thead>
            <tr>
              <th>Status</th>
              <th>#</th>
              <th>Rating</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {entries}
          </tbody>
        </table>
      </div>
    )
  }
}


export default
class GameStats extends React.Component {
  render() {
    return (
      <div>
        <GameOwnedStat games={this.props.games} />
        <GameStatusStats games={this.props.games} />
        <GamePlayerStat games={this.props.games} />
      </div>
    )
  }
}
