package CoinMenu
{
   import flash.display.Stage;
   import flash.events.Event;
   import flash.events.MouseEvent;
   
   public class convertCoinMenu extends MenuBase
   {
      
      private const CONVERSION_RATE:int;
      
      private const INCREASE:int = MainGame.INCREASE_RATE;
      
      public function convertCoinMenu(object:Object, stage:Stage)
      {
         this.CONVERSION_RATE = MainGame.CONVERSION_RATE;
         super();
         _object = object;
         _Stage = stage;
         _object.FOG.loadUser();
         _coinMenu = new CoinConvertMenu();
         _coinMenu.windowTitle.text = _object.FOG.Tags.FOG2GAME_CURRENCY;
         _coinMenu.description.text = _object.FOG.Tags.ENTER_AMOUNT_COINS;
         _coinMenu.spendHolder.spendBTN.text = _object.FOG.Tags.SPEND_COINS;
         if(_object.FOG.Tags.SPEND_COINS.indexOf("\n") < 0)
         {
            _coinMenu.spendHolder.spendBTN.y += 7;
         }
         _coinMenu.backButton.backTXT.text = _object.FOG.Tags.BACK;
      }
      
      override public function addEventListeners() : void
      {
         _coinMenu.popupPanel.close_btn.addEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.popupPanel.close_btn.buttonMode = true;
         _coinMenu.plus_btn.addEventListener(MouseEvent.CLICK,this.addCoin);
         _coinMenu.minus_btn.addEventListener(MouseEvent.CLICK,this.minusCoin);
         _coinMenu.backButton.addEventListener(MouseEvent.CLICK,this.gotoMainMenu);
         _coinMenu.spendHolder.addEventListener(MouseEvent.CLICK,this.bankCoins);
         _coinMenu.spendHolder.buttonMode = true;
         _coinMenu.spendHolder.useHandCursor = true;
         _coinMenu.spendHolder.mouseChildren = false;
         _coinMenu.minus_btn.buttonMode = true;
         _coinMenu.plus_btn.buttonMode = true;
         _coinMenu.backButton.buttonMode = true;
         _coinMenu.backButton.useHandCursor = true;
         _coinMenu.backButton.mouseChildren = false;
         _coinMenu.coinNum.restrict = "0-9";
      }
      
      private function gotoMainMenu(e:MouseEvent) : void
      {
         _closingMenu = true;
         _nextState = CoinCase.MAIN_MENU;
      }
      
      private function bankCoins(e:MouseEvent) : void
      {
         var convertedAmount:Number = NaN;
         if(CoinHandler.className == null)
         {
            trace("<Wrapper> Coin location not set");
            trace("<Wrapper> David\'s tip of the day: use grabACurrency() to set location");
            return;
         }
         if(Number(_coinMenu.coinNum.text) <= _object.FOG.getCoinAmount())
         {
            _object.FOG.useCoins(Number(_coinMenu.coinNum.text),_object.FOG.loadUser);
            trace("<Wrapper> Spending FOG Coins of: " + _coinMenu.coinNum.text);
            convertedAmount = Number(_coinMenu.coinNum.text) * this.CONVERSION_RATE;
            CoinHandler.className[CoinHandler.variableName] += convertedAmount;
            trace("<Wrapper> Adding Game Currency of: " + convertedAmount);
            _object.dispatchEvent(new CoinEvent(Number(_coinMenu.coinNum.text) * this.CONVERSION_RATE,CoinEvent.FOG2GAME_EVENT));
            _coinMenu.coinNum.text = "0";
         }
      }
      
      private function openConvertCoins(e:Event) : void
      {
         trace("<Wrapper> Opening convert coins menu");
         _closingMenu = true;
         _nextState = CoinCase.FOG2GAME;
      }
      
      private function addCoin(e:Event) : void
      {
         trace("<Wrapper> Increasing coins by: " + this.INCREASE);
         if(Number(_coinMenu.coinNum.text) + this.INCREASE <= _object.FOG.getCoinAmount())
         {
            _coinMenu.coinNum.text = String(Number(_coinMenu.coinNum.text) + this.INCREASE);
         }
      }
      
      private function minusCoin(e:Event) : void
      {
         trace("<Wrapper> Decreasing Coin\'s by: " + this.INCREASE);
         if(Number(_coinMenu.coinNum.text) >= this.INCREASE)
         {
            _coinMenu.coinNum.text = String(Number(_coinMenu.coinNum.text) - this.INCREASE);
         }
      }
      
      override public function updateInterface() : void
      {
         _coinMenu.convText.text = "= " + Number(_coinMenu.coinNum.text) * this.CONVERSION_RATE + _object.FOG.Tags.GAME_COINS;
      }
      
      override public function removeEventListeners() : void
      {
         _coinMenu.popupPanel.close_btn.removeEventListener(MouseEvent.CLICK,closeMenu);
         _coinMenu.plus_btn.removeEventListener(MouseEvent.CLICK,this.addCoin);
         _coinMenu.minus_btn.removeEventListener(MouseEvent.CLICK,this.minusCoin);
         _coinMenu.backButton.removeEventListener(MouseEvent.CLICK,this.gotoMainMenu);
         _coinMenu.spendHolder.removeEventListener(MouseEvent.CLICK,this.bankCoins);
      }
   }
}

