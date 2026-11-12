package game.objects
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.geom.Point;
   import flash.media.Sound;
   import flash.utils.getDefinitionByName;
   import game.skins.TurretSkin;
   
   public class TurretObject extends Sprite
   {
      
      public static const TURRETOBJECT_REFRESH_HEALTH:String = "turretObjectRefreshHealth";
      
      public static const NAME_CANNON_SMALL:String = "CannonSmall";
      
      public static const NAME_CANNON_NORMAL:String = "CannonNormal";
      
      public static const NAME_CANNON_BIG:String = "CannonBig";
      
      public static const NAME_MAXIM:String = "Maxim";
      
      public static const NAME_MORTAR:String = "Mortar";
      
      public static const DEATH_STATE:String = "deathState";
      
      public static const STAY_STATE:String = "runState";
      
      public static const SHOOT_STATE:String = "shootState";
      
      private var _arrayTarget:Array = [];
      
      private var _container:Sprite;
      
      private var _content:MovieClip;
      
      private var _cost:int;
      
      private var _costSale:int;
      
      private var _counter:int;
      
      private var _currentFrameShoot:String = "shootFull";
      
      private var _currentFrameStay:String = "stay";
      
      private var _damage:int;
      
      private var _health:int;
      
      private var _healthMax:int;
      
      private var _nameTurret:String;
      
      private var _node:Sprite;
      
      private var _radius:int;
      
      private var _range:int;
      
      private var _rate:int;
      
      private var _sound:Sound;
      
      private var _state:String;
      
      public function TurretObject(turretSkin:TurretSkin)
      {
         super();
         this.init(turretSkin);
      }
      
      public function get arrayTarget() : Array
      {
         return this._arrayTarget;
      }
      
      public function set arrayTarget(value:Array) : void
      {
         this._arrayTarget = value;
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
      
      public function get costSale() : int
      {
         return this._costSale;
      }
      
      public function get health() : int
      {
         return this._health;
      }
      
      public function set health(value:int) : void
      {
         var oldValue:int = this._health;
         this._health = value;
         if(this._health > this._healthMax)
         {
            this._health = this._healthMax;
         }
         else if(this._health < 0)
         {
            this._health = 0;
         }
         if(this._health > this._healthMax * 0.8)
         {
            this._currentFrameStay = "full";
            this._currentFrameShoot = "shootFull";
         }
         else if(this._health <= this._healthMax * 0.8 && this._health >= this._healthMax * 0.3)
         {
            this._currentFrameStay = "break";
            this._currentFrameShoot = "shootBr";
         }
         else if(this._health < this._healthMax * 0.3 && this._health > 0)
         {
            this._currentFrameStay = "fire";
            this._currentFrameShoot = "shootFr";
         }
         else if(this._health == 0)
         {
            this.state = TurretObject.DEATH_STATE;
         }
         trace(this._currentFrameShoot,this._currentFrameStay);
         if(oldValue < value)
         {
            this._content.gotoAndStop(this._currentFrameStay);
         }
         dispatchEvent(new Event(TurretObject.TURRETOBJECT_REFRESH_HEALTH));
      }
      
      public function get healthMax() : int
      {
         return this._healthMax;
      }
      
      public function get nameTurret() : String
      {
         return this._nameTurret;
      }
      
      public function get radius() : int
      {
         return this._radius;
      }
      
      public function get range() : int
      {
         return this._range;
      }
      
      public function get state() : String
      {
         return this._state;
      }
      
      public function set state(value:String) : void
      {
         this._state = value;
         if(this._state == TurretObject.STAY_STATE)
         {
            this._content.gotoAndStop(this._currentFrameStay);
         }
         else if(this._state != TurretObject.SHOOT_STATE)
         {
            if(this._state == TurretObject.DEATH_STATE)
            {
               this._content.gotoAndStop("die");
            }
         }
      }
      
      public function get node() : Sprite
      {
         return this._node;
      }
      
      public function set node(value:Sprite) : void
      {
         this._node = value;
      }
      
      private function init(turretSkin:TurretSkin) : void
      {
         var sourceClass:Class = getDefinitionByName(turretSkin.sourceClass) as Class;
         this._content = new sourceClass();
         if(turretSkin.name == TurretObject.NAME_MAXIM)
         {
            this._content.scaleX = this._content.scaleY = 0.6;
         }
         else
         {
            this._content.scaleX = this._content.scaleY = 0.8;
         }
         addChild(this._content);
         this._cost = turretSkin.cost;
         this._costSale = turretSkin.costSale;
         this._damage = turretSkin.damage;
         this._healthMax = turretSkin.health;
         this.health = turretSkin.health;
         this._nameTurret = turretSkin.name;
         this._radius = turretSkin.radius;
         this._range = turretSkin.range;
         this._rate = turretSkin.rate;
         this._sound = turretSkin.sound;
         this._counter = this._rate;
         this.state = TurretObject.STAY_STATE;
      }
      
      public function update() : void
      {
         var i:int = 0;
         var item:EnemyObject = null;
         var bullet:BulletObject = null;
         if(this.state != TurretObject.DEATH_STATE)
         {
            if(Boolean(this._arrayTarget.length))
            {
               ++this._counter;
               if(this._counter > this._rate)
               {
                  this._content.gotoAndStop(this._currentFrameShoot);
                  (this._content.getChildAt(0) as MovieClip).play();
                  if(this._nameTurret == TurretObject.NAME_MAXIM)
                  {
                     for(i = 0; i < this._arrayTarget.length; i++)
                     {
                        item = this._arrayTarget[i];
                        if(item.health > 0)
                        {
                           item.health -= this._damage;
                           this._content.gotoAndStop(this._currentFrameShoot);
                           (this._content.getChildAt(0) as MovieClip).play();
                        }
                        else
                        {
                           item = null;
                           this._arrayTarget[i] = null;
                           this._arrayTarget.splice(this._arrayTarget.indexOf(this._arrayTarget[i]),1);
                           i--;
                        }
                     }
                  }
                  else
                  {
                     bullet = new BulletObject(this._nameTurret,this._damage,this._arrayTarget,this.localToGlobal(new Point(this.x,this.y)).x,this.localToGlobal(new Point(this.x,this.y)).y);
                     this._container.addChild(bullet);
                  }
                  this._counter = 0;
               }
            }
            else if(this._counter < this._rate)
            {
               ++this._counter;
            }
         }
      }
   }
}

