package ui.screens
{
   import flash.display.MovieClip;
   
   public class ScreenPause extends MovieClip
   {
      
      private var _contentScreen:ContentScreenPause = new ContentScreenPause();
      
      public function ScreenPause()
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

