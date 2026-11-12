package ui.views
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.filters.DropShadowFilter;
   import flash.filters.GlowFilter;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import game.objects.BarrageObject;
   
   public class ViewBarrageHealth extends Sprite
   {
      
      private var _barrage:BarrageObject;
      
      private var _buttonTreat:ButtonTreat = new ButtonTreat();
      
      private var _dsFilter:DropShadowFilter = new DropShadowFilter(0,0,0,1,5,5);
      
      private var _glowFilter:GlowFilter = new GlowFilter(16577769,0.5,1,1);
      
      private var _textField:TextField = new TextField();
      
      private var _textFormat:TextFormat = new TextFormat(Main.fontCooper.fontName,28,16577769,null,true,null,null,null,TextFormatAlign.LEFT);
      
      public function ViewBarrageHealth(barrage:BarrageObject)
      {
         super();
         this._barrage = barrage;
         this.init();
      }
      
      private function init() : void
      {
         this._textField.selectable = false;
         this._textField.defaultTextFormat = this._textFormat;
         this._textField.width = 90;
         this._textField.height = 34;
         this._textField.x = this._textField.width / 2;
         this._textField.y = -2;
         this._textField.filters = [this._dsFilter,this._glowFilter];
         addChild(this._textField);
         this._buttonTreat.x = this._textField.x + 10;
         this._buttonTreat.y = this._textField.y + this._textField.height + 5;
         this._buttonTreat.buttonMode = true;
         this._buttonTreat.useHandCursor = true;
         addChild(this._buttonTreat);
         this.refresh();
      }
      
      public function refresh(event:Event = null) : void
      {
         this._textField.text = String(int(this._barrage.health / this._barrage.healthMax * 100) + "%");
      }
      
      public function dispose() : void
      {
      }
   }
}

