package ui.views
{
   import flash.display.DisplayObject;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.filters.DropShadowFilter;
   import flash.filters.GlowFilter;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import game.Game;
   import game.objects.InfoObject;
   
   public class ViewProcess extends Sprite
   {
      
      private var _dsFilter:DropShadowFilter = new DropShadowFilter(0,0,0,1,5,5);
      
      private var _glowFilter:GlowFilter = new GlowFilter(16577769,0.5,1,1);
      
      private var _game:Game;
      
      private var _infoObject:InfoObject;
      
      private var _tfMarkerAmountMoney:TextField = new TextField();
      
      private var _tfMarkerCurrentLevel:TextField = new TextField();
      
      private var _tfMarkerHighScores:TextField = new TextField();
      
      private var _tfValueAmountMoney:TextField = new TextField();
      
      private var _tfValueCurrentLevel:TextField = new TextField();
      
      private var _tfValueHighScores:TextField = new TextField();
      
      private var _textFormat:TextFormat = new TextFormat(Main.fontCooper.fontName,18,16577769,null,true,null,null,null,TextFormatAlign.LEFT);
      
      public function ViewProcess(game:Game, infoObject:InfoObject)
      {
         super();
         this._infoObject = infoObject;
         this._game = game;
         this.init();
         Preloader.main.addEventListener(CoinEvent.FOG2GAME_EVENT,this.refreshMoney);
         Preloader.main.addEventListener(CoinEvent.GAME2FOG_EVENT,this.refreshMoney);
      }
      
      private function init() : void
      {
         this._tfValueAmountMoney.selectable = false;
         this._tfValueAmountMoney.defaultTextFormat = this._textFormat;
         this._tfValueAmountMoney.x = 420;
         this._tfValueAmountMoney.y = 7;
         this._tfValueAmountMoney.width = 60;
         this._tfValueAmountMoney.height = 24;
         addChild(this._tfValueAmountMoney);
         this._tfValueCurrentLevel.selectable = false;
         this._tfValueCurrentLevel.defaultTextFormat = this._textFormat;
         this._tfValueCurrentLevel.x = 120;
         this._tfValueCurrentLevel.y = this._tfValueAmountMoney.y;
         this._tfValueCurrentLevel.width = 80;
         this._tfValueCurrentLevel.height = this._tfValueAmountMoney.height;
         addChild(this._tfValueCurrentLevel);
         this._tfValueHighScores.selectable = false;
         this._tfValueHighScores.defaultTextFormat = this._textFormat;
         this._tfValueHighScores.x = 270;
         this._tfValueHighScores.y = this._tfValueAmountMoney.y;
         this._tfValueHighScores.width = 80;
         this._tfValueHighScores.height = this._tfValueAmountMoney.height;
         this._tfValueHighScores.text = "0";
         addChild(this._tfValueHighScores);
         for(var i:int = 0; i < numChildren; i++)
         {
            (getChildAt(i) as DisplayObject).filters = [this._dsFilter,this._glowFilter];
         }
         this._infoObject.addEventListener(InfoObject.REFRESH_LEVEL,this.refreshLevel);
         this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refreshMoney);
         this._infoObject.addEventListener(InfoObject.REFRESH_SCORES,this.refreshScores);
         this.refreshLevel();
         this.refreshMoney();
      }
      
      public function refreshLevel(event:Event = null) : void
      {
         this._tfValueCurrentLevel.text = String(this._infoObject.currentLevel + " / " + this._infoObject.amountLevels);
      }
      
      public function refreshMoney(event:Event = null) : void
      {
         this._infoObject.saveMoney();
         this._tfValueAmountMoney.text = String(this._infoObject.amountMoney);
         trace("refresh money");
      }
      
      public function refreshScores(event:Event = null) : void
      {
         this._tfValueHighScores.text = String(this._infoObject.scores);
      }
   }
}

