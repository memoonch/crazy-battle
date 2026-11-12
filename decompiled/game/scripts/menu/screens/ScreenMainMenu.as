package menu.screens
{
   import flash.display.Sprite;
   
   public class ScreenMainMenu extends Sprite
   {
      
      private var _content:ContentScreenMainMenu = new ContentScreenMainMenu();
      
      public function ScreenMainMenu()
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

