package ui.screens
{
   import flash.display.Sprite;
   
   public class ScreenLevelFailed extends Sprite
   {
      
      private var _contentScreen:ContentScreenLevelFailed = new ContentScreenLevelFailed();
      
      public function ScreenLevelFailed()
      {
         super();
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._contentScreen);
      }
   }
}

