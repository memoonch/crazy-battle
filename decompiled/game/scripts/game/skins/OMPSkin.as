package game.skins
{
   public class OMPSkin
   {
      
      private var _cost:int;
      
      private var _damage:int;
      
      private var _name:String;
      
      private var _sound:*;
      
      public function OMPSkin(xml:XML)
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
      
      public function get name() : String
      {
         return this._name;
      }
      
      public function get sound() : *
      {
         return this._sound;
      }
      
      private function init(xml:XML) : void
      {
         this._cost = xml.cost;
         this._damage = xml.damage;
         this._name = xml.name;
      }
   }
}

