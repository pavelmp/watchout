var gameParameters = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 30
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var limiter = function(axis, value, size) {
  var result;
  if(axis === 'x') {
    result = Math.min(gameParameters.width - gameParameters.padding-size/2, Math.max(value, gameParameters.padding)-size/2);
  }
  if(axis === 'y') {
    result = Math.min(gameParameters.height - gameParameters.padding-size/2, Math.max(value, gameParameters.padding)-size/2);
  }
  return result;
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

var drag = d3.behavior.drag().on('drag', function(){
  d3.select('.player').transition().style("left", limiter('x',d3.event.x,64) + "px")
                      .style("top", limiter('y',d3.event.y,64) + "px");   

});

var Player = function(){
  this.x = gameParameters.width/2-32;
  this.y = gameParameters.height/2-32;

  d3.select('.board').append('div').classed('player',true)
                                      .style('left', this.x.toString() + "px")
                                      .style('top', this.y.toString() + "px")
                                      .call(drag);
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
      x: limiter('x', Math.random()*gameParameters.width,32),
      y: limiter('y', Math.random()*gameParameters.height,32),
      r: 0
    };
    enemies.push(enemy);
  }
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
    enemies[i].x = limiter('x', Math.random()*gameParameters.width,32);
    enemies[i].y = limiter('y', Math.random()*gameParameters.height,32);
  }
  d3.selectAll('.enemy').data(enemies)
                        .transition()
                        .duration(2000)
                        .style("left", function(d){return d.x + "px";})
                        .style("top", function(d){return d.y + "px";});
};

//var coord = [0,0];




/*
var movePlayer = function() {
  //var player = d3.selectAll('.player');
    d3.selectAll('div').on('mouseover',function(){
      coord = d3.mouse(this);
    });
    //console.log(coord);
};

    d3.select('.player').transition().duration(10)
                        .style("left", coord[0] + "px")
                        .style("top", coord[1] + "px");   
*/

enemizer();
var player1 = new Player();
//setInterval(movePlayer, 1);
setInterval(moveEnemies, 2000);


