package menu
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import game.Game;
   import game.objects.InfoObject;
   import game.objects.SoundObject;
   import menu.screens.ScreenCredits;
   import menu.screens.ScreenGame;
   import menu.screens.ScreenHighScores;
   import menu.screens.ScreenMainMenu;
   import ui.UI;
   
   public class Menu extends Sprite
   {
      
      public static var miniLogoMain:MovieClip;
      
      public static var miniLogoHigh:MovieClip;
      
      public static var miniLogoGame:MovieClip;
      
      public static const NEW_GAME:String = "newGame";
      
      public static const LOAD_GAME:String = "loadGame";
      
      private var _btnSoundOffOn:ButtonSoundOffOn = new ButtonSoundOffOn();
      
      private var _game:Game;
      
      private var _infoObject:InfoObject;
      
      private var _screenCredits:ScreenCredits = new ScreenCredits();
      
      private var _screenGame:ScreenGame = new ScreenGame();
      
      private var _screenHighScores:ScreenHighScores;
      
      private var _screenMainMenu:ScreenMainMenu = new ScreenMainMenu();
      
      private var _soundObject:SoundObject;
      
      private var _ui:UI;
      
      private var _totalText:TextField = new TextField();
      
      private var _scoreText:TextField = new TextField();
      
      private var _moneyText:TextField = new TextField();
      
      private var _textFormat:TextFormat = new TextFormat(Main.fontCooper.fontName,36,16577769,null,true,null,null,null,TextFormatAlign.LEFT);
      
      public function Menu(game:Game, infoObject:InfoObject, ui:UI, soundObject:SoundObject)
      {
         super();
         this._game = game;
         this._infoObject = infoObject;
         this._ui = ui;
         this._soundObject = soundObject;
         this.init();
      }
      
      private function init() : void
      {
         this._soundObject.onMusicMenu();
         this.soundChangeHandler();
         this._screenHighScores = new ScreenHighScores(this._infoObject);
         this._screenGame.addChild(this._game);
         this._screenGame.addChild(this._ui);
         addChild(this._screenGame);
         addChild(this._screenCredits);
         addChild(this._screenHighScores);
         addChild(this._screenMainMenu);
         this._btnSoundOffOn.x = 20;
         this._btnSoundOffOn.y = 20;
         this._screenMainMenu.addChild(this._btnSoundOffOn);
         addEventListener(MouseEvent.CLICK,this.clickHandler);
         this._infoObject.addEventListener(InfoObject.GAME_COMPLETE,this.gameCompleteHandler);
         this._ui.addEventListener(UI.QUIT,this.quitHandler);
         this._soundObject.addEventListener(SoundObject.SOUND_CHANGE,this.soundChangeHandler);
         trace("finish");
      }
      
      private function clickLogo(event:MouseEvent) : void
      {
         Preloader.FogAPI.gotoFog();
      }
      
      private function clickHandler(event:MouseEvent) : void
      {
         var finalScore:int = 0;
         if(event.target is ButtonBack)
         {
            setChildIndex(this._screenMainMenu,numChildren - 1);
         }
         else if(event.target is ButtonSubmitScore)
         {
            this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refreshMoney);
            this._infoObject.addEventListener(InfoObject.REFRESH_SCORES,this.refreshScores);
            finalScore = this._infoObject.scores + this._infoObject.amountMoney;
            Preloader.FogAPI.submitScore(finalScore);
         }
         else if(event.target is ButtonCredits)
         {
            setChildIndex(this._screenCredits,numChildren - 1);
         }
         else if(event.target is ButtonNewGame)
         {
            setChildIndex(this._screenGame,numChildren - 1);
            dispatchEvent(new Event(Menu.NEW_GAME));
            trace("new games started");
         }
         else if(event.target is ButtonHighScores)
         {
            setChildIndex(this._screenHighScores,numChildren - 1);
            this._soundObject.soundOn = !this._soundObject.soundOn;
         }
         else if(event.target is ButtonLoad)
         {
            if(Boolean(this._infoObject.lso.data.write))
            {
               setChildIndex(this._screenGame,numChildren - 1);
               dispatchEvent(new Event(Menu.LOAD_GAME));
            }
         }
         else if(event.target is ButtonSoundOffOn)
         {
            this._soundObject.soundOn = !this._soundObject.soundOn;
         }
         else if(event.target is ButtonAddGame)
         {
            Preloader.FogAPI.gotoFreeGames();
         }
      }
      
      private function gameCompleteHandler(event:Event) : void
      {
         setChildIndex(this._screenCredits,numChildren - 1);
         this._screenCredits.addChild(this._totalText);
         this._totalText.defaultTextFormat = this._textFormat;
         this._totalText.x = 280;
         this._totalText.y = 223;
         this._totalText.width = 100;
         this._totalText.height = 50;
         this._totalText.text = String(this._infoObject.scores + this._infoObject.amountMoney);
         trace("level comp");
      }
      
      public function refreshScores(event:Event = null) : void
      {
      }
      
      public function refreshMoney(event:Event = null) : void
      {
      }
      
      private function quitHandler(event:Event) : void
      {
         setChildIndex(this._screenMainMenu,numChildren - 1);
      }
      
      private function soundChangeHandler(event:Event = null) : void
      {
         if(this._soundObject.soundOn)
         {
            this._btnSoundOffOn.gotoAndStop(2);
         }
         else
         {
            this._btnSoundOffOn.gotoAndStop(1);
         }
      }
   }
}

