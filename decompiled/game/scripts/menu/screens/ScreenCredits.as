package menu.screens
{
   import flash.display.MovieClip;
   
   public class ScreenCredits extends MovieClip
   {
      
      private var _content:ContentScreenCredits = new ContentScreenCredits();
      
      public function ScreenCredits()
      {
         super();
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._content);
      }
   }
}

