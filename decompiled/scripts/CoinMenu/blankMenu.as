package CoinMenu
{
   import flash.display.Stage;
   
   public class blankMenu extends MenuBase
   {
      
      public function blankMenu(object:Object, stage:Stage)
      {
         super();
         _object = object;
         _Stage = stage;
         _coinMenu = new CoinMenu();
      }
      
      override public function update() : void
      {
      }
   }
}

