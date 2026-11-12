package
{
   import flash.events.Event;
   
   public class CoinEvent extends Event
   {
      
      public static const FOG2GAME_EVENT:String = "FOG2GAME";
      
      public static const GAME2FOG_EVENT:String = "GAME2FOG";
      
      public var arg:*;
      
      public var Coins:Number;
      
      public function CoinEvent(param1:Number, param2:String, param3:Boolean = false, param4:Boolean = false)
      {
         super(param2,param3,param4);
         this.Coins = param1;
      }
      
      override public function clone() : Event
      {
         return new CoinEvent(this.Coins,type,bubbles,cancelable);
      }
   }
}

