package
{
   import flash.display.MovieClip;
   import flash.display.StageAlign;
   import flash.display.StageScaleMode;
   import flash.events.Event;
   import flash.text.Font;
   import game.Game;
   import game.objects.AchivementsObject;
   import game.objects.InfoObject;
   import game.objects.SoundObject;
   import menu.Menu;
   import ui.UI;
   
   [SWF(width="640", height="480", backgroundColor="#ffffff", frameRate="30")]
   public class Main extends MovieClip
   {
      
      public static var fontCooper:Font = new Cooper_std();
      
      private var _achivementsObject:AchivementsObject;
      
      private var _game:Game;
      
      private var _infoObject:InfoObject;
      
      private var _menu:Menu;
      
      private var _soundObject:SoundObject;
      
      private var _ui:UI;
      
      public function Main()
      {
         super();
      }
      
      public function loadAPI(Fogx:fog, mainX:Object) : void
      {
         Preloader.FogAPI = Fogx;
         Preloader.main = mainX;
         this.init();
      }
      
      private function init(e:Event = null) : void
      {
         trace("MainIsDone");
         Preloader.main.grabCurrency(InfoObject,"_amountMoney");
         removeEventListener(Event.ADDED_TO_STAGE,this.init);
         stage.scaleMode = StageScaleMode.NO_SCALE;
         stage.align = StageAlign.TOP_LEFT;
         this._infoObject = new InfoObject();
         this._game = new Game(this._infoObject);
         this._game.addEventListener(Game.LEVEL_COMPLETE,this.levelCompleteHandler);
         this._game.addEventListener(Game.LEVEL_FAILED,this.levelFailedHandler);
         this._achivementsObject = new AchivementsObject(this._game,this._infoObject);
         this._soundObject = new SoundObject();
         this._ui = new UI(this._game,this._infoObject,this._soundObject,this._achivementsObject);
         this._ui.addEventListener(UI.QUIT,this.quitHandler);
         this._ui.addEventListener(UI.RESTART,this.restartHandler);
         this._menu = new Menu(this._game,this._infoObject,this._ui,this._soundObject);
         addChild(this._menu);
         this._menu.addEventListener(Menu.LOAD_GAME,this.loadGameHandler);
         this._menu.addEventListener(Menu.NEW_GAME,this.newGameHandler);
         this._infoObject.addEventListener(InfoObject.GAME_COMPLETE,this.gameCompleteHandler);
      }
      
      private function gameCompleteHandler(event:Event) : void
      {
         this._soundObject.onMusicMenu();
      }
      
      private function levelCompleteHandler(event:Event) : void
      {
         ++this._infoObject.currentLevel;
         this._infoObject.saveGame(this._game.arrayWeapons,this._achivementsObject.arrayAchivements);
         this._soundObject.onMusicMenu();
      }
      
      private function levelFailedHandler(event:Event) : void
      {
         this._achivementsObject.arrayAchivements = this._infoObject.loadGame();
         this._game.arrayWeapons = this._infoObject.arrayCurrentWeapons;
         this._soundObject.onMusicMenu();
      }
      
      private function loadGameHandler(event:Event) : void
      {
         this._achivementsObject.arrayAchivements = this._infoObject.loadGame();
         this._game.barrage.health = this._infoObject.currentHealth;
         this._game.arrayWeapons = this._infoObject.arrayCurrentWeapons;
      }
      
      private function newGameHandler(event:Event) : void
      {
         this._game.dispose();
         this._ui.removeScreenLevelVictory();
         this._infoObject.newGame();
         this._achivementsObject.arrayAchivements = [];
         this._infoObject.saveGame(this._game.arrayWeapons,this._achivementsObject.arrayAchivements);
         this._game.arrayWeapons = this._infoObject.arrayCurrentWeapons;
         this._game.barrage.health = this._infoObject.currentHealth;
      }
      
      private function quitHandler(event:Event) : void
      {
         this._game.dispose();
         this._soundObject.onMusicMenu();
      }
      
      private function restartHandler(event:Event) : void
      {
         this._game.dispose();
         this._achivementsObject.arrayAchivements = this._infoObject.loadGame();
         this._game.barrage.health = this._infoObject.currentHealth;
         this._game.arrayWeapons = this._infoObject.arrayCurrentWeapons;
         this._soundObject.onMusicMenu();
      }
   }
}

