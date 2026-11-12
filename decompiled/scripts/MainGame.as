package
{
   import CoinMenu.*;
   import flash.display.*;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.events.TimerEvent;
   import flash.filters.*;
   import flash.geom.*;
   import flash.utils.Timer;
   
   [Frame(factoryClass="Preloader")]
   public class MainGame extends Sprite
   {
      
      private static const GAME:Class = MainGame_GAME;
      
      public static const CONVERSION_RATE:int = 1;
      
      public static const INCREASE_RATE:int = 1;
      
      private var gameHolder:MovieClip = new GAME() as MovieClip;
      
      public var FOG:fog = new fog();
      
      public var game:DisplayObjectContainer;
      
      private var gameMask:MovieClip = new MovieClip();
      
      private var gameContainer:DisplayObject;
      
      private var bottomBanner:backGroundBar = new backGroundBar();
      
      private var playMoreButton:playMore = new playMore();
      
      private var ml:MovieClip;
      
      private var gradiantRectangle:MovieClip;
      
      private var tempLoader:Loader;
      
      private var playMoreOption:String;
      
      private var bannerHolder:MovieClip = new MovieClip();
      
      private var stripedOverlay:stripeOverlay = new stripeOverlay();
      
      private var _gradiantWidth:int = 7388;
      
      private var _coinButton:Coin_Whole2 = new Coin_Whole2();
      
      private var _divider:divider = new divider();
      
      private var _LockCoinMenu:Boolean = true;
      
      public var coinMenuState:menuState = new menuState();
      
      private var _coinCase:String = "0";
      
      public var _callback:Function;
      
      public function MainGame(flog:fog)
      {
         super();
         this.FOG = flog;
         this.ml = this.FOG.miniLogo();
         if(Boolean(stage))
         {
            this.init();
         }
         else
         {
            addEventListener(Event.ADDED_TO_STAGE,this.init);
         }
         this.playMoreOption = this.FOG.Tags.PLAY_MORE + this.FOG.Tags.SPACE_MORE + this.FOG.Tags.SHOOTING_GAMES;
      }
      
      private function onComplete(e:Event) : void
      {
         this.game = MovieClip(this.tempLoader.content) as MovieClip;
         this.gameContainer = this.game;
         stage.addChild(this.gameContainer);
         stage.addEventListener(Event.ADDED,this.updatePosition);
         trace("<Wrapper> Loading complete, starting game");
         MovieClip(this.game.root).loadAPI(this.FOG,this);
         this.addBanner();
      }
      
      public function grabCurrency(className:*, variableName:String) : void
      {
         CoinHandler.className = className;
         CoinHandler.variableName = variableName;
         trace("<Wrapper> Storing Currency object: " + variableName);
      }
      
      public function set LockCoinMenu(lock:Boolean) : void
      {
         if(this.FOG.getCoinGame)
         {
            this._LockCoinMenu = lock;
         }
         else
         {
            this._LockCoinMenu = true;
         }
         trace("<Wrapper> Coin Menu Lock set to: " + this._LockCoinMenu);
      }
      
      private function updatePosition(e:Event) : void
      {
         stage.setChildIndex(this.gameContainer,0);
      }
      
      private function init(e:Event = null) : void
      {
         removeEventListener(Event.ADDED_TO_STAGE,this.init);
         this.tempLoader = this.gameHolder.getChildAt(0) as Loader;
         this.tempLoader.contentLoaderInfo.addEventListener(Event.COMPLETE,this.onComplete);
         stage.addEventListener(Event.RESIZE,this.moveBanner);
         this.coinMenuState.addState(CoinCase.MAIN_MENU,new mainMenu(this,stage));
         this.coinMenuState.addState(CoinCase.LOGGED_OUT,new lockedMenu(this,stage));
         this.coinMenuState.addState(CoinCase.NO_DISPLAY,new blankMenu(this,stage));
         this.coinMenuState.addState(CoinCase.FOG2GAME,new convertCoinMenu(this,stage));
         this.coinMenuState.addState(CoinCase.GAME2FOG,new spendMenu(this,stage));
         this.coinMenuState.addState(CoinCase.LOCKED,new lockedMenu(this,stage));
         this.coinMenuState.setState(CoinCase.NO_DISPLAY);
      }
      
      public function openConvertMenu() : void
      {
         trace("<Wrapper> Opening Coin Exchange Convert Coins Menu");
         if(!this.FOG.getCoinGame)
         {
            return;
         }
         if(this.FOG.isConnected && this.FOG.onSite)
         {
            this.coinMenuState.setState(CoinCase.FOG2GAME);
         }
      }
      
      public function openSellMenu() : void
      {
         trace("<Wrapper> Opening Coin Exchange Convert Currency Menu");
         if(!this.FOG.getCoinGame)
         {
            return;
         }
         if(this.FOG.isConnected && this.FOG.onSite)
         {
            this.coinMenuState.setState(CoinCase.GAME2FOG);
         }
      }
      
      public function closeAllMenus() : void
      {
         trace("<Wrapper> Closing all Menus");
         this.coinMenuState.setState(CoinCase.NO_DISPLAY);
      }
      
      private function moveBanner(e:Event) : void
      {
         this.bottomBanner.height = 46;
         this.bottomBanner.y = stage.stageHeight;
         if(parent.stage.stageWidth > 670)
         {
            this.bottomBanner.width = stage.stageWidth;
            this.stripedOverlay.width = stage.stageWidth;
         }
         this.playMoreButton.x = stage.stageWidth - 100;
         this.playMoreButton.y = stage.stageHeight - 30;
         this.ml.x = 5;
         this.ml.y = this.bottomBanner.y - 46;
         if(this.FOG.getCoinGame)
         {
            this._coinButton.x = stage.stageWidth - 65;
            this._coinButton.y = this.bottomBanner.y - 49;
            this._coinButton.width = 50;
            this._coinButton.height = 48;
            this._divider.x = stage.stageWidth - 75;
            this._divider.y = this.bottomBanner.y - 44;
         }
         else
         {
            this.playMoreButton.x = stage.stageWidth - 5;
            this.playMoreButton.y = stage.stageHeight - 30;
         }
         this.gradiantRectangle.x = 0;
         this.gradiantRectangle.height = 51;
         this.gradiantRectangle.y = stage.stageHeight - 51;
      }
      
      private function addBanner() : void
      {
         trace("<Wrapper> Adding gradient banner");
         this.gradiantRectangle = new MovieClip();
         this.drawGradiantRectangle();
         this.moveBanner(null);
         this.bannerHolder.addChild(this.bottomBanner);
         this.playMoreButton.buttonMode = true;
         this.playMoreButton.playMore_txt.text = this.playMoreOption;
         this.playMoreButton.mouseChildren = false;
         this.playMoreButton.addEventListener(MouseEvent.CLICK,this.FOG.gotoMore);
         this.stripedOverlay.x = 0;
         this.stripedOverlay.y = this.bottomBanner.y;
         this.stripedOverlay.height = 50;
         this.bannerHolder.addChild(this.gradiantRectangle);
         this.bannerHolder.addChild(this.stripedOverlay);
         this.bannerHolder.addChild(this.playMoreButton);
         this.bannerHolder.addChild(this.ml);
         stage.addChild(this.bannerHolder);
         if(this.FOG.getCoinGame)
         {
            this.bannerHolder.addChild(this._coinButton);
            this._coinButton.buttonMode = true;
            this._coinButton.addEventListener(MouseEvent.CLICK,this.openCoinMenu);
            this.bannerHolder.addChild(this._divider);
         }
         this.drawGradiantRectangle();
         var myTimer:Timer = new Timer(7);
         myTimer.addEventListener(TimerEvent.TIMER,this.barLoop);
         myTimer.start();
      }
      
      private function openCoinMenu(e:Event) : void
      {
         if(this.FOG.OLD_COIN_SYSTEM)
         {
            this.FOG.gotoCoins();
            return;
         }
         trace("<Wrapper> Opening Coin Exchange Menu");
         if(this.coinMenuState.current == CoinCase.NO_DISPLAY)
         {
            if(!this.FOG.isConnected)
            {
               this.coinMenuState.setState(CoinCase.LOGGED_OUT);
            }
            else if(this._LockCoinMenu)
            {
               this.coinMenuState.setState(CoinCase.LOCKED);
            }
            else
            {
               this.coinMenuState.setState(CoinCase.MAIN_MENU);
            }
         }
         else
         {
            this.coinMenuState.setState(CoinCase.NO_DISPLAY);
         }
      }
      
      private function barLoop(event:TimerEvent) : void
      {
         if(this.gradiantRectangle.x > 0 - this._gradiantWidth)
         {
            this.gradiantRectangle.x -= 1;
         }
         else
         {
            this.gradiantRectangle.x = stage.stageWidth;
         }
         this.coinMenuState.update();
      }
      
      private function drawGradiantRectangle() : void
      {
         var fillType:String = GradientType.LINEAR;
         var colors:Array = [9961472,16750848,16763904,10079232,39423,204,6684825,9961472];
         var alphas:Array = [1,1,1,1,1,1,1,1];
         var ratios:Array = [18,36,72,108,144,180,216,237];
         var matr:Matrix = new Matrix();
         matr.createGradientBox(256,1);
         var spreadMethod:String = SpreadMethod.PAD;
         var gr:MovieClip = new MovieClip();
         gr.graphics.beginGradientFill(fillType,colors,alphas,ratios,matr,spreadMethod,InterpolationMethod.LINEAR_RGB,0);
         gr.graphics.drawRect(0,0,256,1);
         var bitmap:BitmapData = new BitmapData(gr.width,gr.height);
         bitmap.draw(gr);
         var bm:Bitmap = new Bitmap(bitmap);
         this.gradiantRectangle.addChild(bm);
         bm.width = this._gradiantWidth;
         bm.height = 50;
         bm.smoothing = true;
      }
   }
}

