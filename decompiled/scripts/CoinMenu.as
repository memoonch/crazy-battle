package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol132")]
   public dynamic class CoinMenu extends MovieClip
   {
      
      public var fogToGame:TextField;
      
      public var buyButton:MovieClip;
      
      public var gameToFog:TextField;
      
      public var popupPanel:MovieClip;
      
      public var spendCoinsButton:spendCoinsWindow;
      
      public var windowTitle:TextField;
      
      public var convertCoinsButton:ConvertCoinsButton;
      
      public function CoinMenu()
      {
         super();
      }
   }
}

