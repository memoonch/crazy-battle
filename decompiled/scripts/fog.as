package
{
   import Languages.*;
   import flash.display.Loader;
   import flash.display.LoaderInfo;
   import flash.display.MovieClip;
   import flash.display.SimpleButton;
   import flash.display.Sprite;
   import flash.events.ContextMenuEvent;
   import flash.events.Event;
   import flash.events.IOErrorEvent;
   import flash.events.MouseEvent;
   import flash.events.ProgressEvent;
   import flash.external.ExternalInterface;
   import flash.net.LocalConnection;
   import flash.net.SharedObject;
   import flash.net.URLRequest;
   import flash.net.navigateToURL;
   import flash.system.Security;
   import flash.ui.ContextMenu;
   import flash.ui.ContextMenuItem;
   import flash.utils.getDefinitionByName;
   
   public class fog extends MovieClip
   {
      
      private static var countryCode:String = "en";
      
      private static const DEFAULT_APP_KEY:* = "0eb0dee243cc6822c09b317b04a0cd81";
      
      private static const DEFAULT_APP_ID:* = "0000001";
      
      private static const WINDOW_OPEN_FUNCTION:String = "window.open";
      
      private static var _CoinGame:Boolean = false;
      
      private static var versionNumber:String = "3.4.7";
      
      private var preloader:preLoaderVisual = new preLoaderVisual();
      
      private var api:MovieClip;
      
      private var options:Object;
      
      private var GUID:String;
      
      private var clip:*;
      
      private var callback:Function;
      
      private var sitelocked:Boolean = false;
      
      private var CBFunc:Function;
      
      private var preloaderBut:SimpleButton = new ContinueButton();
      
      private var preBG:MovieClip = new MovieClip();
      
      private var connectedToAPI:Boolean = false;
      
      private var appID:String;
      
      private var appKey:String;
      
      private var loadStorage:Boolean = false;
      
      private var contMenu:ContextMenu = new ContextMenu();
      
      private var TrackingInfo:Object;
      
      private var clickableArea:MovieClip;
      
      private var gameName:String = "";
      
      private var storedFrameRate:int = 30;
      
      private var _moreGames:String = "";
      
      private var _homePage:String = "";
      
      private var _freeGamesForYourWebsite:String = "";
      
      private var _trackingInformation:String = "";
      
      private var _moreGamesBanner:String = "";
      
      private var _gameTag:String = "";
      
      private var _browserType:String = "";
      
      private var ml:newMini = this.miniLogo();
      
      internal var forceIncludeClasses:Array = [en,fr,es,el,br,ro,CoinEvent,de];
      
      public var Tags:Class;
      
      public var OLD_COIN_SYSTEM:Boolean = false;
      
      private var _localConnection:LocalConnection;
      
      private var _isPreAS3:Boolean = false;
      
      public var onSite:Boolean = false;
      
      public function fog()
      {
         super();
      }
      
      public static function openWindow(param1:String, param2:String = "_blank", param3:String = "") : void
      {
         ExternalInterface.call(WINDOW_OPEN_FUNCTION,param1,param2,param3);
      }
      
      public static function getCountryCode() : String
      {
         return countryCode;
      }
      
      public function setAppID(param1:String) : *
      {
         this.appID = param1;
         trace("<Local API> App ID changed to " + param1);
      }
      
      public function setAppKey(param1:String) : *
      {
         this.appKey = param1;
         trace("<Local API> App Key changed to " + param1);
      }
      
      public function set setCoinGame(param1:Boolean) : *
      {
         _CoinGame = param1;
      }
      
      public function get getCoinGame() : Boolean
      {
         return _CoinGame;
      }
      
      public function set setPreAS3(param1:Boolean) : *
      {
         this._isPreAS3 = param1;
      }
      
      public function preloaderStart(param1:String, param2:*, param3:Boolean, param4:String = "no-tag-specified", param5:Function = null) : *
      {
         this.Tags = getDefinitionByName("Languages." + "en") as Class;
         Security.allowDomain("*");
         Security.allowDomain("x.fogdev.com");
         Security.allowDomain("*.freeonlinegames.com");
         Security.allowDomain("*.freegamesforyourwebsite.com");
         Security.allowDomain("*.gamesforwebsites.com");
         Security.allowDomain("*.fog.com");
         Security.allowDomain("*.fogcdn.com");
         Security.loadPolicyFile("http://www.fogcdn.com/crossdomain.xml");
         Security.loadPolicyFile("http://x.fogdev.com/crossdomain.xml");
         trace("<Local API>  PreloaderStart called");
         this.GUID = param1;
         this.clip = param2;
         this.CBFunc = param5 as Function;
         this.appID = DEFAULT_APP_ID;
         this.appKey = DEFAULT_APP_KEY;
         this.loadStorage = param3;
         this.TrackingInfo = this.getUrlInfo(this.clip.root.loaderInfo.url);
         this._gameTag = param4;
         trace(CoinEvent);
         this.contMenu.hideBuiltInItems();
         var _loc6_:ContextMenuItem = new ContextMenuItem("FOG API V" + versionNumber);
         var _loc7_:ContextMenuItem = new ContextMenuItem("Play More Games");
         _loc7_.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT,this.gotoMore);
         this.contMenu.customItems.push(_loc6_);
         this.contMenu.customItems.push(_loc7_);
         var _loc8_:ContextMenuItem = new ContextMenuItem("Clear Cloud Storage");
         _loc8_.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT,this.clearStorage);
         this.contMenu.customItems.push(_loc8_);
         this.clip.contextMenu = this.contMenu;
         this.storedFrameRate = this.clip.stage.frameRate;
         trace("<Local API>  Setting stored framerate to " + this.clip.stage.frameRate);
         this.clip.stage.frameRate = 30;
         trace("<Local API>  Setting framerate to 30");
         if(this._isPreAS3 == true)
         {
            this._localConnection = new LocalConnection();
            this._localConnection.client = this;
            this._localConnection.allowDomain("*");
            this._localConnection.connect(this.GUID);
         }
         this.preloader.x = this.clip.stage.stageWidth / 2;
         this.preloader.y = this.clip.stage.stageHeight / 2;
         if(countryCode != "en")
         {
            this.preloader.preLoader.textB.text = "fog.com/" + countryCode;
         }
         else
         {
            this.preloader.preLoader.textB.text = "freeonlinegames.com";
         }
         this.clickableArea = new Blank();
         this.clickableArea.width = this.TrackingInfo.Width;
         this.clickableArea.height = this.TrackingInfo.Height;
         this.clip.stage.addChild(this.preBG);
         this.clip.stage.addChild(this.preloader);
         this.clip.stage.addChild(this.clickableArea);
         this.clickableArea.addEventListener(MouseEvent.CLICK,this.gotoFog);
         this.detectBrowser();
         this.compileTrackingInformation();
         this.clip.stage.addEventListener(Event.RESIZE,this.onStageResize);
         if(this.TrackingInfo.domain != "local")
         {
            this.clip.loaderInfo.addEventListener(Event.COMPLETE,this.loadComplete);
            this.clip.loaderInfo.addEventListener(ProgressEvent.PROGRESS,this.loadProgress);
         }
         else
         {
            trace("<Local API>  Game is local, API functions are unavailable.");
            this.preloader.preLoader.loaderBar.x = 0;
            this.preloader.preLoader.loader_txt.text = "100";
            this.localV();
         }
      }
      
      private function clearStorage(param1:Event) : *
      {
         this.storageClear();
      }
      
      private function openLink(param1:ContextMenuEvent) : void
      {
         this.gotoURL(this._homePage,true);
         trace("<Local API> Opening: " + this._homePage);
      }
      
      private function onStageResize(param1:Event) : void
      {
         this.preloader.x = this.clip.stage.stageWidth / 2;
         this.preloader.y = this.clip.stage.stageHeight / 2;
         this.preloaderBut.x = this.clip.stage.stageWidth / 2 - 82;
         this.preloaderBut.y = this.clip.stage.stageHeight / 2 + 120;
      }
      
      private function loadComplete(param1:Event) : void
      {
         var _loc2_:SitelockWindow = null;
         trace("<Local API> Load Complete Called");
         if(!this.TrackingInfo.onSite)
         {
            this.onSite = false;
         }
         else
         {
            this.onSite = true;
         }
         if(this.sitelocked && this.TrackingInfo.onSite == false)
         {
            trace("<Local API> Game Is not on site, and game is sitelocked");
            _loc2_ = new SitelockWindow();
            _loc2_.x = this.clip.stage.stageWidth / 2;
            _loc2_.y = this.preloader.y + 150;
            this.clip.stage.addChild(_loc2_);
         }
         else
         {
            trace("<Local API> Game Tracking Info:" + this.TrackingInfo.domain);
            this.connectToAPI();
            trace("<Local API> Game is not sitelocked");
            this.preloader.preLoader.loader_txt.text = "100";
         }
         if(this.TrackingInfo.domain != "local")
         {
            this.clip.loaderInfo.removeEventListener(Event.COMPLETE,this.loadComplete);
            this.clip.loaderInfo.removeEventListener(ProgressEvent.PROGRESS,this.loadProgress);
         }
      }
      
      private function compileTrackingInformation() : *
      {
         var _loc1_:String = "";
         if(this.gameName == "")
         {
            _loc1_ = this.GUID;
         }
         else
         {
            _loc1_ = this.gameName + "-" + countryCode;
         }
         this._trackingInformation = "?utm_source=" + this.TrackingInfo.domain + "&utm_medium=api-game&utm_campaign=" + _loc1_;
         this._homePage = "http://www.freeonlinegames.com/" + this._trackingInformation;
         this._freeGamesForYourWebsite = "http://www.freegamesforyourwebsite.com/" + this._trackingInformation;
         this._moreGames = "http://www.freeonlinegames.com/" + countryCode + "/" + "tag/" + this._gameTag + "/" + this._trackingInformation;
         if(countryCode != "en" && countryCode != "none")
         {
            this._homePage = "http://www.fog.com/" + countryCode + "/" + this._trackingInformation;
            this._moreGames = "http://www.fog.com/" + countryCode + "/" + "tag/" + this._gameTag + "/" + this._trackingInformation;
            this._freeGamesForYourWebsite = "http://www.freegamesforyourwebsite.com/" + countryCode + "/" + this._trackingInformation;
         }
         trace("<Local API> Homepage = " + this._homePage);
         trace("<Local API> MoreGames = " + this._moreGames);
         trace("<Local API> FreeGames = " + this._freeGamesForYourWebsite);
         trace("<Local API> Tracking = " + this._trackingInformation);
      }
      
      public function gotoFog(param1:Event = null) : *
      {
         this.gotoURL(this._homePage,true);
         trace("<Local API> Opening" + this._homePage);
      }
      
      public function gotoCoins(param1:Event = null) : *
      {
         if(countryCode != "en")
         {
            this.gotoURL("http://www.freeonlinegames.com/" + countryCode + "/coins");
         }
         else
         {
            this.gotoURL("http://www.freeonlinegames.com/coins/" + this._trackingInformation,true);
         }
      }
      
      public function gotoMore(param1:Event = null) : *
      {
         this.gotoURL(this._moreGames,true);
         trace("<Local API> Opening" + this._moreGames);
      }
      
      public function gotoFreeGames(param1:Event = null) : *
      {
         this.gotoURL(this._freeGamesForYourWebsite,true);
         trace("<Local API> Opening" + this._freeGamesForYourWebsite);
      }
      
      public function gotoURL(param1:String, param2:Boolean = false) : *
      {
         var _loc4_:URLRequest = null;
         var _loc3_:String = "";
         if(param2)
         {
            _loc3_ = param1;
         }
         else
         {
            _loc3_ = param1 + this._trackingInformation;
         }
         if(this._browserType == "Chrome" || this._browserType == "Internet Explorer")
         {
            openWindow(_loc3_);
         }
         else
         {
            _loc4_ = new URLRequest(_loc3_);
            navigateToURL(_loc4_,"_blank");
         }
      }
      
      public function setPreloaderBackground(param1:*) : void
      {
         this.preBG = MovieClip(param1);
      }
      
      public function FrameHandler(param1:Event) : void
      {
         if(this.CBFunc != null)
         {
            this.CBFunc();
            trace("calling function");
         }
         else
         {
            trace("playing");
            play();
         }
         this.clip.stage.removeEventListener(Event.ENTER_FRAME,this.FrameHandler);
      }
      
      public function setGameName(param1:String) : void
      {
         this.gameName = param1;
      }
      
      private function getUrlInfo(param1:String) : Object
      {
         var _loc2_:* = "www";
         if(param1.indexOf("alpha") > 0)
         {
            _loc2_ = "alpha";
         }
         else if(param1.indexOf("beta") > 0)
         {
            _loc2_ = "beta";
         }
         else if(param1.indexOf("master") > 0)
         {
            _loc2_ = "master";
         }
         else if(param1.indexOf("dev") > 0)
         {
            _loc2_ = "dev";
         }
         else if(param1.indexOf("sandbox") > 0)
         {
            _loc2_ = "sandbox";
         }
         param1 = param1.split("http://").join("");
         param1 = param1.split("www.").join("");
         var _loc3_:Array = param1.split("/");
         var _loc4_:* = _loc3_[0];
         if(_loc3_[0].indexOf("freeonlinegames.com") > 0)
         {
            _loc4_ = "freeonlinegames.com";
         }
         else if(_loc3_[0].indexOf("fog.com") > 0)
         {
            _loc4_ = "fog.com";
         }
         else if(_loc3_[0].indexOf("fogdev.com") > 0)
         {
            _loc4_ = "fogdev.com";
         }
         else if(_loc3_[0].indexOf("freegamesforyourwebsite.com") > 0)
         {
            _loc4_ = "freegamesforyourwebsite.com";
         }
         return {
            "domain":_loc4_,
            "server":_loc2_,
            "countryCode":countryCode,
            "onSite":this.onSiteCheck(_loc4_),
            "Width":this.clip.stage.stageWidth,
            "Height":this.clip.stage.stageHeight,
            "Name":this.gameName
         };
      }
      
      private function onSiteCheck(param1:String) : Boolean
      {
         trace("Domain on site check: " + param1);
         return param1.indexOf("freeonlinegames.com") > -1 || param1.indexOf("fog.com") > -1 || param1.indexOf("fogdev.com") > -1 ? true : false;
      }
      
      private function onServerCheck() : String
      {
         var _loc1_:String = null;
         var _loc2_:String = this.clip.root.loaderInfo.url;
         if(_loc2_.indexOf("alpha") != -1)
         {
            _loc1_ = "alpha";
         }
         else if(_loc2_.indexOf("beta") != -1)
         {
            _loc1_ = "beta";
         }
         else if(_loc2_.indexOf("beta") != -1)
         {
            _loc1_ = "www";
         }
         else if(_loc2_.indexOf("beta") != -1)
         {
            _loc1_ = "master";
         }
         else if(_loc2_.indexOf("dev") != -1)
         {
            _loc1_ = "dev";
         }
         else if(_loc2_.indexOf("sandbox") != -1)
         {
            _loc1_ = "sandbox";
         }
         else
         {
            _loc1_ = "";
         }
         trace("<Local API> Loc: " + _loc1_);
         return _loc1_;
      }
      
      public function sitelock() : void
      {
         this.sitelocked = true;
      }
      
      private function loadProgress(param1:ProgressEvent) : void
      {
         var _loc2_:int = 0;
         _loc2_ = int(100 / param1.bytesTotal * param1.bytesLoaded);
         this.preloader.preLoader.loaderBar.x = -200 + _loc2_ * 2;
         this.preloader.preLoader.loader_txt.text = _loc2_;
      }
      
      public function localV() : void
      {
         var _loc1_:SitelockWindow = null;
         if(this.sitelocked && this.TrackingInfo.onSite == false)
         {
            trace("<Local API> Game Is not on site, and game is sitelocked");
            _loc1_ = new SitelockWindow();
            _loc1_.x = this.clip.stage.stageWidth / 2;
            _loc1_.y = this.preloader.y + 150;
            this.clip.stage.addChild(_loc1_);
         }
         else
         {
            this.showButton();
         }
      }
      
      public function connectToAPI() : void
      {
         var ts:Date = new Date();
         var gameParameters:Object = LoaderInfo(this.clip.root.loaderInfo);
         var loader:Loader = new Loader();
         loader.contentLoaderInfo.addEventListener(Event.COMPLETE,this.loadingComplete);
         loader.addEventListener(IOErrorEvent.IO_ERROR,this.ErrorHandler);
         loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR,this.ErrorHandler);
         try
         {
            loader.load(new URLRequest("http://x.fogdev.com/api/libv3-5.swf?t=" + ts.valueOf()));
         }
         catch(e:Error)
         {
            trace("<Local API> " + e);
         }
      }
      
      public function ErrorHandler(param1:IOErrorEvent) : void
      {
         trace("<Local API> API not accessible, loading game...");
         this.connectedToAPI = false;
         this.showButton();
      }
      
      public function loadingComplete(param1:Event) : void
      {
         param1.currentTarget.content != null;
         this.api = MovieClip(param1.target.content);
         this.clip.addChild(this.api);
         this.api.connect(this.GUID,this.clip,this.appID,this.appKey,this.loadStorage,this.TrackingInfo);
         trace("<Local API> Connected to local API!");
         this.connectedToAPI = true;
         this.showButton();
      }
      
      private function onButLoop(param1:Event) : *
      {
         if(this.preloaderBut.alpha < 1)
         {
            this.preloaderBut.alpha += 0.05;
         }
         else
         {
            this.preloaderBut.addEventListener(MouseEvent.CLICK,this.gotoGame);
         }
      }
      
      private function showButton() : void
      {
         this.preloaderBut.x = this.clip.stage.stageWidth / 2 - 82;
         this.preloaderBut.y = this.clip.stage.stageHeight / 2 + 120;
         this.preloaderBut.alpha = 0;
         this.clip.stage.addChild(this.preloaderBut);
         this.preloaderBut.addEventListener(Event.ENTER_FRAME,this.onButLoop);
      }
      
      public function miniLogo() : newMini
      {
         var _loc1_:newMini = new newMini();
         _loc1_.addEventListener(MouseEvent.CLICK,this.miniLogoEvent);
         _loc1_.buttonMode = true;
         return _loc1_;
      }
      
      public function miniLogoEvent(param1:MouseEvent) : *
      {
         this.gotoFog();
      }
      
      private function gotoGame(param1:MouseEvent) : void
      {
         this.clip.stage.frameRate = this.storedFrameRate;
         trace("<Local API> Setting framerate to " + this.clip.stage.frameRate);
         this.preloaderBut.removeEventListener(Event.ENTER_FRAME,this.onButLoop);
         this.clickableArea.removeEventListener(MouseEvent.CLICK,this.gotoFog);
         this.clip.stage.removeChild(this.clickableArea);
         this.clip.stage.removeChild(this.preloaderBut);
         this.clip.stage.removeChild(this.preBG);
         this.clip.stage.removeChild(this.preloader);
         this.clip.stage.addEventListener(Event.ENTER_FRAME,this.FrameHandler);
      }
      
      public function libCall(param1:*) : void
      {
         if(this.connectedToAPI == true)
         {
         }
      }
      
      public function get userLoggedIn() : Boolean
      {
         return this.api.userDataAvailable;
      }
      
      public function get isConnected() : Boolean
      {
         if(this.connectedToAPI)
         {
            if(Boolean(this.api.userDataAvailable))
            {
               return true;
            }
            trace("<Local API> isConnected reports that user not logged in");
            return false;
         }
         trace("<Local API> isConnected reports that is not conncected to API.");
         return false;
      }
      
      public function submitScore(param1:int, param2:Function = null) : *
      {
         if(this.isConnected)
         {
            this.api.submitScore(param1,param2);
         }
         else
         {
            trace("<Local API> Cannot submit score, calling callback");
            if(param2 != null)
            {
               param2();
            }
         }
      }
      
      public function loadUser(param1:Function = null) : *
      {
         if(this.isConnected)
         {
            this.api.loadUser(param1);
         }
         else
         {
            trace("<Local API> Cannot load User, calling callback");
            if(param1 != null)
            {
               param1();
            }
         }
      }
      
      public function giveCoins(param1:int, param2:Function = null) : *
      {
         if(this.isConnected)
         {
            this.api.giveCoins(param1,param2);
         }
         else
         {
            trace("<Local API> Cannot spend Coins, calling callback");
            if(param2 != null)
            {
               param2();
            }
         }
      }
      
      public function useCoins(param1:int, param2:Function = null) : *
      {
         if(this.isConnected)
         {
            this.api.useCoins(param1,param2);
         }
         else
         {
            trace("<Local API> Cannot use Coins, calling callback");
            if(param2 != null)
            {
               param2();
            }
         }
      }
      
      public function sendEvent(param1:int, param2:Function = null) : *
      {
         if(this.isConnected)
         {
            this.api.sendEvent(param1,param2);
         }
         else
         {
            trace("<Local API> Cannot send Event, calling callback");
            if(param2 != null)
            {
               param2();
            }
         }
      }
      
      public function hasStorage() : Boolean
      {
         if(this.isConnected)
         {
            trace("<Local API> hasStorage = true;");
            return this.api.hasStorage();
         }
         trace("<Local API> hasStorage = false;");
         return false;
      }
      
      public function giveXP(param1:int, param2:Function = null) : *
      {
         if(this.isConnected)
         {
            this.api.giveXP(param1,param2);
         }
         else
         {
            trace("<Local API> Cannot give XP, calling callback");
            if(param2 != null)
            {
               param2();
            }
         }
      }
      
      public function loadStorageData(param1:Function = null) : *
      {
         if(this.isConnected)
         {
            this.api.loadStorage(param1);
         }
         else
         {
            trace("<Local API> Cannot load storage, calling callback");
            if(param1 != null)
            {
               param1();
            }
         }
      }
      
      public function serverToSharedObject(param1:SharedObject = null) : *
      {
         if(this.isConnected)
         {
            this.api.serverToSharedObject(param1);
         }
      }
      
      public function sharedObjectToServer(param1:SharedObject = null) : *
      {
         if(this.isConnected)
         {
            this.api.sharedObjectToServer(param1);
         }
      }
      
      public function storageGet(param1:String) : *
      {
         if(this.isConnected)
         {
            this.api.storageGet(param1);
         }
      }
      
      public function storageSet(param1:String, param2:*) : *
      {
         if(this.isConnected)
         {
            this.api.storageSet(param1,param2);
         }
      }
      
      public function saveStorage() : *
      {
         if(this.isConnected)
         {
            this.api.saveStorage();
         }
      }
      
      public function storageClear() : *
      {
         if(this.isConnected)
         {
            this.api.storageClear();
         }
      }
      
      public function getUserObject() : Object
      {
         if(!this.isConnected)
         {
            return null;
         }
         return this.api.user;
      }
      
      public function getCoinAmount() : int
      {
         if(!this.isConnected)
         {
            return 0;
         }
         return this.api.user.coins;
      }
      
      private function detectBrowser() : *
      {
         var userAgent:String = null;
         var browser:String = null;
         try
         {
            userAgent = ExternalInterface.call("window.navigator.userAgent.toString");
            browser = "[Unknown Browser]";
            if(userAgent.indexOf("Safari") != -1)
            {
               browser = "Safari";
            }
            if(userAgent.indexOf("Firefox") != -1)
            {
               browser = "Firefox";
            }
            if(userAgent.indexOf("Chrome") != -1)
            {
               browser = "Chrome";
            }
            if(userAgent.indexOf("MSIE") != -1)
            {
               browser = "Internet Explorer";
            }
            if(userAgent.indexOf("Opera") != -1)
            {
               browser = "Opera";
            }
            this._browserType = browser;
            trace("<Local API> Detected Browser: " + browser);
         }
         catch(e:Error)
         {
            return "[No ExternalInterface]";
         }
      }
      
      public function fogButton(param1:int, param2:int, param3:int, param4:int, param5:Function, param6:uint = 0) : MovieClip
      {
         var _loc7_:Sprite = new Sprite();
         var _loc8_:MovieClip = new MovieClip();
         _loc7_.graphics.beginFill(param6);
         _loc7_.graphics.drawRect(param1,param2,param3,param4);
         _loc8_.buttonMode = true;
         _loc8_.addChild(_loc7_);
         _loc8_.addEventListener(MouseEvent.CLICK,param5);
         return _loc8_;
      }
      
      public function connectedToAS2() : void
      {
         trace("<Local API> API has connected to external AS1/AS2 SWF");
      }
   }
}

