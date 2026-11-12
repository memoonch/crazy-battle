package ui.screens
{
   import flash.display.Sprite;
   
   public class ScreenHelp extends Sprite
   {
      
      private var _contentScreen:ContentScreenHelp = new ContentScreenHelp();
      
      public function ScreenHelp()
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

