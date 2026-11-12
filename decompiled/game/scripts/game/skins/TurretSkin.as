package game.skins
{
   import flash.media.Sound;
   
   public class TurretSkin
   {
      
      private var _cost:int;
      
      private var _costSale:int;
      
      private var _damage:int;
      
      private var _health:int;
      
      private var _name:String;
      
      private var _radius:int;
      
      private var _range:int;
      
      private var _rate:int;
      
      private var _sound:Sound;
      
      private var _sourceClass:String;
      
      public function TurretSkin(xml:XML)
      {
         super();
         this.init(xml);
      }
      
      public function get cost() : int
      {
         return this._cost;
      }
      
      public function get costSale() : int
      {
         return this._costSale;
      }
      
      public function get damage() : int
      {
         return this._damage;
      }
      
      public function get health() : int
      {
         return this._health;
      }
      
      public function get name() : String
      {
         return this._name;
      }
      
      public function get radius() : int
      {
         return this._radius;
      }
      
      public function get range() : int
      {
         return this._range;
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
      
      private function init(xml:XML) : void
      {
         this._cost = xml.cost;
         this._costSale = xml.costSale;
         this._damage = xml.damage;
         this._health = xml.health;
         this._name = xml.name;
         this._radius = xml.radius;
         this._range = xml.range;
         this._rate = xml.rate;
         this._sourceClass = xml.sourceClass;
      }
   }
}

