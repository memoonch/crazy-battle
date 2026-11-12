package ui.views
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.events.Event;
   import game.Game;
   import game.objects.WeaponObject;
   
   public class ViewWeaponCross extends MovieClip
   {
      
      private var _contentWeaponCross:ContentWeaponCross = new ContentWeaponCross();
      
      private var _contentWeaponReload:ContentWeaponReload = new ContentWeaponReload();
      
      private var _game:Game;
      
      private var _spriteBullets:Sprite = new Sprite();
      
      private var _weaponObject:WeaponObject;
      
      public function ViewWeaponCross(game:Game)
      {
         super();
         this._game = game;
         this.init();
      }
      
      private function init() : void
      {
         mouseEnabled = false;
         mouseChildren = false;
         addChild(this._contentWeaponCross);
         this._spriteBullets.x = this._contentWeaponCross.width / 2 + 5;
         this._spriteBullets.y = -20;
         addChild(this._spriteBullets);
         this._contentWeaponReload.x = -this._contentWeaponReload.width / 2;
         this._contentWeaponReload.y = this._contentWeaponCross.height / 2 + 5;
         addChild(this._contentWeaponReload);
         this._game.addEventListener(Game.REFRESH_WEAPON,this.refreshWeaponHandler);
      }
      
      public function addBullet() : void
      {
         var bullet:ContentWeaponBullet = null;
         while(Boolean(this._spriteBullets.numChildren))
         {
            this._spriteBullets.removeChildAt(0);
         }
         for(var i:int = 0; i < this._weaponObject.amountBullets; i++)
         {
            bullet = new ContentWeaponBullet();
            bullet.x = 0;
            bullet.y = i * (bullet.height + 3);
            this._spriteBullets.addChild(bullet);
         }
      }
      
      private function refreshBulletsHandler(event:Event = null) : void
      {
         if(this._weaponObject.state == WeaponObject.READY)
         {
            if(this._weaponObject.amountBullets > 0 && this._weaponObject.amountBullets < this._weaponObject.magazine)
            {
               this.removeBullet();
            }
            else if(this._weaponObject.amountBullets == this._weaponObject.magazine)
            {
               this.reloadEnd();
            }
         }
         else if(this._weaponObject.state == WeaponObject.RELOAD)
         {
            if(this._weaponObject.amountBullets <= 0)
            {
               this.reloadStart();
            }
            else if(this._weaponObject.amountBullets > 0 && this._weaponObject.amountBullets < this._weaponObject.magazine)
            {
               this.addBullet();
            }
         }
      }
      
      private function refreshWeaponHandler(event:Event) : void
      {
         if(Boolean(this._weaponObject))
         {
            this._weaponObject.removeEventListener(WeaponObject.REFRESH_BULLETS,this.refreshBulletsHandler);
         }
         this._weaponObject = this._game.currentWeapon;
         this._weaponObject.addEventListener(WeaponObject.REFRESH_BULLETS,this.refreshBulletsHandler);
         this.reloadEnd();
      }
      
      public function reloadEnd() : void
      {
         var bullet:ContentWeaponBullet = null;
         if(contains(this._contentWeaponReload))
         {
            removeChild(this._contentWeaponReload);
         }
         while(Boolean(this._spriteBullets.numChildren))
         {
            this._spriteBullets.removeChildAt(0);
         }
         for(var i:int = 0; i < this._weaponObject.magazine; i++)
         {
            bullet = new ContentWeaponBullet();
            bullet.x = 0;
            bullet.y = i * (bullet.height + 3);
            this._spriteBullets.addChild(bullet);
         }
      }
      
      public function reloadStart() : void
      {
         while(Boolean(this._spriteBullets.numChildren))
         {
            this._spriteBullets.removeChildAt(0);
         }
         addChild(this._contentWeaponReload);
      }
      
      public function removeBullet() : void
      {
         this._spriteBullets.removeChildAt(0);
      }
   }
}

