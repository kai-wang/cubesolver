'use strict';

var inquirer = require('inquirer');

var cubes = {};

var options = [
  {
    type: "rawlist",
    name: "option",
    message: "choose your action: ",
    choices: ['Find a solution', 'Display all colors', 'Set Colors', 'Quit']
  }
]

var surfacesPrompt = [
  {
    type: 'list',
    name: 'surface',
    message: 'Choose your surface: ',
    choices: ['Front', 'Back', 'Left', 'Right', 'Upper', 'Bottom']
  },
  {
    type: 'input',
    name: 'layer',
    message: 'Enter your colors from top to bottom \nE.g. B R G, W Y K, Y G R \n): ',
    filter: function(value) {
      var x = value.split(",").map(v => v.trim(" ").split(" "));
    }
  }
]

function chooseSurface() {
  inquirer.prompt(surfacesPrompt).then(answers => {
    if(answers.surface == 'Bottom')
      console.log(JSON.stringify(cubes));

    console.log(JSON.stringify(answers));
    cubes[answers.surface] = answers.layer;
    console.log(answers.layer);
    chooseSurface();
  })
}


function main() {
  inquirer.prompt(options).then(answers => {
    if(answers.option == '1') 
      console.log('find a solution');
    else if(answers.option == '2')
      console.log('display');
    else if(answers.option == 'Set Colors') {
      console.log('Reset Colors');
      chooseSurface();
    }
    else if(answers.option == '4')
      console.log('Quit')

    console.log(JSON.stringify(answers.option))
  })  
}

main();
