package Playtomic
{
   import flash.events.TimerEvent;
   import flash.external.ExternalInterface;
   import flash.net.SharedObject;
   import flash.system.Security;
   import flash.utils.Timer;
   
   public final class Log
   {
      
      public static var SourceUrl:String;
      
      public static var BaseUrl:String;
      
      public static var Cookie:SharedObject;
      
      public static var Request:LogRequest;
      
      public static var Enabled:Boolean = false;
      
      public static var Queue:Boolean = true;
      
      public static var SWFID:int = 0;
      
      public static var GUID:String = "";
      
      private static const PingF:Timer = new Timer(60000);
      
      private static const PingR:Timer = new Timer(30000);
      
      private static var FirstPing:Boolean = true;
      
      private static var Pings:int = 0;
      
      private static var Plays:int = 0;
      
      private static var HighestGoal:int = 0;
      
      private static var Frozen:Boolean = false;
      
      private static var FrozenQueue:Array = new Array();
      
      private static var Customs:Array = new Array();
      
      private static var LevelCounters:Array = new Array();
      
      private static var LevelAverages:Array = new Array();
      
      private static var LevelRangeds:Array = new Array();
      
      public function Log()
      {
         super();
      }
      
      public static function View(swfid:int = 0, guid:String = "", defaulturl:String = "") : void
      {
         if(SWFID > 0)
         {
            return;
         }
         SWFID = swfid;
         GUID = guid;
         Enabled = true;
         if(SWFID == 0 || GUID == "")
         {
            Enabled = false;
            return;
         }
         if(defaulturl.indexOf("http://") != 0 && Security.sandboxType != "localWithNetwork" && Security.sandboxType != "localTrusted")
         {
            Enabled = false;
            return;
         }
         SourceUrl = GetUrl(defaulturl);
         if(SourceUrl == null || SourceUrl == "" || SourceUrl.indexOf("https://") == 0)
         {
            Enabled = false;
            return;
         }
         Security.allowDomain("http://g" + Log.GUID + ".api.playtomic.com/");
         Security.allowInsecureDomain("http://g" + Log.GUID + ".api.playtomic.com/");
         Security.loadPolicyFile("http://g" + Log.GUID + ".api.playtomic.com/crossdomain.xml");
         Request = LogRequest.Create();
         Cookie = SharedObject.getLocal("playtomic");
         var views:int = GetCookie("views");
         Send("v/" + (views + 1),true);
         PingF.addEventListener(TimerEvent.TIMER,PingServer);
         PingF.start();
      }
      
      public static function IncreaseViews() : void
      {
         var views:int = GetCookie("views");
         views++;
         SaveCookie("views",views);
      }
      
      public static function IncreasePlays() : void
      {
         ++Plays;
      }
      
      public static function Play() : void
      {
         if(!Enabled)
         {
            return;
         }
         LevelCounters = new Array();
         LevelAverages = new Array();
         LevelRangeds = new Array();
         Send("p/" + (Plays + 1),true);
      }
      
      private static function PingServer(... args) : void
      {
         if(!Enabled)
         {
            return;
         }
         ++Pings;
         Send("t/" + (FirstPing ? "y" : "n") + "/" + Pings,true);
         if(FirstPing)
         {
            PingF.stop();
            PingR.addEventListener(TimerEvent.TIMER,PingServer);
            PingR.start();
            FirstPing = false;
         }
      }
      
      public static function CustomMetric(name:String, group:String = null, unique:Boolean = false) : void
      {
         if(!Enabled)
         {
            return;
         }
         if(group == null)
         {
            group = "";
         }
         if(unique)
         {
            if(Customs.indexOf(name) > -1)
            {
               return;
            }
            Customs.push(name);
         }
         Send("c/" + Clean(name) + "/" + Clean(group));
      }
      
      public static function LevelCounterMetric(name:String, level:*, unique:Boolean = false) : void
      {
         if(!Enabled)
         {
            return;
         }
         if(unique)
         {
            if(LevelCounters.indexOf(name) > -1)
            {
               return;
            }
            LevelCounters.push(name);
         }
         Send("lc/" + Clean(name) + "/" + Clean(level));
      }
      
      public static function LevelRangedMetric(name:String, level:*, value:int, unique:Boolean = false) : void
      {
         if(!Enabled)
         {
            return;
         }
         if(unique)
         {
            if(LevelRangeds.indexOf(name) > -1)
            {
               return;
            }
            LevelRangeds.push(name);
         }
         Send("lr/" + Clean(name) + "/" + Clean(level) + "/" + value);
      }
      
      public static function LevelAverageMetric(name:String, level:*, value:int, unique:Boolean = false) : void
      {
         if(!Enabled)
         {
            return;
         }
         if(unique)
         {
            if(LevelAverages.indexOf(name) > -1)
            {
               return;
            }
            LevelAverages.push(name);
         }
         Send("la/" + Clean(name) + "/" + Clean(level) + "/" + value);
      }
      
      public static function Link(url:String, name:String, group:String, unique:int, total:int, fail:int) : void
      {
         if(!Enabled)
         {
            return;
         }
         Send("l/" + Clean(name) + "/" + Clean(group) + "/" + Clean(url) + "/" + unique + "/" + total + "/" + fail);
      }
      
      public static function Freeze() : void
      {
         Frozen = true;
      }
      
      public static function UnFreeze() : void
      {
         Frozen = false;
         Request.MassQueue(FrozenQueue);
      }
      
      public static function ForceSend() : void
      {
         if(!Enabled)
         {
            return;
         }
         Request.Send();
         Request = LogRequest.Create();
         if(FrozenQueue.length > 0)
         {
            Request.MassQueue(FrozenQueue);
         }
      }
      
      private static function Send(s:String, view:Boolean = false) : void
      {
         if(Frozen)
         {
            FrozenQueue.push(s);
            return;
         }
         Request.Queue(s);
         if(Request.Ready || view || !Queue)
         {
            Request.Send();
            Request = LogRequest.Create();
         }
      }
      
      private static function Clean(s:String) : String
      {
         while(s.indexOf("/") > -1)
         {
            s = s.replace("/","\\");
         }
         while(s.indexOf("~") > -1)
         {
            s = s.replace("~","-");
         }
         return escape(s);
      }
      
      private static function GetCookie(n:String) : int
      {
         if(Cookie.data[n] == undefined)
         {
            return 0;
         }
         return int(Cookie.data[n]);
      }
      
      private static function SaveCookie(n:String, v:int) : void
      {
         var cookie:SharedObject = SharedObject.getLocal("swfstats");
         cookie.data[n] = v.toString();
         cookie.flush();
      }
      
      private static function GetUrl(defaulturl:String) : String
      {
         var url:String = null;
         if(ExternalInterface.available)
         {
            try
            {
               url = String(ExternalInterface.call("window.location.href.toString"));
            }
            catch(s:Error)
            {
               url = defaulturl;
            }
         }
         else if(defaulturl.indexOf("http://") == 0 || defaulturl.indexOf("https://") == 0)
         {
            url = defaulturl;
         }
         if(url == null || url == "" || url == "null")
         {
            if(Security.sandboxType == "localWithNetwork" || Security.sandboxType == "localTrusted")
            {
               url = "http://local-testing/";
            }
            else
            {
               url = null;
            }
         }
         return escape(url);
      }
   }
}

