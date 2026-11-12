package game
{
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.events.TimerEvent;
   import flash.geom.Point;
   import flash.media.Sound;
   import flash.utils.Timer;
   import game.objects.BarrageObject;
   import game.objects.BulletObject;
   import game.objects.EnemyObject;
   import game.objects.HumanObject;
   import game.objects.InfoObject;
   import game.objects.OMPObject;
   import game.objects.SFXObject;
   import game.objects.TurretObject;
   import game.objects.WeaponObject;
   import game.skins.EnemySkin;
   import game.skins.OMPSkin;
   import game.skins.TurretSkin;
   import game.skins.WeaponSkin;
   
   public class Game extends Sprite
   {
      
      public static const LEVEL_COMPLETE:String = "levelComplete";
      
      public static const LEVEL_FAILED:String = "levelFailed";
      
      public static const PAUSE:String = "pause";
      
      public static const REFRESH_ARRAY_WEAPON:String = "refreshArrayWeapon";
      
      public static const REFRESH_ENEMYS:String = "refreshEnemys";
      
      public static const REFRESH_SKIN_INSTALL:String = "refreshSkinInstall";
      
      public static const REFRESH_TURRETS:String = "refreshTurrets";
      
      public static const REFRESH_WEAPON:String = "refreshWeapon";
      
      private static const FRAME_RATE:int = 40;
      
      private var _amountEnemys:int;
      
      private var _arrayEnemys:Array = [];
      
      private var _arrayTurrets:Array = [];
      
      private var _arrayWeapons:Array = [];
      
      private var _background:Background = new Background();
      
      private var _barrage:BarrageObject = new BarrageObject();
      
      private var _currentOMP:OMPSkin;
      
      private var _currentWeapon:WeaponObject;
      
      private var _backgroundSprite:Sprite = new Sprite();
      
      private var _foreground:Sprite = new Sprite();
      
      private var _frameCounter:uint;
      
      private var _grid:Sprite;
      
      private var _humanObject:HumanObject;
      
      private var _infoObject:InfoObject;
      
      private var _level:Array;
      
      private var _pauseOn:Boolean = true;
      
      private var _period:int = 25;
      
      private var _spriteForBullets:Sprite = new Sprite();
      
      private var _spriteForOMP:Sprite = new Sprite();
      
      private var _spriteForSFX:Sprite = new Sprite();
      
      private var _timerGame:Timer;
      
      private var _timerUnit:Timer;
      
      private var _turretSelected:TurretObject;
      
      private var _turretSkinForInstall:TurretSkin;
      
      private var _weaponSkinForInstall:WeaponSkin;
      
      public function Game(infoObject:InfoObject)
      {
         super();
         this._infoObject = infoObject;
         this.init();
      }
      
      public function get amountEnemys() : int
      {
         return this._amountEnemys;
      }
      
      public function set amountEnemys(value:int) : void
      {
         this._amountEnemys = value;
         dispatchEvent(new Event(Game.REFRESH_ENEMYS));
      }
      
      public function get arrayEnemys() : Array
      {
         return this._arrayEnemys;
      }
      
      public function get arrayTurrets() : Array
      {
         return this._arrayTurrets;
      }
      
      public function get arrayWeapons() : Array
      {
         return this._arrayWeapons;
      }
      
      public function set arrayWeapons(value:Array) : void
      {
         var item:WeaponObject = null;
         for(var i:int = 0; i < value.length; i++)
         {
            item = value[i];
            item.container = this._spriteForBullets;
         }
         this._arrayWeapons = value;
         this.currentWeapon = this._arrayWeapons[this._arrayWeapons.length - 1];
         dispatchEvent(new Event(Game.REFRESH_ARRAY_WEAPON));
      }
      
      public function get barrage() : BarrageObject
      {
         return this._barrage;
      }
      
      public function get currentOMP() : OMPSkin
      {
         return this._currentOMP;
      }
      
      public function set currentOMP(value:OMPSkin) : void
      {
         this._currentOMP = value;
         dispatchEvent(new Event(Game.REFRESH_SKIN_INSTALL));
      }
      
      public function get currentWeapon() : WeaponObject
      {
         return this._currentWeapon;
      }
      
      public function set currentWeapon(value:WeaponObject) : void
      {
         if(Boolean(this._currentWeapon))
         {
            this._currentWeapon.removeEventListener(WeaponObject.SHOOT,this.shootHandler);
         }
         this._currentWeapon = value;
         this._currentWeapon.container = this._spriteForBullets;
         this._currentWeapon.addEventListener(WeaponObject.SHOOT,this.shootHandler);
         this._humanObject.weapon.gotoAndStop(this._currentWeapon.name);
         dispatchEvent(new Event(Game.REFRESH_WEAPON));
      }
      
      public function get pauseOn() : Boolean
      {
         return this._pauseOn;
      }
      
      public function set pauseOn(value:Boolean) : void
      {
         this._pauseOn = value;
         dispatchEvent(new Event(Game.PAUSE));
      }
      
      public function get timerGame() : Timer
      {
         return this._timerGame;
      }
      
      public function get turretSkinForInstall() : TurretSkin
      {
         return this._turretSkinForInstall;
      }
      
      public function set turretSkinForInstall(value:TurretSkin) : void
      {
         this._turretSkinForInstall = value;
         dispatchEvent(new Event(Game.REFRESH_SKIN_INSTALL));
      }
      
      public function get turretSelected() : TurretObject
      {
         return this._turretSelected;
      }
      
      public function get weaponSkinForInstall() : WeaponSkin
      {
         return this._weaponSkinForInstall;
      }
      
      public function set weaponSkinForInstall(value:WeaponSkin) : void
      {
         this._weaponSkinForInstall = value;
      }
      
      private function init() : void
      {
         var node:Node = null;
         this._timerGame = new Timer(this._period,0);
         this._timerGame.addEventListener(TimerEvent.TIMER,this.render);
         this._timerGame.start();
         this._background.x = 0;
         this._background.y = 0;
         addChild(this._background);
         this._backgroundSprite.x = 0;
         this._backgroundSprite.y = 0;
         addChild(this._backgroundSprite);
         this._foreground.x = 0;
         this._foreground.y = 0;
         this._foreground.graphics.beginFill(16711680,0);
         this._foreground.graphics.drawRect(0,0,640,480);
         this._foreground.graphics.endFill();
         addChild(this._foreground);
         this._foreground.addEventListener(MouseEvent.MOUSE_DOWN,this.mouseDownHandler);
         this._foreground.addEventListener(MouseEvent.MOUSE_UP,this.mouseUpHandler);
         this._grid = new Sprite();
         this._grid.x = 40;
         this._grid.y = 120;
         for(var i:int = 0; i < 5; i++)
         {
            node = new Node();
            node.x = 0;
            node.y = i * 55 + 2;
            this._grid.addChild(node);
         }
         addChild(this._grid);
         this._grid.addEventListener(MouseEvent.CLICK,this.clickHandlerGrid);
         this._barrage.x = 0;
         this._barrage.y = this._barrage.height / 2 + 100;
         addChild(this._barrage);
         this._humanObject = new HumanObject();
         this._humanObject.x = this._humanObject.x = -this._humanObject.width - 50;
         this._humanObject.y = 100;
         addChild(this._humanObject);
         addChild(this._spriteForSFX);
         addChild(this._spriteForBullets);
         addChild(this._spriteForOMP);
         this.arrayWeapons = [new WeaponObject(this._infoObject.skinsArrayWeapon[0])];
      }
      
      public function addWeapon(weaponSkin:WeaponSkin) : void
      {
         var item:WeaponObject = null;
         var weaponObject:WeaponObject = null;
         var inArray:Boolean = false;
         for(var i:int = 0; i < this._arrayWeapons.length; i++)
         {
            item = this._arrayWeapons[i];
            if(weaponSkin.name == item.name)
            {
               inArray = true;
               break;
            }
         }
         if(inArray)
         {
            this.currentWeapon = item;
         }
         else
         {
            weaponObject = new WeaponObject(weaponSkin);
            this._infoObject.amountMoney -= weaponObject.cost;
            this._arrayWeapons.push(weaponObject);
            this.currentWeapon = weaponObject;
         }
      }
      
      public function dispose() : void
      {
         var item:DisplayObject = null;
         this._humanObject.x = -this._humanObject.width - 50;
         if(Boolean(this._humanObject.content.can))
         {
            this._humanObject.content.can.stop();
         }
         this.removeAllEnemy();
         this.removeAllTurret();
         while(Boolean(this._spriteForOMP.numChildren))
         {
            item = this._spriteForOMP.getChildAt(0);
            this._spriteForOMP.removeChild(item);
            item = null;
         }
         while(Boolean(this._spriteForSFX.numChildren))
         {
            item = this._spriteForSFX.getChildAt(0);
            this._spriteForSFX.removeChild(item);
            item = null;
         }
         while(Boolean(this._spriteForBullets.numChildren))
         {
            item = this._spriteForBullets.getChildAt(0);
            BulletObject(item).dispose();
            this._spriteForBullets.removeChild(item);
            item = null;
         }
      }
      
      private function clickHandlerGrid(event:MouseEvent) : void
      {
         var node:Node = null;
         var turret:TurretObject = null;
         if(event.target is Node)
         {
            node = event.target as Node;
            if(Boolean(node.numChildren))
            {
               this._turretSelected = node.getChildAt(0) as TurretObject;
            }
            else if(!node.numChildren && Boolean(this._turretSkinForInstall))
            {
               turret = new TurretObject(this._turretSkinForInstall);
               turret.container = this._spriteForBullets;
               turret.node = node;
               turret.x = node.width / 2;
               turret.y = node.height / 2;
               node.addChild(turret);
               this._arrayTurrets.push(turret);
               this._infoObject.amountMoney -= turret.cost;
               this.turretSkinForInstall = null;
               dispatchEvent(new Event(Game.REFRESH_TURRETS));
            }
         }
      }
      
      private function createUnit(event:TimerEvent) : void
      {
         var str:String = null;
         var skin:EnemySkin = null;
         var i:int = 0;
         var unit:EnemyObject = null;
         var item:EnemySkin = null;
         if(!this.pauseOn)
         {
            if(Boolean(this._level.length))
            {
               str = this._level.shift();
               for(i = 0; i < this._infoObject.enemySkinsArray.length; i++)
               {
                  item = this._infoObject.enemySkinsArray[i];
                  if(item.name == str)
                  {
                     skin = item;
                     break;
                  }
               }
               unit = new EnemyObject(skin);
               unit.container = this._spriteForBullets;
               this._arrayEnemys.push(unit);
               this._foreground.addChild(unit);
               unit.x = 680;
               unit.y = this._grid.y + Math.random() * 253;
            }
            else
            {
               this._timerUnit.stop();
               this._timerUnit.removeEventListener(TimerEvent.TIMER,this.createUnit);
               this._timerUnit = null;
            }
         }
      }
      
      private function mouseDownHandler(event:MouseEvent) : void
      {
         var i:int = 0;
         var item:EnemyObject = null;
         var dx:Number = NaN;
         var dy:Number = NaN;
         var dist:Number = NaN;
         if(!this.pauseOn)
         {
            if(Boolean(this._currentOMP))
            {
               if(this._currentOMP.name == OMPObject.NAME_ATOM)
               {
                  this.setupOMPAtom();
               }
               else if(this._currentOMP.name == OMPObject.NAME_AVIA)
               {
                  this.setupOMPAvia(mouseX,mouseY);
               }
               else if(this._currentOMP.name == OMPObject.NAME_MINE)
               {
                  this.setupOMPMine(mouseX,mouseY);
               }
               this.currentOMP = null;
            }
            else
            {
               if((this.currentWeapon.name == WeaponObject.NAME_BAZOOKA || this.currentWeapon.name == WeaponObject.NAME_ROCKET) && this.currentWeapon.counter > this.currentWeapon.rate)
               {
                  this.currentWeapon.arrayTargets = [];
                  for(i = 0; i < this._arrayEnemys.length; i++)
                  {
                     item = this._arrayEnemys[i];
                     dx = this._foreground.mouseX - item.x;
                     dy = this._foreground.mouseY - item.y;
                     dist = Math.sqrt(dx * dx + dy * dy);
                     if(dist < this.currentWeapon.radius)
                     {
                        this.currentWeapon.arrayTargets.push(item);
                     }
                  }
               }
               else if(this.currentWeapon.name == WeaponObject.NAME_CANNON && this.currentWeapon.counter > this.currentWeapon.rate)
               {
                  if(event.target is EnemyObject && EnemyObject(event.target).health > 0)
                  {
                     this.currentWeapon.arrayTargets.push(event.target);
                  }
               }
               this.currentWeapon.isPressed = true;
               this.currentWeapon.shoot();
            }
         }
      }
      
      private function mouseUpHandler(event:MouseEvent) : void
      {
         this.currentWeapon.isPressed = false;
      }
      
      private function removeAllEnemy() : void
      {
         while(Boolean(this._arrayEnemys.length))
         {
            this._arrayEnemys[0].parent.removeChild(this._arrayEnemys[0]);
            this._arrayEnemys[0].targetArray = [];
            this._arrayEnemys[0] = null;
            this._arrayEnemys.splice(0,1);
         }
         while(Boolean(this._foreground.numChildren))
         {
            this._foreground.removeChildAt(0);
         }
      }
      
      private function removeKilledEnemy() : void
      {
         var enemy:EnemyObject = null;
         var content:MovieClip = null;
         for(var i:int = 0; i < this._backgroundSprite.numChildren; i++)
         {
            enemy = this._backgroundSprite.getChildAt(i) as EnemyObject;
            if(enemy.state == EnemyObject.DEATH_STATE)
            {
               content = enemy.content.getChildAt(0) as MovieClip;
               if(content.currentFrame == content.totalFrames)
               {
                  content.stop();
                  this._backgroundSprite.removeChild(enemy);
                  i--;
               }
            }
         }
      }
      
      private function removeTurret(turret:TurretObject) : void
      {
         turret.parent.removeChild(turret);
         turret.arrayTarget = null;
         this._arrayTurrets.splice(this._arrayTurrets.indexOf(turret),1);
         turret = null;
         dispatchEvent(new Event(Game.REFRESH_TURRETS));
      }
      
      private function removeAllTurret() : void
      {
         var node:Node = null;
         while(Boolean(this._arrayTurrets.length))
         {
            this.removeTurret(this._arrayTurrets[0]);
         }
         for(var i:int = 0; i < this._grid.numChildren; i++)
         {
            node = this._grid.getChildAt(i) as Node;
            if(Boolean(node.numChildren))
            {
               node.removeChildAt(0);
            }
         }
      }
      
      private function removeKilledTurret() : void
      {
         var item:Node = null;
         var to:TurretObject = null;
         var content:MovieClip = null;
         for(var i:int = 0; i < this._grid.numChildren; i++)
         {
            item = this._grid.getChildAt(i) as Node;
            if(Boolean(item.numChildren))
            {
               to = item.getChildAt(0) as TurretObject;
               if(to.state == TurretObject.DEATH_STATE)
               {
                  content = to.getChildAt(0) as MovieClip;
                  if(MovieClip(content.getChildAt(0)).currentFrame == MovieClip(content.getChildAt(0)).totalFrames)
                  {
                     item.removeChild(to);
                  }
               }
            }
         }
      }
      
      private function render(event:TimerEvent) : void
      {
         if(!this.pauseOn)
         {
            this.update();
            this.renderForeground();
         }
      }
      
      private function renderForeground() : void
      {
         this._arrayEnemys.sortOn("y");
         for(var i:int = 0; i < this._arrayEnemys.length; i++)
         {
            this._foreground.setChildIndex(this._arrayEnemys[i],i);
         }
      }
      
      public function saleTurret(turret:TurretObject) : void
      {
         this._infoObject.amountMoney += turret.costSale;
         this.removeTurret(turret);
      }
      
      private function setupOMPAtom() : void
      {
         var item:EnemyObject = null;
         var ompObject:OMPObject = new OMPObject(this.currentOMP);
         ompObject.x = 320;
         ompObject.y = 240;
         this._spriteForOMP.addChild(ompObject);
         for(var i:int = 0; i < this._arrayEnemys.length; i++)
         {
            item = this._arrayEnemys[i];
            item.health -= ompObject.damage;
         }
         --this._infoObject.amountOMPAtom;
      }
      
      private function setupOMPAvia(tx:int, ty:int) : void
      {
         var ompObject:OMPObject = new OMPObject(this.currentOMP);
         var snd:Sound = new sndSvistBomb1();
         snd.play();
         ompObject.x = -200;
         ompObject.y = ty;
         ompObject.targetX = tx;
         ompObject.targetY = ty;
         ompObject.alpha = 0.3;
         this._spriteForOMP.addChild(ompObject);
         --this._infoObject.amountOMPAvia;
      }
      
      private function setupOMPMine(tx:int, ty:int) : void
      {
         var ompObject:OMPObject = new OMPObject(this.currentOMP);
         ompObject.x = tx;
         ompObject.y = ty;
         this._spriteForOMP.addChild(ompObject);
         --this._infoObject.amountOMPMine;
      }
      
      public function startLevel() : void
      {
         this._level = [];
         this._level = this._level.concat(this._infoObject.level);
         this._amountEnemys = this._level.length;
         this._arrayEnemys = [];
         this._humanObject.content.can = this._humanObject.content.snd.play(0,1000000);
         if(Boolean(this._timerUnit))
         {
            this._timerUnit.stop();
            this._timerUnit.removeEventListener(TimerEvent.TIMER,this.createUnit);
            this._timerUnit = null;
         }
         this._timerUnit = new Timer(1500,0);
         this._timerUnit.addEventListener(TimerEvent.TIMER,this.createUnit);
         this._timerUnit.start();
      }
      
      private function shootHandler(event:Event) : void
      {
         var sfx:SFXObject = null;
         if(this.currentWeapon.name == WeaponObject.NAME_CANNON || this.currentWeapon.name == WeaponObject.NAME_MASHINEGUN)
         {
            sfx = new SFXObject(this.currentWeapon.name);
            sfx.x = mouseX;
            sfx.y = mouseY;
            this._spriteForSFX.addChild(sfx);
         }
         var mc:MovieClip = this._humanObject.weapon.getChildAt(0) as MovieClip;
         mc.play();
      }
      
      public function treatBarrage() : void
      {
         if(this._barrage.health < this._barrage.healthMax && this._infoObject.amountMoney > 4)
         {
            this._barrage.health += this._barrage.healthMax / 10;
            this._infoObject.amountMoney -= Math.round(this._barrage.healthMax / 250);
         }
      }
      
      private function spendFogCoins(x:int) : void
      {
         if(Preloader.FogAPI.isConnected)
         {
            Preloader.FogAPI.useCoins(x,Preloader.FogAPI.loadUser as Function);
         }
      }
      
      private function giveFogCoins(x:int) : void
      {
         if(Preloader.FogAPI.isConnected)
         {
            Preloader.FogAPI.giveCoins(x,Preloader.FogAPI.loadUser as Function);
         }
      }
      
      public function treatTurret(turret:TurretObject) : void
      {
         if(turret.health < turret.healthMax && this._infoObject.amountMoney > 5)
         {
            turret.health += turret.healthMax / 3;
            this._infoObject.amountMoney -= Math.round(turret.healthMax / 10);
         }
      }
      
      private function update() : void
      {
         ++this._frameCounter;
         if(!this._amountEnemys && !this._backgroundSprite.numChildren)
         {
            this._humanObject.x = -this._humanObject.width - 50;
            this._humanObject.content.can.stop();
            this._infoObject.currentHealth = this._barrage.health;
            dispatchEvent(new Event(Game.LEVEL_COMPLETE));
            return;
         }
         if(this._barrage.health <= 0)
         {
            this._humanObject.x = -this._humanObject.width - 50;
            this._humanObject.content.can.stop();
            this.dispose();
            dispatchEvent(new Event(Game.LEVEL_FAILED));
            return;
         }
         this.updateBullets();
         this.updateEnemys();
         this.updateHuman();
         this.updateOMP();
         this.updateSFX();
         this.removeKilledEnemy();
         this.removeKilledTurret();
         this.updateTurret();
         this.updateWeapon();
      }
      
      private function updateBullets() : void
      {
         var item:BulletObject = null;
         var sfx:SFXObject = null;
         for(var i:int = 0; i < this._spriteForBullets.numChildren; i++)
         {
            item = this._spriteForBullets.getChildAt(i) as BulletObject;
            if(item.state == BulletObject.STATE_FLY)
            {
               item.update();
               if(Boolean(this._frameCounter % 2))
               {
                  if(item.parentName == WeaponObject.NAME_BAZOOKA || item.parentName == WeaponObject.NAME_ROCKET)
                  {
                     sfx = new SFXObject("Smoke");
                     sfx.x = item.x - item.width;
                     sfx.y = item.y - 5;
                     this._spriteForSFX.addChild(sfx);
                  }
                  else if(item.parentName == TurretObject.NAME_CANNON_BIG)
                  {
                     sfx = new SFXObject("Smoke");
                     sfx.x = item.x - 15;
                     sfx.y = item.y - 5;
                     this._spriteForSFX.addChild(sfx);
                  }
                  else if(item.parentName == TurretObject.NAME_MORTAR)
                  {
                     sfx = new SFXObject("Smoke");
                     sfx.x = item.x - 15;
                     sfx.y = item.y - 5;
                     this._spriteForSFX.addChild(sfx);
                  }
               }
            }
            else if(item.state == BulletObject.STATE_TARGET)
            {
               sfx = new SFXObject(item.parentName);
               sfx.x = item.x;
               sfx.y = item.y;
               this._spriteForSFX.addChild(sfx);
               this._spriteForBullets.removeChild(item);
               item = null;
               i--;
            }
         }
      }
      
      private function updateEnemys() : void
      {
         var enemy:EnemyObject = null;
         var index:int = 0;
         var node:Node = null;
         for(var i:int = 0; i < this._arrayEnemys.length; i++)
         {
            enemy = this._arrayEnemys[i] as EnemyObject;
            if(enemy.health > 0)
            {
               if(enemy.state == EnemyObject.SHOOT_STATE)
               {
                  if(!enemy.targetArray.length)
                  {
                     index = int((enemy.y - this._grid.y) / 53);
                     node = this._grid.getChildAt(index) as Node;
                     if(Boolean(node.numChildren) && (node.getChildAt(0) as TurretObject).state != TurretObject.DEATH_STATE)
                     {
                        enemy.targetArray.push(node.getChildAt(0));
                     }
                     else
                     {
                        enemy.targetArray.push(this._barrage);
                     }
                  }
               }
               enemy.update();
            }
            else
            {
               this._foreground.removeChild(enemy);
               this._backgroundSprite.addChild(enemy);
               this._infoObject.amountMoney += enemy.cost;
               this._infoObject.scores += enemy.healthMax;
               this._arrayEnemys.splice(this._arrayEnemys.indexOf(enemy),1);
               --this.amountEnemys;
               i--;
            }
         }
      }
      
      private function updateHuman() : void
      {
         var newY:int = 0;
         if(this._humanObject.x < 130)
         {
            this._humanObject.x += 7;
         }
         if(this._foreground.mouseY < 350 && this._foreground.mouseY > 100)
         {
            newY = this._foreground.mouseY - 100;
            if(newY > this._humanObject.y)
            {
               this._humanObject.content.heli.rotation += 1;
               if(this._humanObject.content.heli.rotation > 10)
               {
                  this._humanObject.content.heli.rotation = 10;
               }
            }
            else if(newY < this._humanObject.y)
            {
               this._humanObject.content.heli.rotation -= 1;
               if(this._humanObject.content.heli.rotation < -10)
               {
                  this._humanObject.content.heli.rotation = -10;
               }
            }
            this._humanObject.y = newY;
         }
      }
      
      private function updateOMP() : void
      {
         var enemy:EnemyObject = null;
         var sfx:SFXObject = null;
         var item:OMPObject = null;
         var j:int = 0;
         var dx:int = 0;
         var dy:int = 0;
         var dist:int = 0;
         var k:int = 0;
         for(var i:int = 0; i < this._spriteForOMP.numChildren; i++)
         {
            item = this._spriteForOMP.getChildAt(i) as OMPObject;
            if(item.name == OMPObject.NAME_ATOM && item.content.currentFrame == item.content.totalFrames)
            {
               this._spriteForOMP.removeChild(item);
               item.content.stop();
               item = null;
               i--;
            }
            else if(item.name == OMPObject.NAME_AVIA)
            {
               item.x += 20;
               if(item.x > item.targetX && item.x < item.targetX + 150)
               {
                  sfx = new SFXObject(EnemyObject.NAME_ROCKET_BIG);
                  sfx.x = item.x;
                  sfx.y = item.targetY;
                  this._spriteForSFX.addChildAt(sfx,0);
                  for(j = 0; j < this._arrayEnemys.length; j++)
                  {
                     enemy = this._arrayEnemys[j];
                     dx = sfx.x - enemy.x;
                     dy = sfx.y - enemy.y;
                     dist = Math.sqrt(dx * dx + dy * dy);
                     if(dist < 80)
                     {
                        enemy.health -= item.damage;
                     }
                  }
               }
               if(item.x > 640)
               {
                  this._spriteForOMP.removeChild(item);
                  item = null;
                  i--;
               }
            }
            else if(item.name == OMPObject.NAME_MINE)
            {
               for(k = 0; k < this._arrayEnemys.length; k++)
               {
                  enemy = this._arrayEnemys[k];
                  if(item.hitTestObject(enemy))
                  {
                     enemy.health -= item.damage;
                     sfx = new SFXObject(EnemyObject.NAME_ROCKET_BIG);
                     sfx.x = item.x;
                     sfx.y = item.y;
                     this._spriteForSFX.addChildAt(sfx,0);
                     this._spriteForOMP.removeChild(item);
                     item = null;
                     break;
                  }
               }
            }
         }
      }
      
      private function updateSFX() : void
      {
         var sfx:SFXObject = null;
         for(var i:int = 0; i < this._spriteForSFX.numChildren; i++)
         {
            sfx = this._spriteForSFX.getChildAt(i) as SFXObject;
            if(sfx.content.currentFrame == sfx.content.totalFrames)
            {
               this._spriteForSFX.removeChild(sfx);
               sfx.content.stop();
               sfx = null;
               i--;
            }
         }
      }
      
      private function updateTurret() : void
      {
         var enemy:EnemyObject = null;
         var j:int = 0;
         var turret:TurretObject = null;
         var dx:Number = NaN;
         var dy:Number = NaN;
         var dist:Number = NaN;
         var enemy2:EnemyObject = null;
         var globalPoint:Point = null;
         var m:int = 0;
         var l:int = 0;
         var item:EnemyObject = null;
         for(var i:int = 0; i < this._arrayTurrets.length; i++)
         {
            turret = this._arrayTurrets[i] as TurretObject;
            if(turret.health > 0)
            {
               if(turret.arrayTarget.length == 0)
               {
                  globalPoint = turret.localToGlobal(new Point(turret.x,turret.y));
                  if(turret.nameTurret == TurretObject.NAME_CANNON_SMALL || turret.nameTurret == TurretObject.NAME_CANNON_NORMAL)
                  {
                     for(j = 0; j < this._arrayEnemys.length; j++)
                     {
                        enemy = this._arrayEnemys[j] as EnemyObject;
                        if(enemy.y > globalPoint.y - 50 && enemy.y < globalPoint.y + 50)
                        {
                           dx = globalPoint.x - enemy.x;
                           dy = globalPoint.y - enemy.y;
                           dist = Math.sqrt(dx * dx + dy * dy);
                           if(dist < turret.range)
                           {
                              turret.arrayTarget.push(enemy);
                              break;
                           }
                        }
                     }
                  }
                  else if(turret.nameTurret == TurretObject.NAME_MAXIM)
                  {
                     for(j = 0; j < this._arrayEnemys.length; j++)
                     {
                        enemy = this._arrayEnemys[j] as EnemyObject;
                        if(enemy.y > globalPoint.y - 90 && enemy.y < globalPoint.y + 90)
                        {
                           dx = globalPoint.x - enemy.x;
                           dy = globalPoint.y - enemy.y;
                           dist = Math.sqrt(dx * dx + dy * dy);
                           if(dist < turret.range)
                           {
                              turret.arrayTarget.push(enemy);
                              break;
                           }
                        }
                     }
                  }
                  else if(turret.nameTurret == TurretObject.NAME_MORTAR)
                  {
                     for(j = 0; j < this._arrayEnemys.length; j++)
                     {
                        enemy = this._arrayEnemys[j] as EnemyObject;
                        if(enemy.y > globalPoint.y - 50 && enemy.y < globalPoint.y + 50)
                        {
                           dx = globalPoint.x - enemy.x;
                           dy = globalPoint.y - enemy.y;
                           dist = Math.sqrt(dx * dx + dy * dy);
                           if(dist < turret.range)
                           {
                              turret.arrayTarget.push(enemy);
                              for(m = 0; m < this._arrayEnemys.length; m++)
                              {
                                 enemy2 = this._arrayEnemys[m];
                                 dx = enemy.x - enemy2.x;
                                 dy = enemy.y - enemy2.y;
                                 dist = Math.sqrt(dx * dx + dy * dy);
                                 if(dist < turret.radius)
                                 {
                                    turret.arrayTarget.push(enemy2);
                                 }
                              }
                              break;
                           }
                        }
                     }
                  }
                  else if(turret.nameTurret == TurretObject.NAME_CANNON_BIG)
                  {
                     for(j = 0; j < this._arrayEnemys.length; j++)
                     {
                        enemy = this._arrayEnemys[j] as EnemyObject;
                        if(enemy.y > globalPoint.y - 90 && enemy.y < globalPoint.y + 90)
                        {
                           dx = globalPoint.x - enemy.x;
                           dy = globalPoint.y - enemy.y;
                           dist = Math.sqrt(dx * dx + dy * dy);
                           if(dist < turret.range)
                           {
                              turret.arrayTarget.push(enemy);
                              for(l = 0; l < this._arrayEnemys.length; l++)
                              {
                                 enemy2 = this._arrayEnemys[l];
                                 dx = enemy.x - enemy2.x;
                                 dy = enemy.y - enemy2.y;
                                 dist = Math.sqrt(dx * dx + dy * dy);
                                 if(dist < turret.radius)
                                 {
                                    turret.arrayTarget.push(enemy2);
                                 }
                              }
                              break;
                           }
                        }
                     }
                  }
               }
               else
               {
                  for(j = 0; j < turret.arrayTarget.length; j++)
                  {
                     item = turret.arrayTarget[j];
                     if(item.health <= 0)
                     {
                        turret.arrayTarget[j] = null;
                        turret.arrayTarget.splice(turret.arrayTarget.indexOf(turret.arrayTarget[j]),1);
                        j--;
                     }
                  }
               }
               turret.update();
            }
            else
            {
               turret.state = TurretObject.DEATH_STATE;
               turret.arrayTarget = null;
               this._arrayTurrets.splice(this._arrayTurrets.indexOf(turret),1);
               dispatchEvent(new Event(Game.REFRESH_TURRETS));
            }
         }
      }
      
      private function updateWeapon() : void
      {
         var i:int = 0;
         var enemy:EnemyObject = null;
         this.currentWeapon.update();
         if(this.currentWeapon.name == WeaponObject.NAME_MASHINEGUN && this.currentWeapon.isPressed && this.currentWeapon.counter > this.currentWeapon.rate)
         {
            for(i = 0; i < this._arrayEnemys.length; i++)
            {
               enemy = this._arrayEnemys[i];
               if(enemy.hitTestPoint(this._foreground.mouseX,this._foreground.mouseY))
               {
                  this.currentWeapon.arrayTargets.push(enemy);
               }
            }
            this.currentWeapon.shoot();
         }
      }
   }
}

