package CoinMenu
{
   import flash.display.Stage;
   import flash.events.MouseEvent;
   
   public class lockedMenu extends MenuBase
   {
      
      public function lockedMenu(object:Object, stage:Stage)
      {
         super();
         _object = object;
         _Stage = stage;
         _coinMenu = new lockedMenuMC();
         _coinMenu.windowTitle.text = _object.FOG.Tags.FOG_COIN_EXCHANGE;
         _coinMenu.description.text = _object.FOG.Tags.CERTAIN_AREAS;
         _coinMenu.buyButton.textHolder.buyFOG.text = _object.FOG.Tags.BUY_COINS;
      }
      
      override public function addEventListeners() : void
      {
         _coinMenu.popupPanel.close_btn.addEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.popupPanel.close_btn.buttonMode = true;
         _coinMenu.buyButton.addEventListener(MouseEvent.CLICK,_object.FOG.gotoCoins);
         _coinMenu.buyButton.buttonMode = true;
         _coinMenu.buyButton.useHandCursor = true;
         _coinMenu.buyButton.mouseChildren = false;
      }
      
      override public function removeEventListeners() : void
      {
         _coinMenu.popupPanel.close_btn.removeEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.buyButton.removeEventListener(MouseEvent.CLICK,_object.FOG.gotoCoins);
      }
   }
}

