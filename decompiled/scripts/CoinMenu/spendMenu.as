package CoinMenu
{
   import flash.display.MovieClip;
   import flash.display.Stage;
   import flash.events.Event;
   import flash.events.MouseEvent;
   
   public class spendMenu extends MenuBase
   {
      
      private const CONVERSION_RATE:int;
      
      private const INCREASE:int = MainGame.INCREASE_RATE;
      
      public function spendMenu(object:Object, stage:Stage)
      {
         this.CONVERSION_RATE = MainGame.CONVERSION_RATE;
         super();
         _object = object;
         _Stage = stage;
         _coinMenu = new spendCoins();
         _object.FOG.loadUser();
         _coinMenu.windowTitle.text = _object.FOG.Tags.GAME2FOG_CURRENCY;
         _coinMenu.description.text = _object.FOG.Tags.ENTER_AMOUNT_CURRENCY;
         _coinMenu.bank_btn.bankTXT.text = _object.FOG.Tags.BANK_COINS;
         _coinMenu.backButton.backTXT.text = _object.FOG.Tags.BACK;
         if(_object.FOG.Tags.BANK_COINS.indexOf("\n") < 0)
         {
            _coinMenu.bank_btn.bankTXT.y += 7;
         }
      }
      
      override public function addEventListeners() : void
      {
         _coinMenu.popupPanel.close_btn.addEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.popupPanel.close_btn.buttonMode = true;
         _coinMenu.plus_btn.addEventListener(MouseEvent.CLICK,this.addCoin);
         _coinMenu.minus_btn.addEventListener(MouseEvent.CLICK,this.minusCoin);
         _coinMenu.backButton.addEventListener(MouseEvent.CLICK,this.gotoMainMenu);
         _coinMenu.bank_btn.addEventListener(MouseEvent.CLICK,this.bankCoins);
         _coinMenu.bank_btn.buttonMode = true;
         _coinMenu.bank_btn.useHandCursor = true;
         _coinMenu.bank_btn.mouseChildren = false;
         _coinMenu.backButton.buttonMode = true;
         _coinMenu.backButton.useHandCursor = true;
         _coinMenu.backButton.mouseChildren = false;
         _coinMenu.minus_btn.buttonMode = true;
         _coinMenu.plus_btn.buttonMode = true;
         _coinMenu.coinNum.restrict = "0-9";
      }
      
      private function gotoMainMenu(e:MouseEvent) : void
      {
         _closingMenu = true;
         _nextState = CoinCase.MAIN_MENU;
      }
      
      private function bankCoins(e:MouseEvent) : void
      {
         if(CoinHandler.className == null)
         {
            trace("<Wrapper> Coin location not set, use grabACurrency() to set location");
            trace("<Wrapper> David\'s tip of the day: use grabACurrency() to set location");
            return;
         }
         var ConvertedCoins:int = Number(_coinMenu.coinNum.text) / this.CONVERSION_RATE / 10;
         if(ConvertedCoins < 1)
         {
            return;
         }
         if(Number(_coinMenu.coinNum.text) <= CoinHandler.className[CoinHandler.variableName])
         {
            CoinHandler.className[CoinHandler.variableName] -= Number(_coinMenu.coinNum.text);
            trace("<Wrapper> Spending Game Currency of: " + _coinMenu.coinNum.text);
            _object.FOG.giveCoins(ConvertedCoins,_object.FOG.loadUser);
            trace("<Wrapper> Adding FOG Coins of: " + ConvertedCoins);
            _coinMenu.coinNum.text = "0";
            _object.dispatchEvent(new CoinEvent(ConvertedCoins,CoinEvent.GAME2FOG_EVENT));
         }
      }
      
      private function openConvertCoins(e:Event) : void
      {
         _closingMenu = true;
         _nextState = CoinCase.FOG2GAME;
      }
      
      private function addCoin(e:Event) : void
      {
         if(Number(_coinMenu.coinNum.text) <= MovieClip(_object.game.root).getCurrency - this.INCREASE)
         {
            _coinMenu.coinNum.text = String(Number(_coinMenu.coinNum.text) + this.INCREASE);
         }
      }
      
      private function minusCoin(e:Event) : void
      {
         if(Number(_coinMenu.coinNum.text) >= 10)
         {
            _coinMenu.coinNum.text = String(Number(_coinMenu.coinNum.text) - this.INCREASE);
         }
      }
      
      override public function updateInterface() : void
      {
         var woo:int = Number(_coinMenu.coinNum.text) / this.CONVERSION_RATE / 10;
         _coinMenu.convText.text = "= " + woo + _object.FOG.Tags.FOG_COINS;
      }
      
      override public function removeEventListeners() : void
      {
         _coinMenu.popupPanel.close_btn.removeEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.plus_btn.removeEventListener(MouseEvent.CLICK,this.addCoin);
         _coinMenu.minus_btn.removeEventListener(MouseEvent.CLICK,this.minusCoin);
         _coinMenu.backButton.removeEventListener(MouseEvent.CLICK,this.gotoMainMenu);
         _coinMenu.bank_btn.removeEventListener(MouseEvent.CLICK,this.bankCoins);
      }
   }
}

