package ui
{
   import flash.display.MovieClip;
   
   public class ButtonDefaultMenu extends MovieClip
   {
      
      public function ButtonDefaultMenu()
      {
         super();
         this.init();
      }
      
      private function init() : void
      {
         stop();
         buttonMode = true;
         useHandCursor = true;
      }
   }
}

