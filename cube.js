'use restrict'

const _ = require('lodash');

const colors = {
  B: "Blue",
  G: "Green",
  O: "Orange",
  R: "Red",
  Y: "Yellow",
  W: "White"
};

const surfaces = ["Front", "Back", "Left", "Right", "Up", "Bottom"];

// rotate the upper layer clockwise -- right side comes to front
function rotate_up_cw(arr) {
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

// rotate the upper layer counter clockwise - left side comes to front
function rotate_up_ccw(arr) {
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

// rotate the bottom layer clockwise -- right side comes to front
function rotate_bottom_cw(arr) {
  return {
    "Front":  [ arr.Front[0], arr.Front[1], arr.Right[2] ],
    "Back":   [ arr.Back[0], arr.Back[1], arr.Left[2] ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Front[2] ],
    "Right":  [ arr.Right[0], arr.Right[1], arr.Back[2] ],
    "Bottom": [ arr.Bottom[0][2] + arr.Bottom[1][2] + arr.Bottom[2][2],
                arr.Bottom[0][1] + arr.Bottom[1][1] + arr.Bottom[2][1],
                arr.Bottom[0][0] + arr.Bottom[1][0] + arr.Bottom[2][0]
              ],
    "Up":     [ arr.Up[0], arr.Up[1], arr.Up[2] ]
  }
}

// rotate the bottom layer counter clockwise -- left side comes to front
function rotate_bottom_ccw(arr) {
  return {
    "Front":  [ arr.Front[0], arr.Front[1], arr.Left[2] ],
    "Back":   [ arr.Back[0], arr.Back[1], arr.Right[2] ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Back[2] ],
    "Right":  [ arr.Right[0], arr.Right[1], arr.Front[2] ],
    "Bottom": [ arr.Bottom[2][0] + arr.Bottom[1][0] + arr.Bottom[0][0],
                arr.Bottom[2][1] + arr.Bottom[1][1] + arr.Bottom[0][1],
                arr.Bottom[2][2] + arr.Bottom[1][2] + arr.Bottom[0][2]
              ],
    "Up":     [ arr.Up[0], arr.Up[1], arr.Up[2] ]
  }
}

// rotate the right layer clockwise -- bottom side comes to front
function rotate_right_cw(arr) {
  return {
    "Front":  [ arr.Front[0][0] + arr.Front[0][1] + arr.Bottom[0][2],
                arr.Front[1][0] + arr.Front[1][1] + arr.Bottom[1][2],
                arr.Front[2][0] + arr.Front[2][1] + arr.Bottom[2][2]
              ],
    "Back":   [ arr.Up[2][2] + arr.Back[0][1] + arr.Back[0][2],
                arr.Up[1][2] + arr.Back[1][1] + arr.Back[1][2],
                arr.Up[0][2] + arr.Back[2][1] + arr.Back[2][2]
              ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Back[2] ],
    "Right":  [ arr.Right[2][0] + arr.Right[1][0] + arr.Right[0][0],
                arr.Right[2][1] + arr.Right[1][1] + arr.Right[0][1],
                arr.Right[2][2] + arr.Right[1][2] + arr.Right[0][2]
              ],
    "Bottom": [ arr.Bottom[0][0] + arr.Bottom[0][1] + arr.Back[2][0],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Back[1][0],
                arr.Bottom[2][0] + arr.Bottom[2][1] + arr.Back[0][0]
              ],
    "Up":     [ arr.Up[0][0] + arr.Up[0][1] + arr.Front[0][2],
                arr.Up[1][0] + arr.Up[1][1] + arr.Front[1][2],
                arr.Up[2][0] + arr.Up[2][1] + arr.Front[2][2]
              ]
  }
}

// rotate the right layer counter clockwise -- up side comes to front
function rotate_right_ccw(arr) {
  return {
    "Front":  [ arr.Front[0][0] + arr.Front[0][1] + arr.Up[0][2],
                arr.Front[1][0] + arr.Front[1][1] + arr.Up[1][2],
                arr.Front[2][0] + arr.Front[2][1] + arr.Up[2][2]
              ],
    "Back":   [ arr.Bottom[2][2] + arr.Back[0][1] + arr.Back[0][2],
                arr.Bottom[1][2] + arr.Back[1][1] + arr.Back[1][2],
                arr.Bottom[0][2] + arr.Back[2][1] + arr.Back[2][2]
              ],
    "Left":   [ arr.Left[0], arr.Left[1], arr.Back[2] ],
    "Right":  [ arr.Right[0][2] + arr.Right[1][2] + arr.Right[2][2],
                arr.Right[0][1] + arr.Right[1][1] + arr.Right[2][1],
                arr.Right[0][0] + arr.Right[1][0] + arr.Right[2][0]
              ],
    "Bottom": [ arr.Bottom[0][0] + arr.Bottom[0][1] + arr.Front[0][2],
                arr.Bottom[1][0] + arr.Bottom[1][1] + arr.Front[1][2],
                arr.Bottom[2][0] + arr.Bottom[2][1] + arr.Front[2][2]
              ],
    "Up":     [ arr.Up[0][0] + arr.Up[0][1] + arr.Back[2][0],
                arr.Up[1][0] + arr.Up[1][1] + arr.Back[1][0],
                arr.Up[2][0] + arr.Up[2][1] + arr.Back[0][0]
              ]
  }
}

// rotate the left layer counter clockwise -- bottom side comes to front
function rotate_left_ccw(arr) {
  return {
    "Front":  [ arr.Bttom[0][0] + arr.Front[0][1] + arr.Front[0][2],
                arr.Bttom[1][0] + arr.Front[1][1] + arr.Front[1][2],
                arr.Bttom[2][0] + arr.Front[2][1] + arr.Front[2][2]
              ],
    "Back":   [ arr.Back[0][0] + arr.Back[0][1] + arr.Up[2][0],
                arr.Back[1][0] + arr.Back[1][1] + arr.Up[1][0],
                arr.Back[2][0] + arr.Back[2][1] + arr.Up[0][0]
              ],
    "Left":   [ arr.Left[0][2] + arr.Left[1][2] + arr.Left[2][2],
                arr.Left[0][1] + arr.Left[1][1] + arr.Left[2][1],
                arr.Left[0][0] + arr.Left[1][0] + arr.Left[2][0]
              ],
    "Right":   [ arr.Right[0], arr.Right[1], arr.Right[2] ],
    "Bottom": [ arr.Back[2][2] + arr.Bottom[0][1] + arr.Bottom[0][2],
                arr.Back[1][2] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Back[0][2] + arr.Bottom[2][1] + arr.Bottom[2][2]
              ],
    "Up":     [ arr.Up[0][0] + arr.Up[0][1] + arr.Front[0][2],
                arr.Up[1][0] + arr.Up[1][1] + arr.Front[1][2],
                arr.Up[2][0] + arr.Up[2][1] + arr.Front[2][2]
              ]
  }
}

// rotate the left layer clockwise -- up side comes to front
function rotate_left_cw(arr) {
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
    "Right":   [ arr.Right[0], arr.Right[1], arr.Right[2] ],
    "Bottom": [ arr.Front[0][0] + arr.Bottom[0][1] + arr.Bottom[0][2],
                arr.Front[1][0] + arr.Bottom[1][1] + arr.Bottom[1][2],
                arr.Front[2][0] + arr.Bottom[2][1] + arr.Bottom[2][2]
              ],
    "Up":     [ arr.Back[2][2] + arr.Up[0][1] + arr.Up[0][2],
                arr.Back[1][2] + arr.Up[1][1] + arr.Up[1][2],
                arr.Back[0][2] + arr.Up[2][1] + arr.Up[2][2]
              ]
  }
}

function turn_front_up(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front;

  result.Front = result.Bottom;
  result.Bottom = result.Back;
  result.Back = result.Up;
  result.Up = tmp;
  
  // Right surface rotate right
  result.Right[0] = arr.Right[2][0] + arr.Right[1][0] + arr.Right[0][0];
  result.Right[1] = arr.Right[2][1] + arr.Right[1][1] + arr.Right[0][1];
  result.Right[2] = arr.Right[2][2] + arr.Right[1][2] + arr.Right[0][2];

  // Left surface rotate left
  result.Left[0] = arr.Left[0][2] + arr.Left[1][2] + arr.Left[2][2];
  result.Left[1] = arr.Left[0][1] + arr.Left[1][1] + arr.Left[2][1];
  result.Left[2] = arr.Left[0][0] + arr.Left[1][0] + arr.Left[2][0];

  return result;
}

function turn_front_bottom(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front;

  result.Front = result.Up;
  result.Up = result.Back;
  result.Back = result.Bottom;
  result.Bottom = tmp;
  
  // Right surface rotate right
  result.Left[0] = arr.Left[2][0] + arr.Left[1][0] + arr.Left[0][0];
  result.Left[1] = arr.Left[2][1] + arr.Left[1][1] + arr.Left[0][1];
  result.Left[2] = arr.Left[2][2] + arr.Left[1][2] + arr.Left[0][2];

  // Left surface rotate left
  result.Left[0] = arr.Right[0][2] + arr.Right[1][2] + arr.Right[2][2];
  result.Left[1] = arr.Right[0][1] + arr.Right[1][1] + arr.Right[2][1];
  result.Left[2] = arr.Right[0][0] + arr.Right[1][0] + arr.Right[2][0];

  return result;
}

function turn_front_left(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front;

  result.Back = result.Left;
  result.Front = result.Right;
  result.Right = result.Back;
  result.Front = tmp;
  
  // upper surface rotate right
  result.Up[0] = arr.Up[2][0] + arr.Up[1][0] + arr.Up[0][0];
  result.Up[1] = arr.Up[2][1] + arr.Up[1][1] + arr.Up[0][1];
  result.Up[2] = arr.Up[2][2] + arr.Up[1][2] + arr.Up[0][2];

  // bottom surface rotate right
  result.Bottom[0] = arr.Bottom[2][0] + arr.Bottom[1][0] + arr.Bottom[0][0];
  result.Bottom[1] = arr.Bottom[2][1] + arr.Bottom[1][1] + arr.Bottom[0][1];
  result.Bottom[2] = arr.Bottom[2][2] + arr.Bottom[1][2] + arr.Bottom[0][2];

  return result;
}

function turn_front_right(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front;

  result.Left = result.Back;
  result.Front = result.Left;
  result.Back = result.Right;
  result.Right = tmp;
  
  // upper surface rotate left
  result.Up[0] = arr.Up[0][2] + arr.Up[1][2] + arr.Up[2][2];
  result.Up[1] = arr.Up[0][1] + arr.Up[1][1] + arr.Up[2][1];
  result.Up[2] = arr.Up[0][0] + arr.Up[1][0] + arr.Up[2][0];

  // bottom surface rotate right
  result.Bottom[0] = arr.Bottom[0][2] + arr.Bottom[1][2] + arr.Bottom[2][2];
  result.Bottom[1] = arr.Bottom[0][1] + arr.Bottom[1][1] + arr.Bottom[2][1];
  result.Bottom[2] = arr.Bottom[0][0] + arr.Bottom[1][0] + arr.Bottom[2][0];

  return result;
}

const laws = [
  {
    alias: 'UL',
    instruction: 'rotate up left',
    reverse: 'UR',
    transform: function(arr) {
      return rotate_up_left(arr);
    }
  },
  {
    alias: 'UR',
    instruction: 'rotate up right',
    reverse: 'UL',
    transform: function(arr) {
      return rotate_up_right(arr);
    }
  },
  {
    alias: 'BL',
    instruction: 'rotate bottm left',
    reverse: 'BR',
    transform: function(arr) {
      return rotate_bottom_left(arr);
    }
  },
  {
    alias: 'BR',
    instruction: 'rotate bottom right',
    reverse: 'BL',
    transform: function(arr) {
      return rotate_bottom_right(arr);
    }
  },
  {
    alias: 'RB',
    instruction: 'rotate right back',
    reverse: 'RF',
    transform: function(arr) {
    }
  },
  {
    alias: 'RF',
    instruction: 'turn right front',
    reverse: 'RB',
    transform: function(arr) {
    }
  }
];

function initializeCube() {
  const z = _.zip(surfaces, _.keys(colors));
  var c = {}
  z.map(v => {
    c[v[0]] = Array(3).fill(_.repeat(v[1], 3));
  })
  return c;
}