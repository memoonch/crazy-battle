package game.objects
{
   import flash.display.Sprite;
   import flash.events.Event;
   
   public class BarrageObject extends Sprite
   {
      
      public static const REFRESH_BARRAGE_HEALTH:String = "refreshBarrageHealth";
      
      private var _content:ContentBarrage = new ContentBarrage();
      
      private var _health:int = 800;
      
      private var _healthMax:int = this._health;
      
      public function BarrageObject()
      {
         super();
         this.init();
      }
      
      public function get health() : int
      {
         return this._health;
      }
      
      public function set health(value:int) : void
      {
         this._health = value;
         if(this._health > this._healthMax)
         {
            this._health = this._healthMax;
         }
         else if(this._health < 0)
         {
            this._health = 0;
         }
         dispatchEvent(new Event(BarrageObject.REFRESH_BARRAGE_HEALTH));
      }
      
      public function get healthMax() : int
      {
         return this._healthMax;
      }
      
      private function init() : void
      {
         addChild(this._content);
      }
   }
}

