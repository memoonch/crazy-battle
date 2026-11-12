package ui.views
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import game.objects.InfoObject;
   import game.objects.OMPObject;
   import ui.buttons.ButtonOMP;
   
   public class ViewOMP extends Sprite
   {
      
      private var _background:ContentViewOMP = new ContentViewOMP();
      
      private var _infoObject:InfoObject;
      
      public function ViewOMP(infoObject:InfoObject)
      {
         super();
         this._infoObject = infoObject;
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._background);
         this.createButtonOMP();
         this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refresh);
         addEventListener(MouseEvent.CLICK,this.clickHandler);
         this.refresh();
      }
      
      private function clickHandler(event:MouseEvent) : void
      {
         var am:int = 0;
         var btnOMP:ButtonOMP = event.target as ButtonOMP;
         if(btnOMP.state == ButtonOMP.OPEN)
         {
            if(btnOMP.ompSkin.name == OMPObject.NAME_ATOM)
            {
               ++this._infoObject.amountOMPAtom;
            }
            else if(btnOMP.ompSkin.name == OMPObject.NAME_AVIA)
            {
               ++this._infoObject.amountOMPAvia;
            }
            else if(btnOMP.ompSkin.name == OMPObject.NAME_MINE)
            {
               ++this._infoObject.amountOMPMine;
            }
            this._infoObject.amountMoney -= btnOMP.ompSkin.cost;
            am = Math.round(btnOMP.ompSkin.cost);
         }
      }
      
      private function createButtonOMP() : void
      {
         var bOMP:ButtonOMP = null;
         trace("_infoObject.skinsArrayOMP.length = " + this._infoObject.skinsArrayOMP.length);
         for(var i:int = 0; i < this._infoObject.skinsArrayOMP.length; i++)
         {
            bOMP = new ButtonOMP(this._infoObject.skinsArrayOMP[i]);
            bOMP.x = i * 62 + 24;
            bOMP.y = 8;
            addChild(bOMP);
         }
      }
      
      public function refresh(event:Event = null) : void
      {
         var bOMP:ButtonOMP = null;
         for(var i:int = 0; i < numChildren; i++)
         {
            if(getChildAt(i) is ButtonOMP)
            {
               bOMP = ButtonOMP(getChildAt(i));
               if(bOMP.ompSkin.cost > this._infoObject.amountMoney)
               {
                  bOMP.state = ButtonOMP.CLOSED;
               }
               else
               {
                  bOMP.state = ButtonOMP.OPEN;
               }
            }
         }
      }
   }
}

