var gameParameters = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var gameBoard = d3.select('.board').style({width: gameParameters.width.toString()+'px'})
                                   .style({height: gameParameters.height.toString()+'px'});

var updateScore = function(){
  d3.select('.current').select('span').text(gameStats.score.toString());
};

var updateBestScore = function(){
  var maxScore = Math.max(gameStats.bestScore, gameStats.score);
  gameStats.bestScore = maxScore;
  d3.select('.highscore').select('span').text(maxScore.toString());
};

var Player = function(){
  this.x = gameParameters.width/2-32;
  this.y = gameParameters.height/2-32;

  d3.select('.board').append('div').classed('player',true)
                                      .style('left', this.x.toString() + "px")
                                      .style('top', this.y.toString() + "px")
};

Player.prototype.set = function(axis, value) {
  var minimum = gameParameters.padding;
  var maxX = gameBoard.width - minimum;
  var maxY = gameBoard.height - minimum;
  if(axis === "x"){
    this.x = Math.max(Math.min(maxX, value), minimum);
  } else if(axis === "y"){
    this.y = Math.max(Math.min(maxY, value), minimum);
  }
};

var enemies = [];
var enemizer = function(){
  for(var i = 0 ; i < gameParameters.nEnemies; i++){
    var enemy = {
      id: i,
      x: Math.min(gameParameters.width - gameParameters.padding-16, Math.max(Math.random()*gameParameters.width, gameParameters.padding)-16),
      y: Math.min(gameParameters.height - gameParameters.padding-16, Math.max(Math.random()*gameParameters.height, gameParameters.padding)-16),
      r: 0
    };
    enemies.push(enemy);
  }
  console.log(enemies);
  d3.select('.board').selectAll('.enemy')
                     .data(enemies)
                     .enter()
                     .append("div")
                     .attr('class','enemy')
                     .style("left", function(d){return d.x + "px";})
                     .style("top", function(d){return d.y + "px";});
};


var moveEnemies = function(){
  for(var i = 0; i < enemies.length; i++) {
    enemies[i].x = Math.min(gameParameters.width - gameParameters.padding-16, Math.max(Math.random()*gameParameters.width, gameParameters.padding)-16);
    enemies[i].y = Math.min(gameParameters.height - gameParameters.padding-16, Math.max(Math.random()*gameParameters.height, gameParameters.padding)-16);
  }
  d3.selectAll('.enemy').data(enemies)
                        .transition()
                        .duration(2000)
                        .style("left", function(d){return d.x + "px";})
                        .style("top", function(d){return d.y + "px";});
};
//player1();
enemizer();
var player1 = new Player();

setInterval(moveEnemies, 2000);

