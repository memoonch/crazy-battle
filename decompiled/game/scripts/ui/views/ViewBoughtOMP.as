package ui.views
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.filters.DropShadowFilter;
   import flash.filters.GlowFilter;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import game.Game;
   import game.objects.InfoObject;
   
   public class ViewBoughtOMP extends Sprite
   {
      
      private var _btnAtom:ButtonSkinOMPAtom = new ButtonSkinOMPAtom();
      
      private var _btnAvia:ButtonSkinOMPAvia = new ButtonSkinOMPAvia();
      
      private var _btnMine:ButtonSkinOMPMine = new ButtonSkinOMPMine();
      
      private var _dsFilter:DropShadowFilter = new DropShadowFilter(0,0,0,1,5,5);
      
      private var _game:Game;
      
      private var _glowFilter:GlowFilter = new GlowFilter(16577769,0.5,1,1);
      
      private var _infoObject:InfoObject;
      
      private var _textFormat:TextFormat = new TextFormat(Main.fontCooper.fontName,18,16577769,null,true,null,null,null,TextFormatAlign.LEFT);
      
      private var _tfAmountAtom:TextField = new TextField();
      
      private var _tfAmountAvia:TextField = new TextField();
      
      private var _tfAmountMine:TextField = new TextField();
      
      public function ViewBoughtOMP(game:Game, infoObject:InfoObject)
      {
         super();
         this._game = game;
         this._infoObject = infoObject;
         this.init();
      }
      
      private function init() : void
      {
         this._btnMine.x = 0;
         this._btnMine.y = 0;
         this._btnMine.buttonMode = true;
         this._btnMine.useHandCursor = true;
         addChild(this._btnMine);
         this._tfAmountMine.mouseEnabled = false;
         this._tfAmountMine.defaultTextFormat = this._textFormat;
         this._tfAmountMine.x = this._btnMine.x + 5;
         this._tfAmountMine.y = 28;
         this._tfAmountMine.width = 50;
         this._tfAmountMine.height = 50;
         this._tfAmountMine.text = "x 0";
         this._tfAmountMine.filters = [this._dsFilter,this._glowFilter];
         addChild(this._tfAmountMine);
         this._btnAvia.x = 60;
         this._btnAvia.y = 0;
         this._btnAvia.buttonMode = true;
         this._btnAvia.useHandCursor = true;
         addChild(this._btnAvia);
         this._tfAmountAvia.mouseEnabled = false;
         this._tfAmountAvia.defaultTextFormat = this._textFormat;
         this._tfAmountAvia.x = this._btnAvia.x;
         this._tfAmountAvia.y = this._tfAmountMine.y;
         this._tfAmountAvia.width = 50;
         this._tfAmountAvia.height = 50;
         this._tfAmountAvia.text = "x 0";
         this._tfAmountAvia.filters = [this._dsFilter,this._glowFilter];
         addChild(this._tfAmountAvia);
         this._btnAtom.x = 110;
         this._btnAtom.y = 0;
         this._btnAtom.buttonMode = true;
         this._btnAtom.useHandCursor = true;
         addChild(this._btnAtom);
         this._tfAmountAtom.mouseEnabled = false;
         this._tfAmountAtom.defaultTextFormat = this._textFormat;
         this._tfAmountAtom.x = this._btnAtom.x;
         this._tfAmountAtom.y = this._tfAmountMine.y;
         this._tfAmountAtom.width = 50;
         this._tfAmountAtom.height = 50;
         this._tfAmountAtom.text = "x 0";
         this._tfAmountAtom.filters = [this._dsFilter,this._glowFilter];
         addChild(this._tfAmountAtom);
         addEventListener(MouseEvent.CLICK,this.clickHandler);
         this._infoObject.addEventListener(InfoObject.REFRESH_OMP,this.refresh);
      }
      
      private function clickHandler(event:MouseEvent) : void
      {
         if(event.target is ButtonSkinOMPAtom && this._infoObject.amountOMPAtom > 0)
         {
            this._game.currentOMP = this._infoObject.skinsArrayOMP[0];
         }
         else if(event.target is ButtonSkinOMPAvia && this._infoObject.amountOMPAvia > 0)
         {
            this._game.currentOMP = this._infoObject.skinsArrayOMP[1];
         }
         else if(event.target is ButtonSkinOMPMine && this._infoObject.amountOMPMine > 0)
         {
            this._game.currentOMP = this._infoObject.skinsArrayOMP[2];
         }
      }
      
      private function refresh(event:Event) : void
      {
         this._tfAmountAtom.text = String("x " + this._infoObject.amountOMPAtom);
         this._tfAmountAvia.text = String("x " + this._infoObject.amountOMPAvia);
         this._tfAmountMine.text = String("x " + this._infoObject.amountOMPMine);
      }
   }
}

