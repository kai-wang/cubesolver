'use restrict'

const _ = require('lodash');
const Graph = require('graphlib').Graph;
const g = new Graph();

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
  "BL": {
    alias: 'BL',
    instruction: 'rotate bottm side to left',
    reverse: 'BR',
    transform: function(arr) {
      return rotate_bottom_to_left(arr);
    }
  },
  "BR": {
    alias: 'BR',
    instruction: 'rotate bottom side to right',
    reverse: 'BL',
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
  }
  _.map(_.values(laws), v => {
    console.log(v.instruction);
    var ss = laws[v.reverse].transform(v.transform(start));
    assert(toString(ss) == toString(start));
  })

}

function toString(arr) {
  return _.join(_.flatten(_.values(arr)), "");
}