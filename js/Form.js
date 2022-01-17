class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }
  handelElements(){
    this.input.position(width/2-130,height/2-100);
    this.input.class("customInput");
    this.playButton.position(width/2-115,height/2);
    this.playButton.class("customButton");
    this.titleImg.position(width/4-350,100);
    this.titleImg.class("gameTitle");
    this.greeting.position(width/2,height/2);
  }
  
  display()
  {
    this.handelElements();
    this.handelButtonClick();
  }
  handelButtonClick()
  {
    this.playButton.mousePressed(()=>{
      var name= this.input.value();
      this.input.hide();
      this.playButton.hide();
      playerCount = playerCount+1;
      player.name = name;
      player.index = playerCount;
      player.addPlayer();
      player.updatePlayerCount(playerCount);
      this.greeting.html(`hello ${name} `);     //directly printing the  name of the player
    });
  }
}
