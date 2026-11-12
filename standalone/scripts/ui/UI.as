package ui
{
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.events.TimerEvent;
   import flash.media.Sound;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import flash.ui.Mouse;
   import flash.utils.getDefinitionByName;
   import game.Game;
   import game.objects.AchivementsObject;
   import game.objects.BarrageObject;
   import game.objects.InfoObject;
   import game.objects.SoundObject;
   import game.objects.TurretObject;
   import ui.buttons.ButtonOpenView;
   import ui.screens.ScreenAchivements;
   import ui.screens.ScreenHelp;
   import ui.screens.ScreenLevelFailed;
   import ui.screens.ScreenLevelVictory;
   import ui.screens.ScreenPause;
   import ui.screens.ScreenUIGame;
   import ui.views.ViewBarrageHealth;
   import ui.views.ViewBoughtOMP;
   import ui.views.ViewHealth;
   import ui.views.ViewInventory;
   import ui.views.ViewOMP;
   import ui.views.ViewProcess;
   import ui.views.ViewWeaponCross;
   import ui.views.ViewWeapons;
   
   public class UI extends Sprite
   {
      
      public static const QUIT:String = "quit";
      
      public static const RESTART:String = "restarta";
      
      private var _achivementsObject:AchivementsObject;
      
      private var _arrayViewHealth:Array = [];
      
      private var _btnSoundOffOn:ButtonSoundOffOn = new ButtonSoundOffOn();
      
      private var _btnOpenViewInventory:ButtonOpenView;
      
      private var _btnOpenViewOMP:ButtonOpenView;
      
      private var _btnOpenViewWeapon:ButtonOpenView;
      
      private var _btnStartLevel:ButtonStartLevel = new ButtonStartLevel();
      
      private var _game:Game;
      
      private var _infoObject:InfoObject;
      
      private var _screenAchivements:ScreenAchivements = new ScreenAchivements();
      
      private var _screenHelp:ScreenHelp = new ScreenHelp();
      
      private var _screenLevelFailed:ScreenLevelFailed = new ScreenLevelFailed();
      
      private var _screenLevelVictory:ScreenLevelVictory = new ScreenLevelVictory();
      
      private var _screenPause:ScreenPause = new ScreenPause();
      
      private var _screenUIGame:ScreenUIGame = new ScreenUIGame();
      
      private var _soundObject:SoundObject;
      
      private var _spriteForViewHealth:Sprite = new Sprite();
      
      private var _viewBarrageHealth:ViewBarrageHealth;
      
      private var _viewBoughtOMP:ViewBoughtOMP;
      
      private var _viewInventory:ViewInventory;
      
      private var _viewOMP:ViewOMP;
      
      private var _viewProcess:ViewProcess;
      
      private var _viewSkinForInstall:Sprite = new Sprite();
      
      private var _viewWeapons:ViewWeapons;
      
      private var _viewWeaponCross:ViewWeaponCross;
      
      private var _scores:int;
      
      private var _contentScoreVictory:ContentScreenLevelVictory;
      
      private var _contentScreen:ContentScreenUIGame = new ContentScreenUIGame();
      
      private var _textFormat:TextFormat = new TextFormat(Main.fontCooper.fontName,18,16577769,null,true,null,null,null,TextFormatAlign.LEFT);
      
      private var _scoreText:TextField = new TextField();
      
      private var _moneyText:TextField = new TextField();
      
      private var _totalText:TextField = new TextField();
      
      private var newPauseButton:ButtonPause = new ButtonPause();
      
      public function UI(game:Game, infoObject:InfoObject, soundObject:SoundObject, achivementsObject:AchivementsObject)
      {
         super();
         this._achivementsObject = achivementsObject;
         this._game = game;
         this._infoObject = infoObject;
         this._soundObject = soundObject;
         this.init();
      }
      
      private function init() : void
      {
         this._screenUIGame.addChild(this.newPauseButton);
         this.newPauseButton.addEventListener(MouseEvent.CLICK,this.newPause,true);
         this.newPauseButton.x = 500;
         this.newPauseButton.y = 9;
         addChild(this._screenUIGame);
         this._screenUIGame.addEventListener(MouseEvent.CLICK,this.clickHandler,true);
         this._screenUIGame.addChild(this._spriteForViewHealth);
         this._btnSoundOffOn.x = 600;
         this._btnSoundOffOn.y = 10;
         this._screenUIGame.addChild(this._btnSoundOffOn);
         this._viewBarrageHealth = new ViewBarrageHealth(this._game.barrage);
         this._viewBarrageHealth.x = 30;
         this._viewBarrageHealth.y = 425;
         this._screenUIGame.addChild(this._viewBarrageHealth);
         this._viewBoughtOMP = new ViewBoughtOMP(this._game,this._infoObject);
         this._viewBoughtOMP.x = this._viewBarrageHealth.x + this._viewBarrageHealth.width + 40;
         this._viewBoughtOMP.y = 425;
         this._screenUIGame.addChild(this._viewBoughtOMP);
         this._viewInventory = new ViewInventory(this._game,this._infoObject);
         this._viewInventory.x = 115;
         this._viewInventory.y = 355;
         this._viewOMP = new ViewOMP(this._infoObject);
         this._viewOMP.x = 312;
         this._viewOMP.y = 355;
         this._viewSkinForInstall.mouseChildren = false;
         this._viewSkinForInstall.mouseEnabled = false;
         addChild(this._viewSkinForInstall);
         this._viewWeapons = new ViewWeapons(this._game,this._infoObject);
         this._viewWeapons.x = 382;
         this._viewWeapons.y = 355;
         this._viewProcess = new ViewProcess(this._game,this._infoObject);
         this._screenUIGame.addChild(this._viewProcess);
         this._viewWeaponCross = new ViewWeaponCross(this._game);
         this._viewWeaponCross.mouseEnabled = false;
         this._viewWeaponCross.mouseChildren = false;
         this._btnOpenViewInventory = new ButtonOpenView(this._viewInventory);
         this._btnOpenViewInventory.x = 326;
         this._btnOpenViewInventory.y = 417;
         this._btnOpenViewInventory.mouseChildren = false;
         this._screenUIGame.addChild(this._btnOpenViewInventory);
         this._btnOpenViewOMP = new ButtonOpenView(this._viewOMP);
         this._btnOpenViewOMP.x = 431;
         this._btnOpenViewOMP.y = this._btnOpenViewInventory.y;
         this._btnOpenViewOMP.mouseChildren = false;
         this._screenUIGame.addChild(this._btnOpenViewOMP);
         this._btnOpenViewWeapon = new ButtonOpenView(this._viewWeapons);
         this._btnOpenViewWeapon.x = 535;
         this._btnOpenViewWeapon.y = this._btnOpenViewInventory.y;
         this._btnOpenViewWeapon.mouseChildren = false;
         this._screenUIGame.addChild(this._btnOpenViewWeapon);
         this._btnStartLevel.x = 290 - this._btnStartLevel.width / 2;
         this._btnStartLevel.y = 240 - this._btnStartLevel.height / 2;
         this._btnStartLevel.buttonMode = true;
         this._btnStartLevel.useHandCursor = true;
         this._screenUIGame.addChild(this._btnStartLevel);
         if(this._infoObject.currentHealth <= 1)
         {
            this._btnStartLevel.gotoAndStop(3);
         }
         else
         {
            this._btnStartLevel.gotoAndStop(1);
         }
         this._game.addEventListener(Game.LEVEL_FAILED,this.levelFailedHandler);
         this._game.addEventListener(Game.LEVEL_COMPLETE,this.levelCompleteHandler);
         this._game.addEventListener(Game.PAUSE,this.pauseHandler);
         this._game.addEventListener(Game.REFRESH_SKIN_INSTALL,this.refreshSkinInstallHandler);
         this._game.addEventListener(Game.REFRESH_TURRETS,this.refreshViewHealth);
         this._game.barrage.addEventListener(BarrageObject.REFRESH_BARRAGE_HEALTH,this._viewBarrageHealth.refresh);
         this._game.timerGame.addEventListener(TimerEvent.TIMER,this.update);
         this._achivementsObject.addEventListener(AchivementsObject.REFRESH_ACHIVEMENT,this.refreshAchivementHandler);
         this._achivementsObject.addEventListener(AchivementsObject.ADD_ACHIVEMENT,this.addAchievementHandler);
         this._soundObject.addEventListener(SoundObject.SOUND_CHANGE,this.soundChangeHandler);
         this.soundChangeHandler();
      }
      
      public function removeScreenLevelVictory() : void
      {
         if(this._screenUIGame.contains(this._screenLevelVictory))
         {
            this._screenUIGame.addChild(this._spriteForViewHealth);
            this._screenUIGame.removeChild(this._screenLevelVictory);
            this._screenUIGame.addChild(this._btnStartLevel);
         }
      }
      
      private function refreshAchivementHandler(event:Event) : void
      {
         this._screenAchivements.refreshScreen(this._achivementsObject.arrayAchivements);
      }
      
      private function addAchievementHandler(event:Event) : void
      {
         var achivement:MovieClip = null;
         this._screenAchivements.addAchivement(this._achivementsObject.addedAchivement);
         switch(this._achivementsObject.addedAchivement)
         {
            case AchivementsObject.ACHIVEMENTS_BRONZE:
               achivement = new ContentAchivementBronze();
               break;
            case AchivementsObject.ACHIVEMENTS_COMBO2:
               achivement = new ContentAchivementCombo2();
               break;
            case AchivementsObject.ACHIVEMENTS_COMBO5:
               achivement = new ContentAchivementCombo5();
               break;
            case AchivementsObject.ACHIVEMENTS_DEFENDER:
               achivement = new ContentAchivementDefender();
               break;
            case AchivementsObject.ACHIVEMENTS_GOLD:
               achivement = new ContentAchivementGold();
               break;
            case AchivementsObject.ACHIVEMENTS_SILVER:
               achivement = new ContentAchivementSilver();
         }
         var snd:Sound = new sndGong();
         snd.play();
         achivement.x = 550;
         achivement.y = 90;
         this._screenUIGame.addChildAt(achivement,this._screenUIGame.numChildren - 1);
         achivement.addEventListener(Event.ENTER_FRAME,this.enterFrameHandler);
      }
      
      private function enterFrameHandler(event:Event) : void
      {
         this._screenUIGame.addChildAt(event.currentTarget as MovieClip,this._screenUIGame.numChildren - 1);
         (event.currentTarget as MovieClip).alpha -= 0.01;
         if((event.currentTarget as MovieClip).alpha < 0.2)
         {
            this._screenUIGame.removeChild(event.currentTarget as MovieClip);
            (event.currentTarget as MovieClip).removeEventListener(Event.ENTER_FRAME,this.enterFrameHandler);
         }
      }
      
      private function clickHandler(event:MouseEvent) : void
      {
         var view:ViewHealth = null;
         var vH:ViewHealth = null;
         var finalScore:int = 0;
         if(event.target is ButtonResume)
         {
            if(!this._screenUIGame.contains(this._btnStartLevel))
            {
               this._game.pauseOn = false;
            }
            this._screenUIGame.removeChild(this._screenPause);
         }
         else if(event.target is ButtonRestart)
         {
            if(event.target.parent is ContentScreenLevelFailed)
            {
               this._screenUIGame.removeChild(this._screenLevelFailed);
               this._screenUIGame.addChild(this._btnStartLevel);
            }
            else
            {
               this._screenUIGame.removeChild(this._screenPause);
               this._screenUIGame.addChild(this._btnStartLevel);
            }
            this._screenUIGame.addChild(this._spriteForViewHealth);
            this._soundObject.onMusicMenu();
            if(this.contains(this._scoreText))
            {
               removeChild(this._scoreText);
            }
            if(this.contains(this._moneyText))
            {
               removeChild(this._moneyText);
            }
            if(this.contains(this._totalText))
            {
               removeChild(this._totalText);
            }
            dispatchEvent(new Event(UI.RESTART));
         }
         else if(event.target is ButtonQuit)
         {
            this._screenUIGame.removeChild(this._screenPause);
            this._screenUIGame.addChild(this._btnStartLevel);
            this._soundObject.onMusicMenu();
            dispatchEvent(new Event(UI.QUIT));
         }
         else if(event.target is ButtonAchivements)
         {
            this._game.pauseOn = true;
            this._screenUIGame.addChild(this._screenAchivements);
         }
         else if(event.target is ButtonCloseAchivements)
         {
            if(!this._screenUIGame.contains(this._btnStartLevel))
            {
               this._game.pauseOn = false;
            }
            this._screenUIGame.removeChild(this._screenAchivements);
         }
         else if(event.target is ButtonCloseHelp)
         {
            this._game.pauseOn = false;
            this._screenUIGame.removeChild(this._screenHelp);
         }
         else if(event.target is ButtonNext)
         {
            this._screenUIGame.addChild(this._spriteForViewHealth);
            this._screenUIGame.removeChild(this._screenLevelVictory);
            this._screenUIGame.addChild(this._btnStartLevel);
            if(this._infoObject.currentHealth <= 1)
            {
               this._btnStartLevel.gotoAndStop(3);
            }
            else
            {
               this._btnStartLevel.gotoAndStop(1);
            }
            if(this.contains(this._scoreText))
            {
               removeChild(this._scoreText);
            }
            if(this.contains(this._moneyText))
            {
               removeChild(this._moneyText);
            }
            if(this.contains(this._totalText))
            {
               removeChild(this._totalText);
            }
         }
         else if(event.target is ButtonStartLevel)
         {
            this._screenUIGame.removeChild(this._btnStartLevel);
            if(this._screenUIGame.contains(this._spriteForViewHealth))
            {
               this._screenUIGame.removeChild(this._spriteForViewHealth);
            }
            if(this.contains(this._scoreText))
            {
               removeChild(this._scoreText);
            }
            if(this.contains(this._moneyText))
            {
               removeChild(this._moneyText);
            }
            if(this.contains(this._totalText))
            {
               removeChild(this._totalText);
            }
            this._game.pauseOn = false;
            this._game.turretSkinForInstall = null;
            this._game.currentOMP = null;
            this._game.startLevel();
            this._soundObject.onMusicGame();
         }
         else if(event.target is ButtonPause)
         {
            this._game.pauseOn = true;
            this._screenUIGame.addChild(this._screenPause);
         }
         else if(event.target is ButtonSale)
         {
            view = event.target.parent as ViewHealth;
            this._game.saleTurret(view.object);
         }
         else if(event.target is ButtonTreat)
         {
            if(event.target.parent is ViewHealth)
            {
               vH = event.target.parent as ViewHealth;
               this._game.treatTurret(vH.object);
            }
            else if(event.target.parent is ViewBarrageHealth)
            {
               this._game.treatBarrage();
            }
         }
         else if(event.target is ButtonOpenView)
         {
            this._game.turretSkinForInstall = null;
            if(this._screenUIGame.contains(this._viewInventory))
            {
               this._screenUIGame.removeChild(this._viewInventory);
            }
            if(this._screenUIGame.contains(this._viewOMP))
            {
               this._screenUIGame.removeChild(this._viewOMP);
            }
            if(this._screenUIGame.contains(this._viewWeapons))
            {
               this._screenUIGame.removeChild(this._viewWeapons);
            }
            this._screenUIGame.addChild(ButtonOpenView(event.target).view);
         }
         else if(event.target is ButtonSubmitScore)
         {
            this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refreshMoney);
            this._infoObject.addEventListener(InfoObject.REFRESH_SCORES,this.refreshScores);
            finalScore = this._infoObject.scores + this._infoObject.amountMoney;
         }
      }
      
      public function refreshScores(event:Event = null) : void
      {
      }
      
      public function refreshMoney(event:Event = null) : void
      {
      }
      
      private function newPause(event:Event) : void
      {
         this._game.pauseOn = true;
         this._screenUIGame.addChild(this._screenPause);
      }
      
      private function levelFailedHandler(event:Event) : void
      {
         this._scoreText.defaultTextFormat = this._textFormat;
         this._scoreText.x = 314;
         this._scoreText.y = 135;
         this._scoreText.text = this._infoObject.scores.toString();
         this._scoreText.wordWrap = false;
         this._moneyText.defaultTextFormat = this._textFormat;
         this._moneyText.x = 320;
         this._moneyText.y = 177;
         this._moneyText.text = this._infoObject.amountMoney.toString();
         this._totalText.defaultTextFormat = this._textFormat;
         this._totalText.x = 309;
         this._totalText.y = 223;
         this._totalText.width = 88;
         this._totalText.height = 27;
         this._totalText.text = String(this._infoObject.scores + this._infoObject.amountMoney);
         this._infoObject.addEventListener(InfoObject.REFRESH_SCORES,this.refreshScores);
         this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refreshMoney);
         this._game.pauseOn = true;
         this._screenUIGame.addChild(this._screenLevelFailed);
      }
      
      private function levelCompleteHandler(event:Event) : void
      {
         this._infoObject.addEventListener(InfoObject.REFRESH_SCORES,this.refreshScores);
         this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refreshMoney);
         this._game.pauseOn = true;
         this._screenUIGame.addChild(this._screenLevelVictory);
         trace("level COMPLETE!");
         if(this._infoObject.currentLevel == 21)
         {
            if(this.contains(this._scoreText))
            {
               removeChild(this._scoreText);
            }
            if(this.contains(this._moneyText))
            {
               removeChild(this._moneyText);
            }
            if(this.contains(this._totalText))
            {
               removeChild(this._totalText);
            }
         }
      }
      
      private function pauseHandler(event:Event) : void
      {
         var i:int = 0;
         var item:ButtonOpenView = null;
         if(this._game.pauseOn)
         {
            if(contains(this._viewWeaponCross))
            {
               Mouse.show();
               removeChild(this._viewWeaponCross);
            }
            this._screenUIGame.removeEventListener(MouseEvent.ROLL_OVER,this.rollOverHandler);
            this._screenUIGame.removeEventListener(MouseEvent.ROLL_OUT,this.rollOutHandler);
            for(i = 0; i < this._screenUIGame.numChildren; i++)
            {
               if(this._screenUIGame.getChildAt(i) is ButtonOpenView)
               {
                  item = this._screenUIGame.getChildAt(i) as ButtonOpenView;
                  item.gotoAndStop(1);
                  item.mouseEnabled = true;
               }
            }
         }
         else
         {
            Mouse.hide();
            addChild(this._viewWeaponCross);
            this._screenUIGame.addEventListener(MouseEvent.ROLL_OVER,this.rollOverHandler);
            this._screenUIGame.addEventListener(MouseEvent.ROLL_OUT,this.rollOutHandler);
            for(i = 0; i < this._screenUIGame.numChildren; i++)
            {
               if(this._screenUIGame.getChildAt(i) is ButtonOpenView)
               {
                  item = this._screenUIGame.getChildAt(i) as ButtonOpenView;
                  item.gotoAndStop(2);
                  item.mouseEnabled = false;
               }
            }
            if(this._screenUIGame.contains(this._viewInventory))
            {
               this._screenUIGame.removeChild(this._viewInventory);
            }
            if(this._screenUIGame.contains(this._viewOMP))
            {
               this._screenUIGame.removeChild(this._viewOMP);
            }
            if(this._screenUIGame.contains(this._viewWeapons))
            {
               this._screenUIGame.removeChild(this._viewWeapons);
            }
         }
      }
      
      private function refreshSkinInstallHandler(event:Event) : void
      {
         var skin:DisplayObject = null;
         var sourceClass:Class = null;
         while(Boolean(this._viewSkinForInstall.numChildren))
         {
            this._viewSkinForInstall.removeChildAt(0);
         }
         if(Boolean(this._game.turretSkinForInstall))
         {
            sourceClass = getDefinitionByName(this._game.turretSkinForInstall.sourceClass) as Class;
            skin = new sourceClass();
            skin.x = skin.width / 2;
            skin.y = skin.height / 2;
            skin.alpha = 0.7;
            if(this._game.turretSkinForInstall.name == TurretObject.NAME_MAXIM)
            {
               skin.scaleX = skin.scaleY = 0.6;
            }
            else
            {
               skin.scaleX = skin.scaleY = 0.8;
            }
            this._viewSkinForInstall.addChild(skin);
         }
         else if(Boolean(this._game.currentOMP))
         {
            sourceClass = getDefinitionByName("ButtonSkinOMP" + this._game.currentOMP.name) as Class;
            skin = new sourceClass();
            skin.x = skin.width / 2;
            skin.y = skin.height / 2;
            skin.alpha = 0.7;
            skin.scaleX = skin.scaleY = 0.6;
            this._viewSkinForInstall.addChild(skin);
         }
      }
      
      private function refreshViewHealth(event:Event) : void
      {
         var i:int = 0;
         var j:int = 0;
         var turret:TurretObject = null;
         var view:ViewHealth = null;
         var isInArrayTurrets:Boolean = false;
         var isViewed:Boolean = false;
         if(this._arrayViewHealth.length > this._game.arrayTurrets.length)
         {
            for(i = 0; i < this._arrayViewHealth.length; i++)
            {
               view = this._arrayViewHealth[i];
               isInArrayTurrets = false;
               if(!this._game.arrayTurrets.length)
               {
                  isInArrayTurrets = false;
               }
               else
               {
                  for(j = 0; j < this._game.arrayTurrets.length; j++)
                  {
                     if(this._game.arrayTurrets[j] === view.object)
                     {
                        isInArrayTurrets = true;
                     }
                  }
               }
               if(!isInArrayTurrets)
               {
                  this._spriteForViewHealth.removeChild(view);
                  this._arrayViewHealth.splice(this._arrayViewHealth.indexOf(view),1);
                  view.dispose();
                  view = null;
                  i--;
               }
            }
         }
         else if(this._arrayViewHealth.length < this._game.arrayTurrets.length)
         {
            for(i = 0; i < this._game.arrayTurrets.length; i++)
            {
               turret = this._game.arrayTurrets[i] as TurretObject;
               isViewed = false;
               for(j = 0; j < this._arrayViewHealth.length; j++)
               {
                  view = this._arrayViewHealth[j];
                  if(turret == view.object)
                  {
                     isViewed = true;
                  }
               }
               if(!isViewed)
               {
                  view = new ViewHealth(turret);
                  this._arrayViewHealth.push(view);
                  this._spriteForViewHealth.addChild(view);
               }
            }
         }
      }
      
      private function rollOverHandler(event:MouseEvent) : void
      {
         Mouse.show();
         removeChild(this._viewWeaponCross);
      }
      
      private function rollOutHandler(event:MouseEvent) : void
      {
         Mouse.hide();
         addChild(this._viewWeaponCross);
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
      
      private function update(event:TimerEvent) : void
      {
         this._viewWeaponCross.x = mouseX;
         this._viewWeaponCross.y = mouseY;
         this._viewSkinForInstall.x = mouseX;
         this._viewSkinForInstall.y = mouseY;
      }
   }
}

