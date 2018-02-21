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

function rotate_up_left(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front[0];

  result.Front[0] = result.Right[0];
  result.Right[0] = result.Back[0];
  result.Back[0] = result.Left[0];
  result.Left[0] = tmp;

  // upper surface rotate right
  result.Up[0] = arr.Up[2][0] + arr.Up[1][0] + arr.Up[0][0];
  result.Up[1] = arr.Up[2][1] + arr.Up[1][1] + arr.Up[0][1];
  result.Up[2] = arr.Up[2][2] + arr.Up[1][2] + arr.Up[0][2];

  return result;
}

function rotate_up_right(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front[0];

  result.Front[0] = result.Left[0];
  result.Left[0] = result.Back[0];
  result.Back[0] = result.Right[0];
  result.Right[0] = tmp;

  // upper surface rotate left
  result.Up[0] = arr.Up[0][2] + arr.Up[1][2] + arr.Up[2][2];
  result.Up[1] = arr.Up[0][1] + arr.Up[1][1] + arr.Up[2][1];
  result.Up[2] = arr.Up[0][0] + arr.Up[1][0] + arr.Up[2][0];

  return result;
}

function rotate_bottom_left(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front[2];

  result.Front[2] = result.Right[2];
  result.Right[2] = result.Back[2];
  result.Back[2] = result.Left[2];
  result.Left[2] = tmp;

  // Bottom surface rotate left
  result.Bottom[0] = arr.Bottom[0][2] + arr.Bottom[1][2] + arr.Bottom[2][2];
  result.Bottom[1] = arr.Bottom[0][1] + arr.Bottom[1][1] + arr.Bottom[2][1];
  result.Bottom[2] = arr.Bottom[0][0] + arr.Bottom[1][0] + arr.Bottom[2][0];

  return result;
}

function rotate_bottom_right(arr) {
  var result = _.cloneDeep(arr);
  var tmp = result.Front[2];

  result.Front[2] = result.Left[2];
  result.Left[2] = result.Back[2];
  result.Back[2] = result.Right[2];
  result.Right[2] = tmp;

  // Bottom surface rotate right
  result.Bottom[0] = arr.Bottom[2][0] + arr.Bottom[1][0] + arr.Bottom[0][0];
  result.Bottom[1] = arr.Bottom[2][1] + arr.Bottom[1][1] + arr.Bottom[0][1];
  result.Bottom[2] = arr.Bottom[2][2] + arr.Bottom[1][2] + arr.Bottom[0][2];

  return result;
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