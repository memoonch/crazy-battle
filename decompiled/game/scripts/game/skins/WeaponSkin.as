package game.skins
{
   public class WeaponSkin
   {
      
      private var _cost:int;
      
      private var _damage:int;
      
      private var _magazine:int;
      
      private var _name:String;
      
      private var _radius:int;
      
      private var _rate:int;
      
      private var _sound:*;
      
      private var _timeReload:int;
      
      public function WeaponSkin(xml:XML)
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
      
      public function get magazine() : int
      {
         return this._magazine;
      }
      
      public function get name() : String
      {
         return this._name;
      }
      
      public function get radius() : int
      {
         return this._radius;
      }
      
      public function get rate() : int
      {
         return this._rate;
      }
      
      public function get sound() : *
      {
         return this._sound;
      }
      
      public function get timeReload() : int
      {
         return this._timeReload;
      }
      
      private function init(xml:XML) : void
      {
         this._cost = xml.cost;
         this._damage = xml.damage;
         this._magazine = xml.magazine;
         this._name = xml.name;
         this._radius = xml.radius;
         this._rate = xml.rate;
         this._timeReload = xml.timeReload;
      }
   }
}

