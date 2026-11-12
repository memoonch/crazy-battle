package ui.screens
{
   import flash.display.MovieClip;
   
   public class ScreenUIGame extends MovieClip
   {
      
      private var _contentScreen:ContentScreenUIGame = new ContentScreenUIGame();
      
      public function ScreenUIGame()
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

