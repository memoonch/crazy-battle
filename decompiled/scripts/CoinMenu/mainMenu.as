package CoinMenu
{
   import flash.display.Stage;
   import flash.events.Event;
   import flash.events.MouseEvent;
   
   public class mainMenu extends MenuBase
   {
      
      public function mainMenu(object:Object, stage:Stage)
      {
         super();
         _object = object;
         _Stage = stage;
         _coinMenu = new CoinMenu();
         _coinMenu.windowTitle.text = _object.FOG.Tags.FOG_COIN_EXCHANGE;
         _coinMenu.fogToGame.text = _object.FOG.Tags.FOG2GAME_CURRENCY;
         _coinMenu.gameToFog.text = _object.FOG.Tags.GAME2FOG_CURRENCY;
         _coinMenu.buyButton.textHolder.buyFOG.text = _object.FOG.Tags.BUY_COINS;
      }
      
      override public function addEventListeners() : void
      {
         _coinMenu.buyButton.addEventListener(MouseEvent.CLICK,_object.FOG.gotoCoins);
         _coinMenu.buyButton.buttonMode = true;
         _coinMenu.buyButton.useHandCursor = true;
         _coinMenu.buyButton.mouseChildren = false;
         _coinMenu.popupPanel.close_btn.addEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.popupPanel.close_btn.buttonMode = true;
         _coinMenu.convertCoinsButton.addEventListener(MouseEvent.CLICK,this.openConvertCoins);
         _coinMenu.spendCoinsButton.addEventListener(MouseEvent.CLICK,this.openSpendMenu);
      }
      
      private function openConvertCoins(e:Event) : void
      {
         _closingMenu = true;
         _nextState = CoinCase.FOG2GAME;
      }
      
      private function openSpendMenu(e:Event) : void
      {
         _closingMenu = true;
         _nextState = CoinCase.GAME2FOG;
      }
      
      override public function removeEventListeners() : void
      {
         _coinMenu.buyButton.removeEventListener(MouseEvent.CLICK,_object.FOG.gotoCoins);
         _coinMenu.popupPanel.close_btn.removeEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.convertCoinsButton.removeEventListener(MouseEvent.CLICK,this.openConvertCoins);
         _coinMenu.spendCoinsButton.removeEventListener(MouseEvent.CLICK,this.openSpendMenu);
      }
   }
}

