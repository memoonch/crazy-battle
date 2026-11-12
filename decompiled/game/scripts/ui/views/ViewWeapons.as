package ui.views
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import game.Game;
   import game.objects.InfoObject;
   import game.objects.WeaponObject;
   import ui.buttons.ButtonInventory;
   import ui.buttons.ButtonWeapon;
   
   public class ViewWeapons extends Sprite
   {
      
      private var _background:ContentViewWeapon = new ContentViewWeapon();
      
      private var _game:Game;
      
      private var _infoObject:InfoObject;
      
      public function ViewWeapons(game:Game, infoObject:InfoObject)
      {
         super();
         this._game = game;
         this._infoObject = infoObject;
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._background);
         this.createButtonWeapons();
         this._game.addEventListener(Game.REFRESH_ARRAY_WEAPON,this.activate);
         this._infoObject.addEventListener(InfoObject.REFRESH_MONEY,this.refresh);
         addEventListener(MouseEvent.CLICK,this.clickHandler);
         this.refresh();
      }
      
      private function activate(event:Event) : void
      {
         var btn:ButtonWeapon = null;
         var j:int = 0;
         var item:WeaponObject = null;
         for(var i:int = 0; i < numChildren; i++)
         {
            if(getChildAt(i) is ButtonWeapon)
            {
               btn = getChildAt(i) as ButtonWeapon;
               for(j = 0; j < this._game.arrayWeapons.length; j++)
               {
                  item = this._game.arrayWeapons[j];
                  if(btn.weaponSkin.name == item.name)
                  {
                     btn.state = ButtonWeapon.SOLD;
                  }
                  else if(btn.weaponSkin.cost < this._infoObject.amountMoney)
                  {
                     btn.state = ButtonWeapon.OPEN;
                  }
                  else if(btn.weaponSkin.cost > this._infoObject.amountMoney)
                  {
                     btn.state = ButtonWeapon.CLOSED;
                  }
               }
            }
         }
      }
      
      private function clickHandler(event:MouseEvent) : void
      {
         if(event.target.state == ButtonWeapon.OPEN)
         {
            this._game.addWeapon(event.target.weaponSkin);
            event.target.state = ButtonWeapon.SOLD;
         }
         else if(event.target.state == ButtonWeapon.SOLD)
         {
            this._game.addWeapon(event.target.weaponSkin);
         }
      }
      
      private function createButtonWeapons() : void
      {
         var bW:ButtonWeapon = null;
         for(var i:int = 0; i < this._infoObject.skinsArrayWeapon.length; i++)
         {
            bW = new ButtonWeapon(this._infoObject.skinsArrayWeapon[i]);
            bW.x = i * 54 + 16;
            bW.y = 10;
            addChild(bW);
            if(i == 0)
            {
               bW.state = ButtonWeapon.SOLD;
            }
         }
      }
      
      public function refresh(event:Event = null) : void
      {
         var bW:ButtonWeapon = null;
         for(var i:int = 0; i < numChildren; i++)
         {
            if(getChildAt(i) is ButtonWeapon)
            {
               bW = ButtonWeapon(getChildAt(i));
               if(bW.state != ButtonWeapon.SOLD)
               {
                  if(bW.weaponSkin.cost > this._infoObject.amountMoney)
                  {
                     bW.state = ButtonInventory.CLOSED;
                  }
                  else
                  {
                     bW.state = ButtonInventory.OPEN;
                  }
               }
            }
         }
      }
   }
}

