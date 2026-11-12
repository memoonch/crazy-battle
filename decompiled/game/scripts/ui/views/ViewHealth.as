package ui.views
{
   import flash.display.GradientType;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.filters.DropShadowFilter;
   import flash.geom.Matrix;
   import flash.geom.Point;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import game.objects.TurretObject;
   
   public class ViewHealth extends Sprite
   {
      
      private var _buttonTreat:ButtonTreat = new ButtonTreat();
      
      private var _buttonSale:ButtonSale = new ButtonSale();
      
      private var _dsFilter:DropShadowFilter = new DropShadowFilter(0,0,0,1,5,5);
      
      private var _maxWidth:int = 50;
      
      private var _maxHeight:int = 10;
      
      private var _object:TurretObject;
      
      private var _textFormat:TextFormat = new TextFormat("Arial",8,16777215,true,null,null,null,null,TextFormatAlign.CENTER);
      
      private var _spriteDown:Sprite = new Sprite();
      
      private var _spriteUp:Sprite = new Sprite();
      
      private var _textField:TextField = new TextField();
      
      public function ViewHealth(object:TurretObject)
      {
         super();
         this._object = object;
         this.init();
      }
      
      public function get object() : TurretObject
      {
         return this._object;
      }
      
      private function init() : void
      {
         this._buttonTreat.buttonMode = true;
         this._buttonTreat.useHandCursor = true;
         addChild(this._buttonTreat);
         this._buttonSale.x = this._buttonTreat.x + this._buttonTreat.width + 2;
         this._buttonSale.buttonMode = true;
         this._buttonSale.useHandCursor = true;
         addChild(this._buttonSale);
         var matrix:Matrix = new Matrix();
         matrix.createGradientBox(this._maxWidth,this._maxHeight * 10,Math.PI * 1.5,0,-(this._maxHeight * 10 - 5));
         this._spriteDown = new Sprite();
         this._spriteDown.mouseEnabled = false;
         this._spriteDown.graphics.beginGradientFill(GradientType.LINEAR,[11018752,16777215],[1,1],[127,255],matrix);
         this._spriteDown.graphics.lineStyle();
         this._spriteDown.graphics.drawRect(0,0,this._maxWidth,this._maxHeight);
         this._spriteDown.filters = [this._dsFilter];
         this._spriteDown.x = this._buttonSale.x + this._buttonSale.width + 3;
         addChild(this._spriteDown);
         this._spriteUp = new Sprite();
         this._spriteUp.mouseEnabled = false;
         this._spriteUp.graphics.beginGradientFill(GradientType.LINEAR,[26112,16777215],[1,1],[127,255],matrix);
         this._spriteUp.graphics.lineStyle();
         this._spriteUp.graphics.drawRect(0,0,this._maxWidth,this._maxHeight);
         this._spriteUp.x = this._buttonSale.x + this._buttonSale.width + 3;
         addChild(this._spriteUp);
         this._textField.mouseEnabled = false;
         this._textField.defaultTextFormat = this._textFormat;
         this._textField.width = 30;
         this._textField.height = 20;
         this._textField.x = this._maxWidth / 2 - this._textField.width / 2 + this._spriteDown.x;
         this._textField.y = -2;
         addChild(this._textField);
         var point:Point = this._object.parent.localToGlobal(new Point(this._object.x,this._object.y));
         this.x = point.x - this.width / 2 - this._buttonTreat.width;
         this.y = point.y + this.height / 2 + 12;
         this._object.addEventListener(TurretObject.TURRETOBJECT_REFRESH_HEALTH,this.refresh);
         this.refresh();
      }
      
      public function refresh(event:Event = null) : void
      {
         this._spriteUp.width = this._object.health * this._maxWidth / this._object.healthMax;
         this._textField.text = String(this._object.health);
         trace("turret viewhealth refresh");
      }
      
      public function dispose() : void
      {
         this._object.removeEventListener(TurretObject.TURRETOBJECT_REFRESH_HEALTH,this.refresh);
         this._object = null;
      }
   }
}

