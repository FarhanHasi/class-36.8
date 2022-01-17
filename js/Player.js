class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.live = 185;
    
  }
  getPlayerCount()
  {
    var playerRef = database.ref("playerCount");
    playerRef.on("value",(data)=>{
      playerCount = data.val();
    })
  }
  updatePlayerCount(count)
  {
    var playerRef = database.ref("/");
    playerRef.update({
      playerCount: count
    });
  }
  addPlayer()
  {
    var playerRef = database.ref("players/player"+this.index);
    playerRef.update({
      name:this.name,
      index: this.index,
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score,
      fuel:this.fuel,
      live:this.live
    });
  }
  updatePlayer()
  {
    var playerRef = database.ref("players/player"+this.index);
    playerRef.update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score,
      fuel:this.fuel,
      live:this.live
    });  
  }
  static getPlayers()
  {
    var playersRef = database.ref("players");
    playersRef.on("value",(data)=>{
      allPlayers = data.val()
    })
  }
  getcarAtEnd()
  {
    var carAtEnd = database.ref("CarAtEnd");
    carAtEnd.on("value",(data)=>{
      this.rank = data.val();
    })
  }
  static updateCarAtEnd(count)
  {
    var carRef = database.ref("/");
    carRef.update({
      CarAtEnd:count
    }); 
  }
}
