'use restrict'

const _ = require('lodash');
const graphlib = require('graphlib');
const Graph = graphlib.Graph;
const g = new Graph({directed: true});

const colors = {
  B: "Blue",
  G: "Green",
  O: "Orange",
  R: "Red",
  Y: "Yellow",
  W: "White"
};

const surfaces = ["Front", "Back", "Left", "Right", "Up", "Bottom"];

// rotate the upper side clockwise -- right side comes to front
function rotate_up_to_left(arr) {
  return {
    "Front":  [ arr.Right[0], arr.Front[1], arr.Front[2] ],
    "Back":   [ arr.Left[0], arr.Back[1], arr.Back[2] ],
    "Left":   [ arr.Front[0], arr.Left[1], arr.Left[2] ],
    "Right":  [ arr.Back[0], arr.Right[1], arr.Right[2] ],
    "Up":     [ arr.Up[2][0] + arr.Up[1][0] + arr.Up[0][0],
                arr.Up[2][1] + arr.Up[1][1] + arr.Up[0][1],
                arr.Up[2][2] + arr.Up[1][2] + arr.Up[0][2]
              ],
    "Bottom": [ arr.Bottom[0], arr.Bottom[1], arr.Bottom[2] ]
  }
}

// rotate the upper side counter clockwise - left side comes to front
function rotate_up_to_right(arr) {
  return {
    "Front":  [ arr.Left[0], arr.Front[1], arr.Front[2] ],
    "Back":   [ arr.Right[0],  arr.Back[1],  arr.Back[2] ],
    "Left":   [ arr.Back[0], arr.Left[1],  arr.Left[2] ],
    "Right":  [ arr.Front[0],  arr.Right[1], arr.Right[2] ],
    "Up":     [ arr.Up[0][2] + arr.Up[1][2] + arr.Up[2][2],
                arr.Up[0][1] + arr.Up[1][1] + arr.Up[2][1],
                arr.Up[0][0] + arr.Up[1][0] + arr.Up[2][0]
              ],
    "Bottom": [ arr.Bottom[0], arr.Bottom[1], arr.Bottom[2] ]
  }
}

// rotate the bottom side clockwise -- right side comes to front
function rotate_bottom_to_left(arr) {
  return {
    "Front":  [ arr.Front[0], arr.Front[1], arr.Right[2] ],
    "Back":   [ arr.Back[0], arr.Back[1], arr.Left[2] ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Front[2] ],
    "Right":  [ arr.Right[0], arr.Right[1], arr.Back[2] ],
    "Up":     [ arr.Up[0], arr.Up[1], arr.Up[2] ],
    "Bottom": [ arr.Bottom[0][2] + arr.Bottom[1][2] + arr.Bottom[2][2],
                arr.Bottom[0][1] + arr.Bottom[1][1] + arr.Bottom[2][1],
                arr.Bottom[0][0] + arr.Bottom[1][0] + arr.Bottom[2][0]
              ]
  }
}

// rotate the bottom side counter clockwise -- left side comes to front
function rotate_bottom_to_right(arr) {
  return {
    "Front":  [ arr.Front[0], arr.Front[1], arr.Left[2] ],
    "Back":   [ arr.Back[0], arr.Back[1], arr.Right[2] ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Back[2] ],
    "Right":  [ arr.Right[0], arr.Right[1], arr.Front[2] ],
    "Up":     [ arr.Up[0], arr.Up[1], arr.Up[2] ],
    "Bottom": [ arr.Bottom[2][0] + arr.Bottom[1][0] + arr.Bottom[0][0],
                arr.Bottom[2][1] + arr.Bottom[1][1] + arr.Bottom[0][1],
                arr.Bottom[2][2] + arr.Bottom[1][2] + arr.Bottom[0][2]
              ]
  }
}

// rotate the right side clockwise -- bottom side comes to front
function rotate_right_to_up(arr) {
  return {
    "Front":  [ arr.Front[0][0] + arr.Front[0][1] + arr.Bottom[0][2],
                arr.Front[1][0] + arr.Front[1][1] + arr.Bottom[1][2],
                arr.Front[2][0] + arr.Front[2][1] + arr.Bottom[2][2]
              ],
    "Back":   [ arr.Up[2][2] + arr.Back[0][1] + arr.Back[0][2],
                arr.Up[1][2] + arr.Back[1][1] + arr.Back[1][2],
                arr.Up[0][2] + arr.Back[2][1] + arr.Back[2][2]
              ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Left[2] ],
    "Right":  [ arr.Right[2][0] + arr.Right[1][0] + arr.Right[0][0],
                arr.Right[2][1] + arr.Right[1][1] + arr.Right[0][1],
                arr.Right[2][2] + arr.Right[1][2] + arr.Right[0][2]
              ],
    "Up":     [ arr.Up[0][0] + arr.Up[0][1] + arr.Front[0][2],
                arr.Up[1][0] + arr.Up[1][1] + arr.Front[1][2],
                arr.Up[2][0] + arr.Up[2][1] + arr.Front[2][2]
              ],
    "Bottom": [ arr.Bottom[0][0] + arr.Bottom[0][1] + arr.Back[2][0],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Back[1][0],
                arr.Bottom[2][0] + arr.Bottom[2][1] + arr.Back[0][0]
              ]
  }
}

// rotate the right side counter clockwise -- up side comes to front
function rotate_right_to_bottom(arr) {
  return {
    "Front":  [ arr.Front[0][0] + arr.Front[0][1] + arr.Up[0][2],
                arr.Front[1][0] + arr.Front[1][1] + arr.Up[1][2],
                arr.Front[2][0] + arr.Front[2][1] + arr.Up[2][2]
              ],
    "Back":   [ arr.Bottom[2][2] + arr.Back[0][1] + arr.Back[0][2],
                arr.Bottom[1][2] + arr.Back[1][1] + arr.Back[1][2],
                arr.Bottom[0][2] + arr.Back[2][1] + arr.Back[2][2]
              ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Left[2] ],
    "Right":  [ arr.Right[0][2] + arr.Right[1][2] + arr.Right[2][2],
                arr.Right[0][1] + arr.Right[1][1] + arr.Right[2][1],
                arr.Right[0][0] + arr.Right[1][0] + arr.Right[2][0]
              ],
    "Up":     [ arr.Up[0][0] + arr.Up[0][1] + arr.Back[2][0],
                arr.Up[1][0] + arr.Up[1][1] + arr.Back[1][0],
                arr.Up[2][0] + arr.Up[2][1] + arr.Back[0][0]
              ],
    "Bottom": [ arr.Bottom[0][0] + arr.Bottom[0][1] + arr.Front[0][2],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Front[1][2],
                arr.Bottom[2][0] + arr.Bottom[2][1] + arr.Front[2][2]
              ]
  }
}

// rotate the left side counter clockwise -- bottom side comes to front
function rotate_left_to_up(arr) {
  return {
    "Front":  [ arr.Bottom[0][0] + arr.Front[0][1] + arr.Front[0][2],
                arr.Bottom[1][0] + arr.Front[1][1] + arr.Front[1][2],
                arr.Bottom[2][0] + arr.Front[2][1] + arr.Front[2][2]
              ],
    "Back":   [ arr.Back[0][0] + arr.Back[0][1] + arr.Up[2][0],
                arr.Back[1][0] + arr.Back[1][1] + arr.Up[1][0],
                arr.Back[2][0] + arr.Back[2][1] + arr.Up[0][0]
              ],
    "Left":   [ arr.Left[0][2] + arr.Left[1][2] + arr.Left[2][2],
                arr.Left[0][1] + arr.Left[1][1] + arr.Left[2][1],
                arr.Left[0][0] + arr.Left[1][0] + arr.Left[2][0]
              ],
    "Right":  [ arr.Right[0], arr.Right[1], arr.Right[2] ],
    "Up":     [ arr.Front[0][0] + arr.Up[0][1] + arr.Up[0][2],
                arr.Front[1][0] + arr.Up[1][1] + arr.Up[1][2],
                arr.Front[2][0] + arr.Up[2][1] + arr.Up[2][2]
              ],
    "Bottom": [ arr.Back[2][2] + arr.Bottom[0][1] + arr.Bottom[0][2],
                arr.Back[1][2] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Back[0][2] + arr.Bottom[2][1] + arr.Bottom[2][2]
              ]
  }
}

// rotate the left side clockwise -- up side comes to front
function rotate_left_to_bottom(arr) {
  return {
    "Front":  [ arr.Up[0][0] + arr.Front[0][1] + arr.Front[0][2],
                arr.Up[1][0] + arr.Front[1][1] + arr.Front[1][2],
                arr.Up[2][0] + arr.Front[2][1] + arr.Front[2][2]
              ],
    "Back":   [ arr.Back[0][0] + arr.Back[0][1] + arr.Bottom[2][0],
                arr.Back[1][0] + arr.Back[1][1] + arr.Bottom[1][0],
                arr.Back[2][0] + arr.Back[2][1] + arr.Bottom[0][0]
              ],
    "Left":   [ arr.Left[2][0] + arr.Left[1][0] + arr.Left[0][0],
                arr.Left[2][1] + arr.Left[1][1] + arr.Left[0][1],
                arr.Left[2][2] + arr.Left[1][2] + arr.Left[0][2]
              ],
    "Right":  [ arr.Right[0], arr.Right[1], arr.Right[2] ],
    "Up":     [ arr.Back[2][2] + arr.Up[0][1] + arr.Up[0][2],
                arr.Back[1][2] + arr.Up[1][1] + arr.Up[1][2],
                arr.Back[0][2] + arr.Up[2][1] + arr.Up[2][2]
              ],
    "Bottom": [ arr.Front[0][0] + arr.Bottom[0][1] + arr.Bottom[0][2],
                arr.Front[1][0] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Front[2][0] + arr.Bottom[2][1] + arr.Bottom[2][2]
              ]
  }
}

// rotate the front side clockwise -- left side comes to up
function rotate_front_to_right(arr) {
  return {
    "Front":  [ arr.Front[2][0] + arr.Front[1][0] + arr.Front[0][0],
                arr.Front[2][1] + arr.Front[1][1] + arr.Front[0][1],
                arr.Front[2][2] + arr.Front[1][2] + arr.Front[0][2]
              ],
    "Back":   [ arr.Back[0], arr.Back[1], arr.Back[2] ],
    "Left":   [ arr.Left[0][0] + arr.Left[0][1] + arr.Bottom[0][0],
                arr.Left[1][0] + arr.Left[1][1] + arr.Bottom[0][1],
                arr.Left[2][0] + arr.Left[2][1] + arr.Bottom[0][2]
              ],
    "Right":  [ arr.Up[2][0] + arr.Right[0][1] + arr.Right[0][2],
                arr.Up[2][1] + arr.Right[1][1] + arr.Right[1][2],
                arr.Up[2][2] + arr.Right[2][1] + arr.Right[2][2]
              ],
    "Up":     [ arr.Up[0][0] + arr.Up[0][1] + arr.Up[0][2],
                arr.Up[1][0] + arr.Up[1][1] + arr.Up[1][2],
                arr.Left[2][2] + arr.Left[1][2] + arr.Left[0][2]
              ],
    "Bottom": [ arr.Right[2][0] + arr.Right[1][0] + arr.Right[0][0],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Bottom[2][0] + arr.Bottom[2][1] + arr.Bottom[2][2]
              ]
  }
}

// rotate the front side counter clockwise -- right side comes to up
function rotate_front_to_left(arr) {
  return {
    "Front":  [ arr.Front[0][2] + arr.Front[1][2] + arr.Front[2][2],
                arr.Front[0][1] + arr.Front[1][1] + arr.Front[2][1],
                arr.Front[0][0] + arr.Front[1][0] + arr.Front[2][0]
              ],
    "Back":   [ arr.Back[0], arr.Back[1], arr.Back[2] ],
    "Left":   [ arr.Left[0][0] + arr.Left[0][1] + arr.Up[2][2],
                arr.Left[1][0] + arr.Left[1][1] + arr.Up[2][1],
                arr.Left[2][0] + arr.Left[2][1] + arr.Up[2][0]
              ],
    "Right":  [ arr.Bottom[0][2] + arr.Right[0][1] + arr.Right[0][2],
                arr.Bottom[0][1] + arr.Right[1][1] + arr.Right[1][2],
                arr.Bottom[0][0] + arr.Right[2][1] + arr.Right[2][2]
              ],
    "Up":     [ arr.Up[0][0] + arr.Up[0][1] + arr.Up[0][2],
                arr.Up[1][0] + arr.Up[1][1] + arr.Up[1][2],
                arr.Right[0][0] + arr.Right[1][0] + arr.Right[2][0]
              ],
    "Bottom": [ arr.Left[0][2] + arr.Left[1][2] + arr.Left[2][2],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Bottom[2][0] + arr.Bottom[2][1] + arr.Bottom[2][2]
              ]
  }
}

// rotate the back side clockwise -- right side comes to up
function rotate_back_to_left(arr) {
  return {
    "Front":  [ arr.Front[0], arr.Front[1], arr.Front[2] ],
    "Back":   [ arr.Back[2][0] + arr.Back[1][0] + arr.Back[0][0],
                arr.Back[2][1] + arr.Back[1][1] + arr.Back[0][1],
                arr.Back[2][2] + arr.Back[1][2] + arr.Back[0][2] 
              ],
    "Left":   [ arr.Up[0][2] + arr.Left[0][1] + arr.Left[0][2],
                arr.Up[0][1] + arr.Left[1][1] + arr.Left[1][2],
                arr.Up[0][0] + arr.Left[2][1] + arr.Left[2][2]
              ],
    "Right":  [ arr.Right[0][0] + arr.Right[0][1] + arr.Bottom[2][2],
                arr.Right[1][0] + arr.Right[1][1] + arr.Bottom[2][1],
                arr.Right[2][0] + arr.Right[2][1] + arr.Bottom[2][0]
              ],
    "Up":     [ arr.Right[0][2] + arr.Right[1][2] + arr.Right[2][2],
                arr.Up[1][0] + arr.Up[1][1] + arr.Up[1][2],
                arr.Up[2][0] + arr.Up[2][1] + arr.Up[2][2]
              ],
    "Bottom": [ arr.Bottom[0][0] + arr.Bottom[0][1] + arr.Bottom[0][2],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Left[0][0] + arr.Left[1][0] + arr.Left[2][0]
              ]
  }
}

// rotate the back side counter clockwise -- left side comes to up
function rotate_back_to_right(arr) {
  return {
    "Front":  [ arr.Front[0], arr.Front[1], arr.Front[2] ],
    "Back":   [ arr.Back[0][2] + arr.Back[1][2] + arr.Back[2][2],
                arr.Back[0][1] + arr.Back[1][1] + arr.Back[2][1],
                arr.Back[0][0] + arr.Back[1][0] + arr.Back[2][0] 
              ],
    "Left":   [ arr.Bottom[2][0] + arr.Left[0][1] + arr.Left[0][2],
                arr.Bottom[2][1] + arr.Left[1][1] + arr.Left[1][2],
                arr.Bottom[2][2] + arr.Left[2][1] + arr.Left[2][2]
              ],
    "Right":  [ arr.Right[0][0] + arr.Right[0][1] + arr.Up[0][0],
                arr.Right[1][0] + arr.Right[1][1] + arr.Up[0][1],
                arr.Right[2][0] + arr.Right[2][1] + arr.Up[0][2]
              ],
    "Up":     [ arr.Left[2][0] + arr.Left[1][0] + arr.Left[0][0],
                arr.Up[1][0] + arr.Up[1][1] + arr.Up[1][2],
                arr.Up[2][0] + arr.Up[2][1] + arr.Up[2][2]
              ],
    "Bottom": [ arr.Bottom[0][0] + arr.Bottom[0][1] + arr.Bottom[0][2],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Right[2][2] + arr.Right[1][2] + arr.Right[0][2]
              ]
  }
}

const laws = {
  "UL": {
    alias: 'UL',
    instruction: 'rotate up side to left',
    reverse: 'UR',
    transform: function(arr) { 
      return rotate_up_to_left(arr);
    }
  },
  "UR": {
    alias: 'UR',
    instruction: 'rotate up side to right',
    reverse: 'UL',
    transform: function(arr) {
      return rotate_up_to_right(arr);
    }
  },
  "TL": {
    alias: 'TL',
    instruction: 'rotate bottm side to left',
    reverse: 'TR',
    transform: function(arr) {
      return rotate_bottom_to_left(arr);
    }
  },
  "TR": {
    alias: 'TR',
    instruction: 'rotate bottom side to right',
    reverse: 'TL',
    transform: function(arr) {
      return rotate_bottom_to_right(arr);
    }
  },
  "RB": {
    alias: 'RB',
    instruction: 'rotate right side to up',
    reverse: 'RF',
    transform: function(arr) {
      return rotate_right_to_up(arr);
    }
  },
  "RF": {
    alias: 'RF',
    instruction: 'rotate right side to bottom',
    reverse: 'RB',
    transform: function(arr) {
      return rotate_right_to_bottom(arr);
    }
  },
  "LB": {
    alias: 'LB',
    instruction: 'rotate left side to up',
    reverse: 'LF',
    transform: function(arr) {
      return rotate_left_to_up(arr);
    }
  },
  "LF": {
    alias: 'LF',
    instruction: 'rotate left side to bottm',
    reverse: 'LB',
    transform: function(arr) {
      return rotate_left_to_bottom(arr);
    }
  },
  "FR": {
    alias: 'FR',
    instruction: 'rotate front side to right',
    reverse: 'FL',
    transform: function(arr) {
      return rotate_front_to_right(arr);
    }
  },
  "FL": {
    alias: 'FL',
    instruction: 'rotate front side to left',
    reverse: 'FR',
    transform: function(arr) {
      return rotate_front_to_left(arr);
    }
  },
  "BR": {
    alias: 'BR',
    instruction: 'rotate back side to right',
    reverse: 'BL',
    transform: function(arr) {
      return rotate_back_to_right(arr);
    }
  },
  "BL": {
    alias: 'BL',
    instruction: 'rotate back side to left',
    reverse: 'BR',
    transform: function(arr) {
      return rotate_back_to_left(arr);
    }
  }
};

function initializeCube() {
  const z = _.zip(surfaces, _.keys(colors));
  var c = {}
  z.map(v => {
    c[v[0]] = Array(3).fill(_.repeat(v[1], 3));
  })
  return c;
}


function test() {
  const start = {
    "Front": ['ORG', 'BRO', 'BRR'],
    "Back": ['BWG', 'BOY', 'BOG'],
    "Left": ['RYW', 'RWY', 'RRW'],
    "Right": ['OOW', 'BYW', 'BYY'],
    "Up": ['WGO', 'GBG', 'GWY'],
    "Bottom": ['RGY', 'BGO', 'YWO']
  };
  _.mapKeys(laws, (v, k) => {
    console.log("alias: " + k + ": " + v.instruction);
    // must able to reverse transformable.
    var ss = laws[v.reverse].transform(v.transform(start));
    assert(hash(ss) == hash(start));
  })
}

function normalize(arr) {
  return _.transform(surfaces, (result, v) => { result[v] = arr[v]; }, {});
}

function hash(arr) {
  return _.join(_.flatten(_.values(arr)), "");
}

function findSolution() {
  /*
  const arr = {
    "Front": ['ORG', 'BRO', 'BRR'],
    "Back": ['BWG', 'BOY', 'BOG'],
    "Left": ['RYW', 'RWY', 'RRW'],
    "Right": ['OOW', 'BYW', 'BYY'],
    "Up": ['WGO', 'GBG', 'GWY'],
    "Bottom": ['RGY', 'BGO', 'YWO']
  };

  const target = {
    "Front": ['RRR', 'RRR', 'RRR'],
    "Back": ['OOO', 'OOO', 'OOO'],
    "Left": ['WWW', 'WWW', 'WWW'],
    "Right": ['YYY', 'YYY', 'YYY'],
    "Up": ['BBB', 'BBB', 'BBB'],
    "Bottom": ['GGG', 'GGG', 'GGG']  
  };
  */

  const target = {
    "Front": ['RRR', 'RRR', 'RRR'],
    "Back": ['OOO', 'OOO', 'OOO'],
    "Left": ['WWW', 'WWW', 'WWW'],
    "Right": ['YYY', 'YYY', 'YYY'],
    "Up": ['BBB', 'BBB', 'BBB'],
    "Bottom": ['GGG', 'GGG', 'GGG']  
  };

  const arr = {
    Front: [ 'YYY', 'RRR', 'RRR' ],
    Back: [ 'WWW', 'OOO', 'OOO' ],
    Left: [ 'RRR', 'WWW', 'WWW' ],
    Right: [ 'OOO', 'YYY', 'YYY' ],
    Up: [ 'BBB', 'BBB', 'BBB' ],
    Bottom: [ 'GGG', 'GGG', 'GGG' ] 
  };

  var targetHash = hash(normalize(target));

  var src = normalize(arr);
  var srcHash = hash(normalize(src));

  var pool = [src];
  var found = false;

  function transform(shape, base) {
    _.map(laws, (v, k) => {
      if(g.outEdges(base).length < 12 && !found) {
        var t = v.transform(shape);
        var dest = hash(t);
        if(dest == targetHash) {
          pool = [];
          g.setNode(dest, t);
          g.setEdge(base, dest, v.alias);
          g.setEdge(dest, base, v.reverse);
          found = true;
          return;
        }
  
        if(!g.hasNode(dest)) {
          g.setNode(dest, t);
        }
  
        if(!g.hasEdge(base, dest)) {
          g.setEdge(base, dest, v.alias);
          g.setEdge(dest, base, v.reverse);
          pool.push(t); 
        }
      }
    })
  }

  g.setNode(srcHash, src);

  while(!found) {
    var tmp = pool.shift();
    transform(tmp, hash(tmp));
  }

  console.log(graphlib.alg.dijkstra(g, srcHash, e => g.edge(e)));
}

