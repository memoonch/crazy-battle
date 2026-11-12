package game.objects
{
   import flash.display.Sprite;
   import flash.events.Event;
   import game.skins.WeaponSkin;
   import ui.views.ViewWeaponCross;
   
   public class WeaponObject extends Sprite
   {
      
      public static const REFRESH_BULLETS:String = "refreshBullets";
      
      public static const SHOOT:String = "shoot";
      
      public static const READY:String = "ready";
      
      public static const RELOAD:String = "reload";
      
      public static const NAME_CANNON:String = "Cannon";
      
      public static const NAME_MASHINEGUN:String = "MashineGun";
      
      public static const NAME_BAZOOKA:String = "Bazooka";
      
      public static const NAME_ROCKET:String = "Rocket";
      
      private var _amountBullets:int;
      
      private var _arrayTargets:Array = [];
      
      private var _container:Sprite;
      
      private var _cost:int;
      
      private var _counter:int;
      
      private var _damage:int;
      
      private var _isPressed:Boolean;
      
      private var _magazine:int;
      
      private var _name:String;
      
      private var _radius:int;
      
      private var _rate:int;
      
      private var _sound:*;
      
      private var _state:String;
      
      private var _timeReload:int;
      
      private var _timeAddOneBullet:int;
      
      private var _timeCurrentAddOneBullet:int;
      
      private var _timeCurrentReload:int;
      
      private var _weaponCross:ViewWeaponCross;
      
      public function WeaponObject(weaponSkin:WeaponSkin)
      {
         super();
         this.init(weaponSkin);
      }
      
      public function get amountBullets() : int
      {
         return this._amountBullets;
      }
      
      public function set amountBullets(value:int) : void
      {
         this._amountBullets = value;
         if(this._amountBullets == 0)
         {
            this._state = WeaponObject.RELOAD;
            this._isPressed = false;
         }
         else if(this._amountBullets == this._magazine)
         {
            this._state = WeaponObject.READY;
         }
         dispatchEvent(new Event(WeaponObject.REFRESH_BULLETS));
      }
      
      public function get arrayTargets() : Array
      {
         return this._arrayTargets;
      }
      
      public function set arrayTargets(value:Array) : void
      {
         this._arrayTargets = value;
      }
      
      public function get container() : Sprite
      {
         return this._container;
      }
      
      public function set container(value:Sprite) : void
      {
         this._container = value;
      }
      
      public function get cost() : int
      {
         return this._cost;
      }
      
      public function get counter() : int
      {
         return this._counter;
      }
      
      public function get damage() : int
      {
         return this._damage;
      }
      
      public function get isPressed() : Boolean
      {
         return this._isPressed;
      }
      
      public function set isPressed(value:Boolean) : void
      {
         this._isPressed = value;
      }
      
      public function get magazine() : int
      {
         return this._magazine;
      }
      
      override public function get name() : String
      {
         return this._name;
      }
      
      public function get radius() : int
      {
         return this._radius;
      }
      
      public function get rate() : int
      {
         return this._rate;
      }
      
      public function get sound() : *
      {
         return this._sound;
      }
      
      public function get state() : String
      {
         return this._state;
      }
      
      private function init(weaponSkin:WeaponSkin) : void
      {
         this._cost = weaponSkin.cost;
         this._damage = weaponSkin.damage;
         this._magazine = weaponSkin.magazine;
         this._name = weaponSkin.name;
         this._radius = weaponSkin.radius;
         this._rate = weaponSkin.rate;
         this._timeReload = weaponSkin.timeReload;
         this._amountBullets = this._magazine;
         this._counter = this._rate;
         this._timeAddOneBullet = this._timeReload / this._magazine;
         this._timeCurrentAddOneBullet = this._timeAddOneBullet;
         this._timeCurrentReload = this._timeReload;
         this._state = WeaponObject.READY;
      }
      
      public function shoot() : void
      {
         var i:int = 0;
         var bullet:BulletObject = null;
         if(this._counter > this._rate && this._amountBullets > 0 && this._state == WeaponObject.READY)
         {
            if(this._name == WeaponObject.NAME_BAZOOKA || this._name == WeaponObject.NAME_ROCKET)
            {
               bullet = new BulletObject(this._name,this._damage,this._arrayTargets,135,mouseY - 80);
               this._container.addChild(bullet);
               trace("shooooooooooooooooot");
               this._arrayTargets = [];
            }
            else
            {
               for(i = 0; i < this._arrayTargets.length; i++)
               {
                  if(EnemyObject(this._arrayTargets[i]).health > 0)
                  {
                     EnemyObject(this._arrayTargets[i]).health = EnemyObject(this._arrayTargets[i]).health - this._damage;
                  }
               }
               this._arrayTargets = [];
            }
            --this.amountBullets;
            this._counter = 0;
            dispatchEvent(new Event(WeaponObject.SHOOT));
         }
      }
      
      public function update() : void
      {
         if(this._counter <= this._rate)
         {
            ++this._counter;
         }
         if(this._state == WeaponObject.RELOAD)
         {
            this._timeCurrentAddOneBullet -= 25;
            if(this._timeCurrentAddOneBullet <= 0)
            {
               ++this.amountBullets;
               this._timeCurrentAddOneBullet = this._timeAddOneBullet;
            }
         }
      }
   }
}

