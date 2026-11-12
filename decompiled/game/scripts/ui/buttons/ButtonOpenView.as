package ui.buttons
{
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import ui.views.ViewInventory;
   import ui.views.ViewOMP;
   import ui.views.ViewWeapons;
   
   public class ButtonOpenView extends MovieClip
   {
      
      private var _btnSkin:DisplayObject;
      
      private var _view:DisplayObject;
      
      public function ButtonOpenView(view:DisplayObject)
      {
         super();
         this._view = view;
         if(view is ViewInventory)
         {
            this._btnSkin = new ButtonOpenViewInventory();
         }
         else if(view is ViewOMP)
         {
            this._btnSkin = new ButtonOpenViewOMP();
         }
         else if(view is ViewWeapons)
         {
            this._btnSkin = new ButtonOpenViewWeapon();
         }
         this.init();
      }
      
      public function get view() : DisplayObject
      {
         return this._view;
      }
      
      private function init() : void
      {
         addChild(this._btnSkin);
         buttonMode = true;
         useHandCursor = true;
      }
   }
}

