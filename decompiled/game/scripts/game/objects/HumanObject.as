package game.objects
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   
   public class HumanObject extends Sprite
   {
      
      private var _content:UnitHeli;
      
      private var _weapon:MovieClip;
      
      public function HumanObject()
      {
         super();
         this.init();
      }
      
      public function get weapon() : MovieClip
      {
         return this._weapon;
      }
      
      public function get content() : UnitHeli
      {
         return this._content;
      }
      
      private function init() : void
      {
         this._content = new UnitHeli();
         addChild(this._content);
         this._weapon = this._content.heli.weapon;
      }
   }
}

