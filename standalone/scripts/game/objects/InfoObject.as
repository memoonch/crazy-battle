package game.objects
{
   import assets.EmbedResourse;
   import flash.events.Event;
   import flash.events.EventDispatcher;
   import flash.net.SharedObject;
   import game.skins.EnemySkin;
   import game.skins.OMPSkin;
   import game.skins.TurretSkin;
   import game.skins.WeaponSkin;
   import utils.Utils;
   
   public class InfoObject extends EventDispatcher
   {
      
      public static var _amountMoney:int;
      
      public static const GAME_COMPLETE:String = "gameComplete";
      
      public static const REFRESH_LEVEL:String = "refreshLevel";
      
      public static const REFRESH_MONEY:String = "refreshMoney";
      
      public static const REFRESH_OMP:String = "refreshOmp";
      
      public static const REFRESH_SCORES:String = "refreshScores";
      
      private static const BEG_AMOUNT_MONEY:int = 0;
      
      private var _amountLevels:int;
      
      private var _amountOMPAtom:int;
      
      private var _amountOMPAvia:int;
      
      private var _amountOMPMine:int;
      
      private var _arrayCurrentWeapons:Array;
      
      private var _currentHealth:int;
      
      private var _currentLevel:int = 1;
      
      private var _embedResourse:EmbedResourse = new EmbedResourse();
      
      private var _enemySkinsArray:Array;
      
      private var _scores:int;
      
      private var _skinsArrayOMP:Array;
      
      private var _skinsArrayTurret:Array;
      
      private var _skinsArrayWeapon:Array;
      
      private var _levelsArray:Array;
      
      private var _lso:SharedObject = SharedObject.getLocal("crazy-battle-standalone-v1");
      
      public function InfoObject()
      {
         super();
         this.init();
      }
      
      public function get amountMoney() : int
      {
         return _amountMoney;
      }
      
      public function set amountMoney(value:int) : void
      {
         _amountMoney = value;
         if(_amountMoney < 0)
         {
            _amountMoney = 0;
         }
         dispatchEvent(new Event(InfoObject.REFRESH_MONEY));
      }
      
      public function get amountLevels() : int
      {
         return this._amountLevels;
      }
      
      public function get amountOMPAtom() : int
      {
         return this._amountOMPAtom;
      }
      
      public function set amountOMPAtom(value:int) : void
      {
         this._amountOMPAtom = value;
         dispatchEvent(new Event(InfoObject.REFRESH_OMP));
      }
      
      public function get amountOMPAvia() : int
      {
         return this._amountOMPAvia;
      }
      
      public function set amountOMPAvia(value:int) : void
      {
         this._amountOMPAvia = value;
         dispatchEvent(new Event(InfoObject.REFRESH_OMP));
      }
      
      public function get amountOMPMine() : int
      {
         return this._amountOMPMine;
      }
      
      public function set amountOMPMine(value:int) : void
      {
         this._amountOMPMine = value;
         dispatchEvent(new Event(InfoObject.REFRESH_OMP));
      }
      
      public function get arrayCurrentWeapons() : Array
      {
         return this._arrayCurrentWeapons;
      }
      
      public function get currentHealth() : int
      {
         return this._currentHealth;
      }
      
      public function set currentHealth(value:int) : void
      {
         this._currentHealth = value;
      }
      
      public function get currentLevel() : int
      {
         return this._currentLevel;
      }
      
      public function set currentLevel(value:int) : void
      {
         if(this._currentLevel != value)
         {
            this._currentLevel = value;
            dispatchEvent(new Event(InfoObject.REFRESH_LEVEL));
         }
         if(this._currentLevel == this._levelsArray.length + 1)
         {
            dispatchEvent(new Event(InfoObject.GAME_COMPLETE));
         }
      }
      
      public function get enemySkinsArray() : Array
      {
         return this._enemySkinsArray;
      }
      
      public function get level() : Array
      {
         trace("_currentLevel = " + this._currentLevel);
         return this._levelsArray[this._currentLevel - 1];
      }
      
      public function get lso() : SharedObject
      {
         return this._lso;
      }
      
      public function get scores() : int
      {
         return this._scores;
      }
      
      public function set scores(value:int) : void
      {
         this._scores = value;
         dispatchEvent(new Event(InfoObject.REFRESH_SCORES));
      }
      
      public function get skinsArrayOMP() : Array
      {
         return this._skinsArrayOMP;
      }
      
      public function get skinsArrayTurret() : Array
      {
         return this._skinsArrayTurret;
      }
      
      public function get skinsArrayWeapon() : Array
      {
         return this._skinsArrayWeapon;
      }
      
      private function init() : void
      {
         this.parseEmbedResourse();
         _amountMoney = this._lso.data.write ? int(this._lso.data.currentMoney) : 0;
         this._amountLevels = this._levelsArray.length;
      }
      
      private function createEnemySkins() : void
      {
         var skin:EnemySkin = null;
         this._enemySkinsArray = [];
         var xmlList:XMLList = this._embedResourse.enemys.children();
         for(var i:int = 0; i < xmlList.length(); i++)
         {
            skin = new EnemySkin(xmlList[i]);
            this._enemySkinsArray.push(skin);
         }
      }
      
      private function createSkinsArrayOMP() : void
      {
         var skin:OMPSkin = null;
         this._skinsArrayOMP = [];
         var xmlList:XMLList = this._embedResourse.omps.children();
         for(var i:int = 0; i < xmlList.length(); i++)
         {
            skin = new OMPSkin(xmlList[i]);
            this._skinsArrayOMP.push(skin);
         }
      }
      
      private function createSkinsArrayTurret() : void
      {
         var skin:TurretSkin = null;
         this._skinsArrayTurret = [];
         var xmlList:XMLList = this._embedResourse.inventory.children();
         for(var i:int = 0; i < xmlList.length(); i++)
         {
            skin = new TurretSkin(xmlList[i]);
            this._skinsArrayTurret.push(skin);
         }
      }
      
      private function createSkinsArrayWeapon() : void
      {
         var skin:WeaponSkin = null;
         this._skinsArrayWeapon = [];
         var xmlList:XMLList = this._embedResourse.weapons.children();
         for(var i:int = 0; i < xmlList.length(); i++)
         {
            skin = new WeaponSkin(xmlList[i]);
            this._skinsArrayWeapon.push(skin);
         }
      }
      
      private function createLevels() : void
      {
         var i:int = 0;
         var j:int = 0;
         var level:Array = null;
         var unit:EnemyObject = null;
         this._levelsArray = [];
         var xmlList:XMLList = this._embedResourse.levels.children();
         for(i = 0; i < xmlList.length(); i++)
         {
            level = [];
            for(j = 0; j < xmlList[i].BTR; j++)
            {
               level.push("BTR");
            }
            for(j = 0; j < xmlList[i].BTRLite; j++)
            {
               level.push("BTRLite");
            }
            for(j = 0; j < xmlList[i].Tank; j++)
            {
               level.push("Tank");
            }
            for(j = 0; j < xmlList[i].TankLite; j++)
            {
               level.push("TankLite");
            }
            for(j = 0; j < xmlList[i].Rocket; j++)
            {
               level.push("RocketBig");
            }
            for(j = 0; j < xmlList[i].RocketLite; j++)
            {
               level.push("RocketLite");
            }
            for(j = 0; j < xmlList[i].SoldatAK; j++)
            {
               level.push("SoldatAK");
            }
            for(j = 0; j < xmlList[i].SoldatBazooka; j++)
            {
               level.push("SoldatBazooka");
            }
            level = Utils.shuffle(level);
            this._levelsArray.push(level);
         }
      }
      
      public function loadGame() : Array
      {
         var arrayAchivements:Array = null;
         var array:Array = null;
         var i:int = 0;
         var nameSkin:String = null;
         var j:int = 0;
         var skin:WeaponSkin = null;
         var weapon:WeaponObject = null;
         if(Boolean(this._lso.data.write))
         {
            trace("_lso.data.write");
            trace(this._lso.data.currentMoney,this._lso.data.currentScores,this._lso.data.currentLevel);
            this.amountMoney = this._lso.data.currentMoney;
            this.amountOMPAtom = this._lso.data.amountOMPAtom;
            this.amountOMPAvia = this._lso.data.amountOMPAvia;
            this.amountOMPMine = this._lso.data.amountOMPMine;
            arrayAchivements = this._lso.data.arrayAchivements;
            this.scores = this._lso.data.currentScores;
            this.currentHealth = this._lso.data.currentHealth;
            this.currentLevel = this._lso.data.currentLevel;
            this._arrayCurrentWeapons = [];
            array = this._lso.data.arrayWeapons;
            for(i = 0; i < array.length; i++)
            {
               nameSkin = array[i];
               for(j = 0; j < this._skinsArrayWeapon.length; j++)
               {
                  skin = this._skinsArrayWeapon[j];
                  if(skin.name == nameSkin)
                  {
                     weapon = new WeaponObject(skin);
                     this.arrayCurrentWeapons.push(weapon);
                  }
               }
            }
         }
         else
         {
            this.newGame();
            arrayAchivements = [];
         }

         return arrayAchivements;
      }
      
      private function syncUI() : void
      {
      }
      
      public function newGame() : void
      {
         this.amountMoney = InfoObject.BEG_AMOUNT_MONEY;
         this.amountOMPAtom = 0;
         this.amountOMPAvia = 0;
         this.amountOMPMine = 0;
         this._arrayCurrentWeapons = [new WeaponObject(this._skinsArrayWeapon[0])];
         this.currentHealth = 800;
         this.currentLevel = 1;
         this.scores = 0;
      }
      
      private function parseEmbedResourse() : void
      {
         this.createEnemySkins();
         this.createLevels();
         this.createSkinsArrayOMP();
         this.createSkinsArrayTurret();
         this.createSkinsArrayWeapon();
      }
      
      public function saveGame(arrayWeapons:Array, arrayAchivements:Array) : void
      {
         var item:WeaponObject = null;
         this._lso.data.write = true;
         this._lso.data.amountOMPAtom = this.amountOMPAtom;
         this._lso.data.amountOMPAvia = this.amountOMPAvia;
         this._lso.data.amountOMPMine = this.amountOMPMine;
         this._lso.data.arrayAchivements = arrayAchivements;
         this._lso.data.currentHealth = this._currentHealth;
         this._lso.data.currentLevel = this._currentLevel;
         this._lso.data.currentMoney = _amountMoney;
         this._lso.data.currentScores = this._scores;
         var array:Array = [];
         for(var i:int = 0; i < arrayWeapons.length; i++)
         {
            item = arrayWeapons[i];
            array.push(item.name);
         }
         this._lso.data.arrayWeapons = array;
         this._lso.flush();
      }
      
      public function saveMoney() : void
      {
         this._lso.data.currentMoney = _amountMoney;
         this._lso.flush();
      }
   }
}

