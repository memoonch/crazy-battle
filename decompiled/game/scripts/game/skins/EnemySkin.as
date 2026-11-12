package game.skins
{
   import flash.media.Sound;
   
   public class EnemySkin
   {
      
      private var _cost:int;
      
      private var _damage:int;
      
      private var _distance:int;
      
      private var _health:int;
      
      private var _name:String;
      
      private var _rate:int;
      
      private var _sound:Sound;
      
      private var _sourceClass:String;
      
      private var _speed:int;
      
      public function EnemySkin(xml:XML)
      {
         super();
         this.init(xml);
      }
      
      public function get cost() : int
      {
         return this._cost;
      }
      
      public function get damage() : int
      {
         return this._damage;
      }
      
      public function get distance() : int
      {
         return this._distance;
      }
      
      public function get health() : int
      {
         return this._health;
      }
      
      public function get name() : String
      {
         return this._name;
      }
      
      public function get rate() : int
      {
         return this._rate;
      }
      
      public function get sound() : Sound
      {
         return this._sound;
      }
      
      public function get sourceClass() : String
      {
         return this._sourceClass;
      }
      
      public function get speed() : int
      {
         return this._speed;
      }
      
      private function init(xml:XML) : void
      {
         this._cost = xml.cost;
         this._damage = xml.damage;
         this._distance = xml.distance;
         this._health = xml.health;
         this._name = xml.name;
         this._rate = xml.rate;
         this._sourceClass = xml.sourceClass;
         this._speed = xml.speed;
      }
   }
}

