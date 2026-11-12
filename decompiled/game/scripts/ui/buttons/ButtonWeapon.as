package ui.buttons
{
   import flash.display.Sprite;
   import flash.filters.DropShadowFilter;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import flash.utils.getDefinitionByName;
   import game.skins.WeaponSkin;
   
   public class ButtonWeapon extends Sprite
   {
      
      public static const CLOSED:String = "closed";
      
      public static const OPEN:String = "open";
      
      public static const SOLD:String = "sold";
      
      private var _dsFilter:DropShadowFilter = new DropShadowFilter(0,0,0,1,3,3);
      
      private var _state:String;
      
      private var _spriteCover:Sprite;
      
      private var _spriteSkin:Sprite;
      
      private var _tfCost:TextField = new TextField();
      
      private var _textFormat:TextFormat = new TextFormat(Main.fontCooper.fontName,16,6167057,null,true,null,null,null,TextFormatAlign.LEFT);
      
      private var _weaponSkin:WeaponSkin;
      
      public function ButtonWeapon(weaponSkin:WeaponSkin)
      {
         super();
         this._weaponSkin = weaponSkin;
         this.init();
      }
      
      public function get state() : String
      {
         return this._state;
      }
      
      public function set state(value:String) : void
      {
         this._state = value;
         while(numChildren > 0)
         {
            removeChildAt(0);
         }
         if(this._state == ButtonWeapon.CLOSED)
         {
            buttonMode = false;
            useHandCursor = false;
            addChild(this._spriteSkin);
            addChild(this._tfCost);
            addChild(this._spriteCover);
         }
         else if(this._state == ButtonWeapon.OPEN)
         {
            buttonMode = true;
            useHandCursor = true;
            addChild(this._spriteSkin);
            addChild(this._tfCost);
         }
         else if(this._state == ButtonWeapon.SOLD)
         {
            buttonMode = true;
            useHandCursor = true;
            addChild(this._spriteSkin);
         }
      }
      
      public function get weaponSkin() : WeaponSkin
      {
         return this._weaponSkin;
      }
      
      private function init() : void
      {
         mouseChildren = false;
         this._spriteCover = new Sprite();
         this._spriteCover.graphics.beginFill(7960953,0.5);
         this._spriteCover.graphics.drawRect(0,0,48,48);
         var classForSkin:Class = getDefinitionByName("ButtonSkinWeapon" + this._weaponSkin.name) as Class;
         this._spriteSkin = new classForSkin();
         addChild(this._spriteSkin);
         this._tfCost.selectable = false;
         this._tfCost.defaultTextFormat = this._textFormat;
         this._tfCost.text = String(this._weaponSkin.cost);
         this._tfCost.width = 40;
         this._tfCost.height = 22;
         this._tfCost.x = (48 - this._tfCost.width) / 2;
         this._tfCost.y = 48 - this._tfCost.height - 4;
         this._tfCost.filters = [this._dsFilter];
         addChild(this._tfCost);
         this.state = ButtonWeapon.CLOSED;
      }
   }
}

