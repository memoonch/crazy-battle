package ui.views
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import game.Game;
   import game.objects.InfoObject;
   import ui.buttons.ButtonInventory;
   
   public class ViewInventory extends Sprite
   {
      
      private var _background:ContentViewInventory = new ContentViewInventory();
      
      private var _game:Game;
      
      private var _infoObject:InfoObject;
      
      public function ViewInventory(game:Game, infoObject:InfoObject)
      {
         super();
         this._game = game;
         this._infoObject = infoObject;
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._background);
         this.createButtonInventory();
         this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refresh);
         addEventListener(MouseEvent.CLICK,this.clickHandler);
         this.refresh();
      }
      
      private function clickHandler(event:MouseEvent) : void
      {
         if(event.target is ButtonInventory && event.target.state != ButtonInventory.CLOSED)
         {
            this._game.turretSkinForInstall = event.target.turretSkin;
         }
      }
      
      private function createButtonInventory() : void
      {
         var bI:ButtonInventory = null;
         for(var i:int = 0; i < this._infoObject.skinsArrayTurret.length; i++)
         {
            bI = new ButtonInventory(this._infoObject.skinsArrayTurret[i]);
            bI.x = i * 54 + 12;
            bI.y = 8;
            addChild(bI);
         }
      }
      
      public function refresh(event:Event = null) : void
      {
         var bI:ButtonInventory = null;
         for(var i:int = 0; i < numChildren; i++)
         {
            if(getChildAt(i) is ButtonInventory)
            {
               bI = ButtonInventory(getChildAt(i));
               if(bI.turretSkin.cost > this._infoObject.amountMoney)
               {
                  bI.state = ButtonInventory.CLOSED;
               }
               else
               {
                  bI.state = ButtonInventory.OPEN;
               }
            }
         }
      }
   }
}

