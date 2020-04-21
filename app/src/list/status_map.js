const statuses = {
  "possesed": "Possesed",
  "in_delivery": "In delivery",
  "on_radar": "On radar",
  "new": "New",
  "not_available": "Not available"
}


export default
class StatusMap {
  static dbName(name) {
    // displayName -> dbName
    let keys = Object.keys(statuses);
    let values = Object.values(statuses);
    return keys[values.indexOf(name)];
  }

  static displayName(name) {
    // dbName -> displayName
    return statuses[name];
  }

  static getDisplayNames() {
    return Object.values(statuses);
  }

  static getDbNames() {
    return Object.keys(statuses);
  }

  static defaultDBMap() {
    let dm = {};
    Object.keys(statuses).map((key) => {dm[key] = false;});
    return dm;
  }
}


