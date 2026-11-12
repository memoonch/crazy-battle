package CoinMenu
{
   import flash.display.*;
   import flash.events.MouseEvent;
   import flash.filters.*;
   import flash.geom.*;
   
   public class MenuBase extends MovieClip
   {
      
      protected var _coinMenu:MovieClip;
      
      protected var _object:Object;
      
      protected var _Stage:Stage;
      
      protected var _closingMenu:Boolean;
      
      protected var _nextState:String;
      
      public function MenuBase()
      {
         super();
      }
      
      public function enter() : void
      {
         this.addEventListeners();
         this._coinMenu.x = this._Stage.stageWidth - 180;
         this._coinMenu.y = this._Stage.stageHeight;
         this._closingMenu = false;
         this._object.addChild(this._coinMenu);
      }
      
      public function addEventListeners() : void
      {
      }
      
      public function updateInterface() : void
      {
      }
      
      protected function closeMenu(e:MouseEvent) : void
      {
         this._closingMenu = true;
         this._nextState = CoinCase.NO_DISPLAY;
      }
      
      public function update() : void
      {
         if(!this._closingMenu)
         {
            if(this._coinMenu.y > this._Stage.stageHeight - 262)
            {
               this._coinMenu.y -= 15;
            }
            else
            {
               this._coinMenu.y = this._Stage.stageHeight - 262;
            }
         }
         else if(this._coinMenu.y <= this._Stage.stageHeight)
         {
            this._coinMenu.y += 15;
         }
         else
         {
            this._object.coinMenuState.setState(this._nextState);
         }
         this.updateInterface();
      }
      
      public function exit() : void
      {
         this.removeEventListeners();
         this._object.removeChild(this._coinMenu);
      }
      
      public function removeEventListeners() : void
      {
      }
   }
}

