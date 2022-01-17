class Game {
  constructor() {
    this.resetButton = createButton([]);
    this.resetTitle = createElement("h2");

    this.leaderBoard = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.carisMoving = false;
    this.isLeftKeyActive = false;
    this.blast = false;

  }
  handelElements()
  {
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("reset");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100);

    this.leaderBoard.html("leaderBoard");
    this.leaderBoard.class("resetText");
    this.leaderBoard.position(width/3-60,40);
    
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,120);

  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getPlayerCount();
    car1 = createSprite(200,200,20,20);
    car1.addImage(car1Image);
    car1.addImage("blust",boom);
    car1.scale = 0.08;
    car2 = createSprite(400,200,20,20);
    car2.addImage(car2Image);
    car2.addImage("blust",boom);
    car2.scale = 0.08;
    cars = [car1,car2];
    
    fuels = new Group();
    this.addSprites(fuels,10,fuel,0.02);
    coins = new Group();
    this.addSprites(coins,50,coin,0.08);

    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image }
      
    ];

    //Adding obstacles sprite in the game
    this.addSprites(
      obstacles,
      obstaclesPositions.length,
      obstacle1Image,
      0.04,
      obstaclesPositions
    );
  }
  getGameState()
  {
    var gameRef = database.ref("gameState");
    gameRef.on("value",(data)=>{
      gameState = data.val();
    })
  }
  updateGameState(count)
  {
    var gameRef = database.ref("/");
    gameRef.update({
      gameState: count
    });
  }
  play()
  {
    form.hide();
    this.handelResetButton();
    Player.getPlayers();
    player.getcarAtEnd();
    if(allPlayers !== undefined)
    {
      image(track,0,-height*5,width,height*6);
      this.handelElements();
      this.showLeaderBoard();
      
      var index = 0;
      const finishLine = height*6-100;


      for(var obj in allPlayers)
      {
        index = index+1;
        var x = allPlayers[obj].positionX;
        var y = height-100;
        
        if(x === 0 && index === 1)
        {
          x = width/2-100;
        }
        else if(x === 0 && index === 2)
        {
          x = width/2+100;
        }
              
        allPlayers[obj].positionX = x;
        cars[index-1].position.x = x;
        cars[index-1].position.y = y-allPlayers[obj].positionY;
        if(index === player.index)
        {
          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
          fill("red");
          ellipse( cars[index-1].position.x, cars[index-1].position.y,60,60);
          player.positionX = x;
          player.updatePlayer();
          this.handelFuel(index);
          this.handelCoin(index);
          this.collisitionWithObstacle(index);
          this.collisitionWithCar(index);

          var currentLive = allPlayers[obj].live;
        if(currentLive <= 0)
        {
            console.log("Enter");
            cars[index-1].changeImage("blust");
            cars[index-1].scale = 0.5;
        }
          
        }
        this.fuelBar();
        this.liveBar();
      
      }
      if(player.index !== null)
      {
        this.handelPlayerControl();
      }    
      if(player.positionY> finishLine)
      {
        gameState = 2;
        player.rank = player.rank+1;
        player.updatePlayer();
        Player.updateCarAtEnd(player.rank);
        this.showRank();
      }
      if(player.live <= 0)
      {
        this.blast = true;
        this.carisMoving = false;
        gameState = 2;
      }

      drawSprites();
    }
  }

  handelPlayerControl()
  {
    if(!this.blast)
    {
      if(keyIsDown(UP_ARROW) )
      {
        this.carisMoving = true;
        player.positionY = player.positionY+10;
        player.updatePlayer();
        this.isLeftKeyActive = false;
        
      }
      if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300 )
      {
        this.carisMoving = true;
        player.positionX = player.positionX+5;
        player.updatePlayer();
        this.isLeftKeyActive = false;
      }
      if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50 )
      {
        this.carisMoving = true;
        player.positionX = player.positionX-5;
        player.updatePlayer();
        this.isLeftKeyActive = true;
      }
    }
   

  }
  showLeaderBoard()
  {
    var leader1,leader2;
    debugger;
    var players = Object.values(allPlayers);
    
    if((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1)
    {
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }
    if(players[1].rank === 1)
    {
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handelResetButton()
  {
    this.resetButton.mousePressed(()=>{
      
      database.ref('/').update({
        playerCount:0,
        gameState:0,
        CarAtEnd:0,
        players:{}
      })
      window.location.reload();
    })

  }
  addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions = [])
  {
      for(var i=0;i<numberOfSprites;i++)
      {
        if(positions.length>0)
        {
          var x = positions[i].x;
          var y = positions[i].y;
          spriteImage = positions[i].image; 
        }
        else
        {
          var x = random(width/2-200,width/2+200);
          var y = random((-height*5)+200,height-400);
        }       
        var sprite = createSprite(x,y,20,20);
        sprite.addImage(spriteImage);
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
  }
  handelFuel(index)
  {
      cars[index-1].overlap(fuels,(collector,collected)=>{
        collected.remove();
        player.fuel = 185;
      })
      if(player.fuel>0 && this.carisMoving)
      {
        player.fuel = player.fuel-0.3;
        
      }
      if(player.fuel <= 0 )
      {
        gameState = 2;
      }
  }
  handelCoin(index)
  {
    cars[index-1].overlap(coins,(collector,collected)=>{
      collected.remove();
      player.score = player.score+20;
    })
    
  }
  fuelBar()
  {
    
    image(fuel,player.positionX-150,height-player.positionY-200,20,20);
    push();
    fill('white');
    rect(player.positionX-120,height-player.positionY-200,185,20);
    fill('green');
    rect(player.positionX-120,height-player.positionY-200,player.fuel,20);
    pop();

  }
  liveBar()
  {
    image(live,player.positionX-150,height-player.positionY-250,20,20);
    push();
    fill('white');
    rect(player.positionX-120,height-player.positionY-250,185,20);
    fill('red');
    rect(player.positionX-120,height-player.positionY-250,player.live,20);
    pop();

  }
  showRank()
  {
    swal({
      title:`Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text:"Congratulation",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"OK"
    })
      
  }
  collisitionWithObstacle(index)
  {
      if(cars[index-1].collide(obstacles))
      {
        if(this.isLeftKeyActive)
        {
          player.positionX = player.positionX+100;
        }
        else
        {
            player.positionX = player.positionX-100;
        }
        if(player.live > 0)
        {
          player.live = player.live-(185/4);
          player.updatePlayer();
        }
      }
  }
  collisitionWithCar(index)
  {
    var carIndex;
    if(index === 1)
    {
      carIndex = 0;
    }
    else if(index === 2)
   {
      carIndex = 1;
   }
   if(cars[index-1].collide(cars[carIndex]))
   {
    if(this.isLeftKeyActive)
    {
      player.positionX = player.positionX+100;
    }
    else
    {
        player.positionX = player.positionX-100;
    }
    if(player.live > 0)
    {
      player.live = player.live-(185/4);
      player.updatePlayer();
    }
   }
  }
  
}