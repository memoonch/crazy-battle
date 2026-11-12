package game.objects
{
   import flash.events.Event;
   import flash.events.EventDispatcher;
   import flash.events.TimerEvent;
   import flash.utils.Timer;
   import game.Game;
   
   public class AchivementsObject extends EventDispatcher
   {
      
      public static const ACHIVEMENTS_COMBO2:String = "achivementsCombo2";
      
      public static const ACHIVEMENTS_COMBO5:String = "achivementsCombo5";
      
      public static const ACHIVEMENTS_DEFENDER:String = "achivementsDefender";
      
      public static const ACHIVEMENTS_BRONZE:String = "achivementsBronze";
      
      public static const ACHIVEMENTS_SILVER:String = "achivementsSilver";
      
      public static const ACHIVEMENTS_GOLD:String = "achivementsGold";
      
      public static const ADD_ACHIVEMENT:String = "addAchivement";
      
      public static const REFRESH_ACHIVEMENT:String = "refreshAchivement";
      
      private var _addedAchivement:String;
      
      private var _amountEnemysCombo:int;
      
      private var _arrayAchivements:Array = [];
      
      private var _begHealth:int;
      
      private var _endHealth:int;
      
      private var _game:Game;
      
      private var _infoObject:InfoObject;
      
      private var _lastPlayedLevel:int = 0;
      
      private var _timerCombo:Timer;
      
      private var _timeLastKill:int;
      
      public function AchivementsObject(game:Game, infoObject:InfoObject)
      {
         super();
         this._infoObject = infoObject;
         this._game = game;
         this.init();
      }
      
      public function get arrayAchivements() : Array
      {
         return this._arrayAchivements;
      }
      
      public function set arrayAchivements(value:Array) : void
      {
         this._arrayAchivements = value;
         dispatchEvent(new Event(AchivementsObject.REFRESH_ACHIVEMENT));
      }
      
      public function get addedAchivement() : String
      {
         return this._addedAchivement;
      }
      
      public function set addedAchivement(value:String) : void
      {
         this._addedAchivement = value;
         dispatchEvent(new Event(AchivementsObject.ADD_ACHIVEMENT));
      }
      
      private function init() : void
      {
         this._infoObject.addEventListener(InfoObject.REFRESH_LEVEL,this.addLevelAchivement);
         this._game.addEventListener(Game.REFRESH_ENEMYS,this.refreshEnemysHandler);
      }
      
      private function addLevelAchivement(event:Event) : void
      {
         var i:int = 0;
         var item:String = null;
         var defenderAlreadyOpen:Boolean = false;
         if(this._lastPlayedLevel < this._infoObject.currentLevel)
         {
            this._endHealth = this._game.barrage.health;
            if(this._begHealth == this._endHealth)
            {
               defenderAlreadyOpen = false;
               for(i = 0; i < this._arrayAchivements.length; i++)
               {
                  item = this._arrayAchivements[i];
                  if(item == AchivementsObject.ACHIVEMENTS_DEFENDER)
                  {
                     defenderAlreadyOpen = true;
                  }
               }
               if(!defenderAlreadyOpen)
               {
                  this.addedAchivement = AchivementsObject.ACHIVEMENTS_DEFENDER;
                  this._arrayAchivements.push(this.addedAchivement);
               }
            }
            this._begHealth = this._game.barrage.health;
            this._lastPlayedLevel = this._infoObject.currentLevel;
         }
         if(this._infoObject.currentLevel == 5)
         {
            this.addedAchivement = AchivementsObject.ACHIVEMENTS_BRONZE;
            this._arrayAchivements.push(this.addedAchivement);
         }
         else if(this._infoObject.currentLevel == 10)
         {
            this.addedAchivement = AchivementsObject.ACHIVEMENTS_SILVER;
            this._arrayAchivements.push(this.addedAchivement);
         }
         else if(this._infoObject.currentLevel == 20)
         {
            this.addedAchivement = AchivementsObject.ACHIVEMENTS_GOLD;
            this._arrayAchivements.push(this.addedAchivement);
         }
      }
      
      private function refreshEnemysHandler(event:Event) : void
      {
         var i:int = 0;
         var item:String = null;
         var combo2AlreadyOpen:Boolean = false;
         var combo5AlreadyOpen:Boolean = false;
         if(this._timeLastKill == 0)
         {
            if(Boolean(this._timerCombo))
            {
               this._timerCombo.stop();
               this._timerCombo.removeEventListener(TimerEvent.TIMER,this.timerHandler);
            }
            this._timerCombo = new Timer(25,0);
            this._timerCombo.addEventListener(TimerEvent.TIMER,this.timerHandler);
            this._timerCombo.start();
            ++this._amountEnemysCombo;
         }
         else if(this._timeLastKill > 0 && this._timeLastKill < 300)
         {
            ++this._amountEnemysCombo;
            if(this._amountEnemysCombo >= 2 && this._amountEnemysCombo < 5)
            {
               combo2AlreadyOpen = false;
               for(i = 0; i < this._arrayAchivements.length; i++)
               {
                  item = this._arrayAchivements[i];
                  if(item == AchivementsObject.ACHIVEMENTS_COMBO2)
                  {
                     combo2AlreadyOpen = true;
                  }
               }
               if(!combo2AlreadyOpen)
               {
                  this.addedAchivement = AchivementsObject.ACHIVEMENTS_COMBO2;
                  this._arrayAchivements.push(this.addedAchivement);
                  this._timeLastKill = 0;
                  this._amountEnemysCombo = 0;
               }
            }
            else if(this._amountEnemysCombo == 5)
            {
               combo5AlreadyOpen = false;
               for(i = 0; i < this._arrayAchivements.length; i++)
               {
                  item = this._arrayAchivements[i];
                  if(item == AchivementsObject.ACHIVEMENTS_COMBO5)
                  {
                     combo5AlreadyOpen = true;
                  }
               }
               if(!combo5AlreadyOpen)
               {
                  this.addedAchivement = AchivementsObject.ACHIVEMENTS_COMBO5;
                  this._arrayAchivements.push(this.addedAchivement);
                  this._timeLastKill = 0;
                  this._amountEnemysCombo = 0;
               }
            }
         }
         else if(this._timeLastKill > 300)
         {
            this._timeLastKill = 0;
            this._amountEnemysCombo = 0;
         }
      }
      
      private function timerHandler(event:TimerEvent) : void
      {
         this._timeLastKill += 25;
      }
   }
}

