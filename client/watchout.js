var gameParameters = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 0
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var updateScore = function(){
  d3.select('.current').select('span').text(gameStats.score.toString());
};

var updateBestScore = function(){
  var maxScore = Math.max(gameStats.bestScore, gameStats.score);
  gameStats.bestScore = maxScore;
  d3.select('.highscore').select('span').text(maxScore.toString());
};

var increaseScore = function() {
  gameStats.score++;
  updateScore();
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

var gameBoard = d3.select('.board').append("svg")
                                   .attr('width', gameParameters.width)
                                   .attr('height', gameParameters.height);

gameBoard.append("rect").attr('width', gameParameters.width)
                        .attr('height', gameParameters.height)
                        .attr('fill','blue');



var drag = d3.behavior.drag().on('drag', function(){
  d3.select(this).attr("cx", limiter('x',d3.event.x,0))
                      .attr("cy", limiter('y',d3.event.y,0));
});

var player = gameBoard.append('circle')
                      .classed('player',true)
                      .attr('r', 10)
                      .attr('fill', 'black')
                      .attr('cx', gameParameters.width/2)
                      .attr('cy', gameParameters.height/2)
                      .call(drag);

var enemies = [];
var enemizer = function(){
  for(var i = 0 ; i < gameParameters.nEnemies; i++){
    var enemy = {
      id: i,
      x: Math.floor(limiter('x', Math.random()*gameParameters.width,0)),
      y: Math.floor(limiter('y', Math.random()*gameParameters.height,0)),
      r: 0
    };
    enemies.push(enemy);
  }

  var svg = gameBoard.selectAll('svg.enemy')
                     .data(enemies)
                     .enter()
                     .append("svg")
                     .attr('class','enemy')
                     .attr("width", 32)
                     .attr("height", 32)
                     .attr("x", function(d){return d.x;})
                     .attr("y",function(d){return d.y;});

  var g = svg.append("g");
  var img = g.append("svg:image")
                     .attr("xlink:href", "asteroid.png")
                     .attr("width", 32)
                     .attr("height", 32);           
};

var moveEnemies = function(){
  for(var i = 0; i < enemies.length; i++) {
    enemies[i].x = Math.floor(limiter('x', Math.random()*gameParameters.width,0));
    enemies[i].y = Math.floor(limiter('y', Math.random()*gameParameters.height,0));
  }
  d3.selectAll('svg.enemy').data(enemies)
                        .transition()
                        .duration(2000)
                        .attr("x", function(d){return d.x;})
                        .attr("y",function(d){return d.y;})
                        .tween('fancyTween', ourTween);
};

var onCollision = function() {
  updateBestScore();
  gameStats.score = 0;
  updateScore();
  d3.select('.collisions').select('span').text(gameStats.collisions++);
};

var checkCollision = function(enemy){
  var radiusSum =  parseFloat(enemy.attr('width')/2) + parseFloat(player.attr('r'));
  var xDiff = parseFloat(enemy.attr('x')) - player.attr('cx');
  var yDiff = parseFloat(enemy.attr('y')) - player.attr('cy');

  var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2));
  if(separation <= radiusSum){
    onCollision();
  }  
};
var ourTween = function(endData) {
  var enemy = d3.select(this);
  /*var startPosition = [];
  startPosition[0] = parseFloat(enemy.attr('cx'));
  startPosition[1] = parseFloat(enemy.attr('cy'));
  var endPosition = [endData.x, endData.y];*/
    return function (tick){
      checkCollision(enemy);
      // var enemyNextPosition = [];
      // enemyNextPosition[0] = startPosition[0] + (endPosition[0] - startPosition[0]) * tick;
      // enemyNextPosition[1] = startPosition[1] + (endPosition[1] - startPosition[1]) * tick;
      // enemy.attr('cx', enemyNextPosition[0])
      //      .attr('cy', enemyNextPosition[1]);
    };
};

enemizer();
setInterval(increaseScore, 50);
setInterval(moveEnemies, 2000);


