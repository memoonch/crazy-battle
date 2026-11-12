package game.objects
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.utils.getDefinitionByName;
   import game.skins.OMPSkin;
   
   public class OMPObject extends Sprite
   {
      
      public static const NAME_ATOM:String = "Atom";
      
      public static const NAME_AVIA:String = "Avia";
      
      public static const NAME_MINE:String = "Mine";
      
      private var _arrayTargets:Array = [];
      
      private var _content:MovieClip;
      
      private var _cost:int;
      
      private var _damage:int;
      
      private var _name:String;
      
      private var _sound:*;
      
      private var _targetX:int;
      
      private var _targetY:int;
      
      public function OMPObject(ompSkin:OMPSkin)
      {
         super();
         this.init(ompSkin);
      }
      
      public function get arrayTargets() : Array
      {
         return this._arrayTargets;
      }
      
      public function get content() : MovieClip
      {
         return this._content;
      }
      
      public function get cost() : int
      {
         return this._cost;
      }
      
      public function get damage() : int
      {
         return this._damage;
      }
      
      override public function get name() : String
      {
         return this._name;
      }
      
      public function get sound() : *
      {
         return this._sound;
      }
      
      public function get targetX() : int
      {
         return this._targetX;
      }
      
      public function set targetX(value:int) : void
      {
         this._targetX = value;
      }
      
      public function get targetY() : int
      {
         return this._targetY;
      }
      
      public function set targetY(value:int) : void
      {
         this._targetY = value;
      }
      
      private function init(ompSkin:OMPSkin) : void
      {
         this._cost = ompSkin.cost;
         this._damage = ompSkin.damage;
         this._name = ompSkin.name;
         var classForContent:Class = getDefinitionByName("UnitOMP" + this._name) as Class;
         this._content = new classForContent();
         addChild(this._content);
      }
   }
}

