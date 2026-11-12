package game.objects
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   
   public class BulletObject extends Sprite
   {
      
      public static const STATE_FLY:String = "stateFly";
      
      public static const STATE_TARGET:String = "stateTarget";
      
      private var _a:Number;
      
      private var _b:Number;
      
      private var _c:Number;
      
      private var _content:MovieClip;
      
      private var _radius:int;
      
      private var _parentDamage:int;
      
      private var _parentName:String;
      
      private var _parentX:Number;
      
      private var _parentY:Number;
      
      private var _state:String;
      
      private var _targetArray:Array;
      
      private var _targetX:Number;
      
      private var _targetY:Number;
      
      private var _velocity:Number;
      
      private var medX:Number;
      
      private var medY:Number;
      
      public function BulletObject(parentName:String, parentDamage:int, targetArray:Array, parentX:int, parentY:int)
      {
         super();
         this._parentDamage = parentDamage;
         this._parentName = parentName;
         this._parentX = parentX;
         this._parentY = parentY;
         this._targetArray = targetArray;
         this.init();
      }
      
      public function get state() : String
      {
         return this._state;
      }
      
      public function get parentName() : String
      {
         return this._parentName;
      }
      
      private function init() : void
      {
         var dx:Number = NaN;
         var dy:Number = NaN;
         var begX:Number = NaN;
         var begY:Number = NaN;
         var endX:Number = NaN;
         var endY:Number = NaN;
         var h:Number = NaN;
         var angleRad:Number = NaN;
         this._state = BulletObject.STATE_FLY;
         var angleGrad:int = 0;
         if(this._parentName == EnemyObject.NAME_ROCKET_BIG || this._parentName == EnemyObject.NAME_ROCKET_LITE)
         {
            this.x = this._parentX - 6;
            this.y = this._parentY - 54;
            this._targetX = 50;
            this._targetY = this.y;
            this._content = new ContentLargeBullet();
         }
         else if(this._parentName == EnemyObject.NAME_SOLDAT_BAZOOKA)
         {
            this.x = this._parentX - 10;
            this.y = this._parentY - 25;
            this._targetX = 50;
            this._targetY = this.y;
            this._content = new ContentMediumBullet();
            this._content.scaleX = this._content.scaleY = 0.5;
         }
         else if(this._parentName == EnemyObject.NAME_TANK || this._parentName == EnemyObject.NAME_TANK_LITE)
         {
            this.x = this._parentX - 14;
            this.y = this._parentY - 45;
            this._targetX = 50;
            this._targetY = this.y;
            this._content = new ContentSmallBullet();
         }
         else if(this._parentName == TurretObject.NAME_CANNON_BIG)
         {
            this.x = this._parentX + 48;
            this.y = this._parentY - 36;
            if(Boolean(this._targetArray[0]))
            {
               this._targetX = this._targetArray[0].x;
               this._targetY = this._targetArray[0].y;
            }
            angleGrad = 180;
            this._content = new ContentSmallBullet();
            h = 50;
         }
         else if(this._parentName == TurretObject.NAME_CANNON_NORMAL)
         {
            this.x = this._parentX + 65;
            this.y = this._parentY - 30;
            if(Boolean(this._targetArray[0]))
            {
               this._targetX = this._targetArray[0].x;
               this._targetY = this._targetArray[0].y;
            }
            angleGrad = 180;
            h = 10;
            this._content = new ContentSmallBullet();
         }
         else if(this._parentName == TurretObject.NAME_CANNON_SMALL)
         {
            this.x = this._parentX + 52;
            this.y = this._parentY - 30;
            if(Boolean(this._targetArray[0]))
            {
               this._targetX = this._targetArray[0].x;
               this._targetY = this._targetArray[0].y;
            }
            angleGrad = 180;
            h = 10;
            this._content = new ContentSmallBullet();
         }
         else if(this._parentName == TurretObject.NAME_MORTAR)
         {
            this.x = this._parentX + 21;
            this.y = this._parentY - 32;
            if(Boolean(this._targetArray[0]))
            {
               this._targetX = this._targetArray[0].x;
               this._targetY = this._targetArray[0].y;
            }
            this._content = new ContentMediumBullet();
            this._content.scaleX = this._content.scaleY = 0.5;
            h = 100;
         }
         else if(Boolean(WeaponObject.NAME_BAZOOKA) || Boolean(WeaponObject.NAME_ROCKET))
         {
            if(Boolean(this._targetArray[0]))
            {
               this._targetX = this._targetArray[0].x;
               this._targetY = this._targetArray[0].y;
            }
            else
            {
               this._targetX = mouseX;
               this._targetY = mouseY;
            }
            this.x = this._parentX;
            this.y = this._parentY;
            angleGrad = 195;
            h = 10;
            this._content = new ContentMediumBullet();
            this._content.scaleX = this._content.scaleY = 0.5;
         }
         begX = this.x;
         begY = this.y;
         endX = this._targetX;
         endY = this._targetY;
         angleRad = Math.atan((endY - begY) / (endX - begX));
         this.medX = (begX + endX) / 2 + h * Math.sin(angleRad);
         this.medY = (endY + begY) / 2 - h * Math.cos(angleRad);
         this._a = (endY - (endX * (this.medY - begY) + this.medX * begY - begX * this.medY) / (this.medX - begX)) / (endX * (endX - begX - this.medX) + begX * this.medX);
         this._b = (this.medY - begY) / (this.medX - begX) - this._a * (begX + this.medX);
         this._c = (this.medX * begY - begX * this.medY) / (this.medX - begX) + this._a * begX * this.medX;
         addChild(this._content);
         this.rotation = angleGrad;
      }
      
      public function dispose() : void
      {
         this._targetArray = [];
      }
      
      public function update() : void
      {
         var i:int = 0;
         var item:Object = null;
         var angleRad2:Number = NaN;
         var angleGrad2:Number = NaN;
         var dx:Number = this._targetX - this.x;
         var dy:Number = this._targetY - this.y;
         var dist:Number = Math.sqrt(dx * dx + dy * dy);
         if(dist < 24)
         {
            this._state = BulletObject.STATE_TARGET;
            for(i = 0; i < this._targetArray.length; i++)
            {
               item = this._targetArray[i];
               item.health -= this._parentDamage;
               trace("item.health  = " + item.health);
            }
            this._targetArray = null;
         }
         else if(this._parentName == TurretObject.NAME_CANNON_BIG || this._parentName == TurretObject.NAME_MORTAR)
         {
            if(this._parentName == TurretObject.NAME_CANNON_BIG)
            {
               this.x += 16;
            }
            else if(this._parentName == TurretObject.NAME_MORTAR)
            {
               this.x += 10;
            }
            this.y = this._a * this.x * this.x + this._b * this.x + this._c;
            dx = this.medX - this.x;
            dy = this.y - this.medY;
            angleRad2 = Math.atan(dy / dx);
            angleGrad2 = 180 - angleRad2 * 180 / Math.PI;
            this.rotation = angleGrad2;
         }
         else if(this._parentName == TurretObject.NAME_CANNON_NORMAL || this._parentName == TurretObject.NAME_CANNON_SMALL || this._parentName == WeaponObject.NAME_BAZOOKA || this._parentName == WeaponObject.NAME_ROCKET)
         {
            this.x += 16;
            this.y = this._a * this.x * this.x + this._b * this.x + this._c;
         }
         else
         {
            if(dx < 0)
            {
               this.x -= 16;
            }
            else
            {
               this.x += 16;
            }
            this.y += dy * 0.05;
         }
      }
   }
}

