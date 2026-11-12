package game.objects
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.media.Sound;
   import flash.utils.getDefinitionByName;
   import game.skins.EnemySkin;
   
   public class EnemyObject extends Sprite
   {
      
      public static const NAME_BTR:String = "BTR";
      
      public static const NAME_BTR_LITE:String = "BTRLite";
      
      public static const NAME_TANK:String = "Tank";
      
      public static const NAME_TANK_LITE:String = "TankLite";
      
      public static const NAME_ROCKET_BIG:String = "RocketBig";
      
      public static const NAME_ROCKET_LITE:String = "RocketLite";
      
      public static const NAME_SOLDAT_AK:String = "SoldatAK";
      
      public static const NAME_SOLDAT_BAZOOKA:String = "SoldatBazooka";
      
      public static const DEATH_STATE:String = "deathState";
      
      public static const RUN_STATE:String = "runState";
      
      public static const SHOOT_STATE:String = "shootState";
      
      private var _container:Sprite;
      
      private var _content:MovieClip;
      
      private var _cost:int;
      
      private var _counter:int;
      
      private var _currentFrameShoot:String;
      
      private var _currentFrameMove:String;
      
      private var _damage:int;
      
      private var _distance:int;
      
      private var _health:int;
      
      private var _healthMax:int;
      
      private var _isHuman:Boolean;
      
      private var _nameEnemy:String;
      
      private var _rate:int;
      
      private var _sound:Sound;
      
      private var _soundMove:Sound;
      
      private var _state:String;
      
      private var _speed:int;
      
      private var _targetArray:Array = [];
      
      public function EnemyObject(enemySkin:EnemySkin)
      {
         super();
         this.init(enemySkin);
      }
      
      public function get content() : MovieClip
      {
         return this._content;
      }
      
      public function get cost() : int
      {
         return this._cost;
      }
      
      public function get container() : Sprite
      {
         return this._container;
      }
      
      public function set container(value:Sprite) : void
      {
         this._container = value;
      }
      
      public function get health() : int
      {
         return this._health;
      }
      
      public function set health(value:int) : void
      {
         this._health = value;
         if(this._health < 0)
         {
            this._health = 0;
         }
         if(this._isHuman)
         {
            if(this._health == 0)
            {
               this.state = EnemyObject.DEATH_STATE;
            }
         }
         else if(this._health > this._healthMax * 0.8)
         {
            this._currentFrameMove = "move";
            this._currentFrameShoot = "shoot";
         }
         else if(this._health <= this._healthMax * 0.8 && this._health >= this._healthMax * 0.3)
         {
            this._currentFrameMove = "moveBr";
            this._currentFrameShoot = "shootBr";
         }
         else if(this._health < this._healthMax * 0.3 && this._health > 0)
         {
            this._currentFrameMove = "moveFire";
            this._currentFrameShoot = "shootFire";
         }
         else if(this._health == 0)
         {
            this.state = EnemyObject.DEATH_STATE;
         }
      }
      
      public function get healthMax() : int
      {
         return this._healthMax;
      }
      
      public function get nameEnemy() : String
      {
         return this._nameEnemy;
      }
      
      public function get state() : String
      {
         return this._state;
      }
      
      public function set state(value:String) : void
      {
         var ind:int = 0;
         var soundsArray:Array = null;
         var snd:Sound = null;
         this._state = value;
         if(this._state == EnemyObject.SHOOT_STATE)
         {
            if(this._isHuman)
            {
               this._content.gotoAndStop("Shoot");
            }
            else
            {
               this._content.gotoAndStop(this._currentFrameShoot);
            }
         }
         else if(this._state == EnemyObject.DEATH_STATE)
         {
            if(this._isHuman)
            {
               this._content.gotoAndStop("d" + int(Math.random() * 6 + 1));
               ind = Math.floor(Math.random() * 3);
               soundsArray = [new sndVopl1(),new sndVopl2(),new sndVopl3()];
               snd = soundsArray[ind];
               snd.play();
            }
            else
            {
               this._content.gotoAndStop("die");
            }
         }
         else if(this.state == EnemyObject.RUN_STATE)
         {
            if(this._isHuman)
            {
               this._content.gotoAndStop("Run");
            }
            else
            {
               this._content.gotoAndStop(this._currentFrameMove);
            }
         }
      }
      
      public function get targetArray() : Array
      {
         return this._targetArray;
      }
      
      public function set targetArray(value:Array) : void
      {
         this._targetArray = value;
      }
      
      private function init(enemySkin:EnemySkin) : void
      {
         mouseChildren = false;
         var sourceClass:Class = getDefinitionByName(enemySkin.sourceClass) as Class;
         this._content = new sourceClass();
         this._content.x = this._content.width / 2;
         this._content.y = -this._content.height / 2;
         addChild(this._content);
         this._cost = enemySkin.cost;
         this._damage = enemySkin.damage;
         this._distance = enemySkin.distance;
         this._healthMax = enemySkin.health;
         this.health = enemySkin.health;
         this._nameEnemy = enemySkin.name;
         this._rate = enemySkin.rate;
         this._sound = enemySkin.sound;
         this._speed = enemySkin.speed;
         this._counter = this._rate;
         this._isHuman = this.isHuman();
         this.state = EnemyObject.RUN_STATE;
      }
      
      private function isHuman() : Boolean
      {
         var temp:Boolean = false;
         if(this._nameEnemy == EnemyObject.NAME_SOLDAT_AK || this._nameEnemy == EnemyObject.NAME_SOLDAT_BAZOOKA)
         {
            temp = true;
         }
         else if(this._nameEnemy == EnemyObject.NAME_BTR || this._nameEnemy == EnemyObject.NAME_BTR_LITE || this._nameEnemy == EnemyObject.NAME_TANK || this._nameEnemy == EnemyObject.NAME_TANK_LITE || this._nameEnemy == EnemyObject.NAME_ROCKET_BIG || this._nameEnemy == EnemyObject.NAME_ROCKET_LITE)
         {
            temp = false;
         }
         return temp;
      }
      
      public function update() : void
      {
         var i:int = 0;
         var item:Object = null;
         var j:int = 0;
         var bullet:BulletObject = null;
         var item2:Object = null;
         if(this.state == EnemyObject.RUN_STATE)
         {
            if(x > this._distance + Math.random() * 50)
            {
               x -= this._speed;
            }
            else
            {
               this.state = EnemyObject.SHOOT_STATE;
            }
         }
         else if(this.state == EnemyObject.SHOOT_STATE)
         {
            if(Boolean(this._targetArray.length))
            {
               ++this._counter;
               if(this._counter > this._rate)
               {
                  if(this._isHuman)
                  {
                     this._content.gotoAndStop("Shoot");
                     (this._content.getChildAt(0) as MovieClip).play();
                  }
                  else
                  {
                     this._content.gotoAndStop(this._currentFrameShoot);
                     (this._content.getChildAt(0) as MovieClip).dulo.play();
                  }
                  if(this._nameEnemy == EnemyObject.NAME_BTR || this._nameEnemy == EnemyObject.NAME_BTR_LITE || this._nameEnemy == EnemyObject.NAME_SOLDAT_AK)
                  {
                     for(i = 0; i < this._targetArray.length; i++)
                     {
                        item = this._targetArray[i];
                        if(item.health > 0)
                        {
                           item.health -= this._damage;
                        }
                        else
                        {
                           this._targetArray.splice(this._targetArray.indexOf(item),1);
                           item = null;
                           i--;
                        }
                     }
                  }
                  else
                  {
                     for(j = 0; j < this._targetArray.length; j++)
                     {
                        item2 = this._targetArray[j];
                        if(item2.health <= 0)
                        {
                           this._targetArray.splice(this._targetArray.indexOf(item2),1);
                           item2 = null;
                           j--;
                        }
                     }
                     bullet = new BulletObject(this._nameEnemy,this._damage,this._targetArray,this.x,this.y);
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

