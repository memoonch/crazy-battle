package
{
   import flash.text.TextField;
   
   public class FogTrans
   {
      
      private static var translations:Object = {
         "crazy_battle":"CRAZY BATTLE",
         "new_game":"START NEW GAME",
         "continue":"CONTINUE",
         "add_game":"ADD THIS GAME TO YOUR WEBSITE",
         "tutorial_title":"TUTORIAL",
         "tutorial_1":"AIM AND SHOOT USING YOUR MOUSE.",
         "tutorial_2":"UPGRADE YOUR CHOPPER, ARSENAL AND BOMBS AS YOU EARN MONEY.",
         "tutorial_3":"WAR IS EXPENSIVE, YOUR MONEY IS ADDED TO YOUR OVERALL SCORE SO DON\'T SPEND TOO MUCH!",
         "click_start":"CLICK TO START",
         "level":"Level",
         "pts":"Pts",
         "menu":"Menu",
         "chopper":"Chopper",
         "arsenal":"Arsenal",
         "bombing":"Bombing",
         "achievements":"ACHIEVEMENTS",
         "pause":"PAUSE",
         "resume":"RESUME",
         "quit":"QUIT",
         "reload":"reload",
         "start_1":"DON\'T FORGET TO UPGRADE YOUR WEAPONS USING THE ICONS AT THE BOTTOM OF THE SCREEN.",
         "start_2":"IF YOU NEED TO HEAL YOUR BASE CLICK ON THE GREEN CROSS AT THE BOTTOM OF THE SCREEN, BUT IT WILL COST YOU.",
         "victory":"LEVEL VICTORY",
         "next":"NEXT",
         "submit_score":"SUBMIT SCORE",
         "failed":"LEVEL FAILED",
         "restart":"RESTART",
         "credits_1":"CONGRATULATIONS",
         "credits_2":"YOU HAVE DEFENDED THE BASE",
         "credits_3":"HERE IS YOUR FINAL SCORE",
         "back_to_menu":"BACK TO MAIN MENU",
         "defender":"Defender",
         "lasted_5":"Lasted 5 Waves",
         "lasted_10":"Lasted 10 Waves",
         "lasted_20":"Lasted 20 Waves",
         "finished_2":"Finished off two enemies at once",
         "finished_5":"Finished off five enemies at once"
      };
      
      public function FogTrans()
      {
         super();
      }
      
      public static function init(opt:Object) : void
      {
      }
      
      public static function translate(en:String, tx:TextField = null) : String
      {
         var tr:String = en;
         if(Boolean(translations[en.toLowerCase()]))
         {
            tr = translations[en.toLowerCase()];
         }
         else
         {
            tr = "Error";
         }
         if(Boolean(tx))
         {
            tx.text = tr;
         }
         return tr;
      }
   }
}

