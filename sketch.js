var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount;
var gameState = 0;
var car1,car2,car1Image, car2Image,track;
var allPlayers;

var fuels,coins,live;
var obstacle1Image,obstacle2Image;

var obstacles;

var cars = []; 

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Image = loadImage("./assets/car1.png");
  car2Image = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  fuel = loadImage("./assets/fuel.png");
  coin = loadImage("./assets/goldCoin.png");
  obstacle1Image  = loadImage("./assets/obstacle1.png");
  obstacle2Image  = loadImage("./assets/obstacle2.png");
  live = loadImage("./assets/life.png");
  boom = loadImage("./assets/blast.png");

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getGameState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount === 2){
    game.updateGameState(1);

  }
  if(gameState === 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
