package game
{
   import flash.display.Sprite;
   
   public class Node extends Sprite
   {
      
      public function Node()
      {
         super();
         this.init();
      }
      
      private function init() : void
      {
         graphics.beginFill(16711680,0.3);
         graphics.drawEllipse(0,0,40,30);
         graphics.endFill();
      }
   }
}

