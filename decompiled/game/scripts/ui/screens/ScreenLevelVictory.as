package ui.screens
{
   import flash.display.Sprite;
   import flash.events.Event;
   import game.objects.InfoObject;
   
   public class ScreenLevelVictory extends Sprite
   {
      
      private var _infoObject:InfoObject;
      
      private var _contentScreen:ContentScreenLevelVictory = new ContentScreenLevelVictory();
      
      private var _scores:int;
      
      public function ScreenLevelVictory()
      {
         super();
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._contentScreen);
      }
      
      public function refreshScores(event:Event = null) : void
      {
      }
   }
}

