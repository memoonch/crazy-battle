package Playtomic
{
   import flash.events.Event;
   import flash.events.HTTPStatusEvent;
   import flash.events.IOErrorEvent;
   import flash.events.SecurityErrorEvent;
   import flash.net.URLLoader;
   import flash.net.URLRequest;
   import flash.net.URLRequestMethod;
   import flash.net.URLVariables;
   
   public class Leaderboards
   {
      
      public function Leaderboards()
      {
         super();
      }
      
      public static function List(table:String, callback:Function, options:Object = null) : void
      {
         var global:Boolean;
         var highest:Boolean;
         var mode:String;
         var customfilters:Object;
         var page:int;
         var perpage:int;
         var fail:Function;
         var httpstatusignore:Function;
         var postdata:URLVariables;
         var numcustomfilters:int;
         var request:URLRequest;
         var sendaction:URLLoader = null;
         var handled:Boolean = false;
         var bridge:Function = null;
         var key:String = null;
         if(options == null)
         {
            options = new Object();
         }
         global = options.hasOwnProperty("global") ? Boolean(options["global"]) : true;
         highest = options.hasOwnProperty("highest") ? Boolean(options["highest"]) : true;
         mode = options.hasOwnProperty("mode") ? options["mode"] : "alltime";
         customfilters = options.hasOwnProperty("customfilters") ? options["customfilters"] : {};
         trace("Custom filters are " + customfilters);
         page = options.hasOwnProperty("page") ? int(options["page"]) : 1;
         perpage = options.hasOwnProperty("perpage") ? int(options["perpage"]) : 20;
         sendaction = new URLLoader();
         handled = false;
         if(callback != null)
         {
            bridge = function():void
            {
               if(callback == null || handled)
               {
                  return;
               }
               handled = true;
               ProcessScores(sendaction,callback);
            };
            sendaction.addEventListener(Event.COMPLETE,bridge);
         }
         fail = function():void
         {
            if(callback == null || handled)
            {
               return;
            }
            handled = true;
            callback([],0,{
               "Success":false,
               "ErrorCode":1
            });
         };
         httpstatusignore = function():void
         {
         };
         postdata = new URLVariables();
         numcustomfilters = 0;
         if(customfilters != null)
         {
            for(key in customfilters)
            {
               postdata["ckey" + numcustomfilters] = key;
               postdata["cdata" + numcustomfilters] = escape(customfilters[key]);
               numcustomfilters++;
            }
         }
         request = new URLRequest("http://g" + Log.GUID + ".api.playtomic.com/leaderboards/list.aspx?swfid=" + Log.SWFID + "&table=" + table + "&mode=" + mode + "&filters=" + numcustomfilters + "&url=" + (global || Log.SourceUrl == null ? "global" : Log.SourceUrl) + "&highest=" + (highest ? "y" : "n") + "&page=" + page + "&perpage=" + perpage + "&" + Math.random());
         request.data = postdata;
         request.method = URLRequestMethod.POST;
         sendaction.addEventListener(IOErrorEvent.IO_ERROR,fail,false,0,true);
         sendaction.addEventListener(HTTPStatusEvent.HTTP_STATUS,httpstatusignore,false,0,true);
         sendaction.addEventListener(SecurityErrorEvent.SECURITY_ERROR,fail,false,0,true);
         sendaction.load(request);
      }
      
      public static function ListFB(table:String, callback:Function, options:Object = null) : void
      {
         var global:Boolean;
         var highest:Boolean;
         var friendslist:Array;
         var mode:String;
         var customfilters:Object;
         var page:int;
         var perpage:int;
         var fail:Function;
         var httpstatusignore:Function;
         var postdata:URLVariables;
         var numcustomfilters:int;
         var request:URLRequest;
         var sendaction:URLLoader = null;
         var handled:Boolean = false;
         var bridge:Function = null;
         var key:String = null;
         if(options == null)
         {
            options = new Object();
         }
         global = options.hasOwnProperty("global") ? Boolean(options["global"]) : true;
         highest = options.hasOwnProperty("highest") ? Boolean(options["highest"]) : true;
         friendslist = options.hasOwnProperty("friendslist") ? options["friendslist"] : new Array();
         mode = options.hasOwnProperty("mode") ? options["mode"] : "alltime";
         customfilters = options.hasOwnProperty("customfilters") ? options["customfilters"] : {};
         page = options.hasOwnProperty("page") ? int(options["page"]) : 1;
         perpage = options.hasOwnProperty("perpage") ? int(options["perpage"]) : 20;
         sendaction = new URLLoader();
         handled = false;
         if(callback != null)
         {
            bridge = function():void
            {
               if(callback == null || handled)
               {
                  return;
               }
               handled = true;
               ProcessScores(sendaction,callback);
            };
            sendaction.addEventListener(Event.COMPLETE,bridge);
         }
         fail = function():void
         {
            if(callback == null || handled)
            {
               return;
            }
            handled = true;
            callback([],0,{
               "Success":false,
               "ErrorCode":1
            });
         };
         httpstatusignore = function():void
         {
         };
         postdata = new URLVariables();
         postdata["friendslist"] = friendslist.join(",");
         numcustomfilters = 0;
         if(customfilters != null)
         {
            for(key in customfilters)
            {
               postdata["ckey" + numcustomfilters] = key;
               postdata["cdata" + numcustomfilters] = escape(customfilters[key]);
               numcustomfilters++;
            }
         }
         request = new URLRequest("http://g" + Log.GUID + ".api.playtomic.com/leaderboards/listfb.aspx?swfid=" + Log.SWFID + "&table=" + table + "&mode=" + mode + "&filters=" + numcustomfilters + "&url=" + (global || Log.SourceUrl == null ? "global" : Log.SourceUrl) + "&highest=" + (highest ? "y" : "n") + "&page=" + page + "&perpage=" + perpage + "&" + Math.random());
         request.data = postdata;
         request.method = URLRequestMethod.POST;
         sendaction.addEventListener(IOErrorEvent.IO_ERROR,fail,false,0,true);
         sendaction.addEventListener(HTTPStatusEvent.HTTP_STATUS,httpstatusignore,false,0,true);
         sendaction.addEventListener(SecurityErrorEvent.SECURITY_ERROR,fail,false,0,true);
         sendaction.load(request);
      }
      
      public static function Save(score:PlayerScore, table:String, callback:Function = null, options:Object = null) : void
      {
         var facebook:Boolean;
         var allowduplicates:Boolean;
         var highest:Boolean;
         var fail:Function;
         var httpstatusignore:Function;
         var s:String;
         var postdata:URLVariables;
         var customfields:int;
         var request:URLRequest;
         var sendaction:URLLoader = null;
         var handled:Boolean = false;
         var bridge:Function = null;
         var key:String = null;
         if(options == null)
         {
            options = new Object();
         }
         facebook = options.hasOwnProperty("facebook") ? Boolean(options["facebook"]) : false;
         allowduplicates = options.hasOwnProperty("allowduplicates") ? Boolean(options["allowduplicates"]) : false;
         highest = options.hasOwnProperty("highest") ? Boolean(options["highest"]) : true;
         sendaction = new URLLoader();
         handled = false;
         if(callback != null)
         {
            bridge = function():void
            {
               if(callback == null || handled)
               {
                  return;
               }
               handled = true;
               var data:XML = XML(sendaction["data"]);
               var status:int = parseInt(data["status"]);
               if(status == 1)
               {
                  score.SDate = new Date();
                  score.RDate = "Just now";
               }
               callback(score,{
                  "Success":status == 1,
                  "ErrorCode":parseInt(data["errorcode"])
               });
            };
            sendaction.addEventListener(Event.COMPLETE,bridge);
         }
         fail = function():void
         {
            if(callback == null || handled)
            {
               return;
            }
            handled = true;
            callback(score,{
               "Success":false,
               "ErrorCode":1
            });
         };
         httpstatusignore = function():void
         {
         };
         s = score.Points.toString();
         if(s.indexOf(".") > -1)
         {
            s = s.substring(0,s.indexOf("."));
         }
         postdata = new URLVariables();
         postdata["table"] = escape(table);
         postdata["highest"] = highest;
         postdata["name"] = escape(score.Name);
         postdata["points"] = s;
         postdata["allowduplicates"] = allowduplicates ? "y" : "n";
         postdata["auth"] = Encode.MD5(Log.SourceUrl + s);
         postdata["fb"] = facebook ? "y" : "n";
         postdata["fbuserid"] = score.FBUserId;
         customfields = 0;
         if(score.CustomData != null)
         {
            for(key in score.CustomData)
            {
               postdata["ckey" + customfields] = key;
               postdata["cdata" + customfields] = escape(score.CustomData[key]);
               customfields++;
            }
         }
         postdata["customfields"] = customfields;
         request = new URLRequest("http://g" + Log.GUID + ".api.playtomic.com/leaderboards/save.aspx?swfid=" + Log.SWFID + "&url=" + Log.SourceUrl + "&r=" + Math.random());
         request.data = postdata;
         request.method = URLRequestMethod.POST;
         sendaction.addEventListener(IOErrorEvent.IO_ERROR,fail,false,0,true);
         sendaction.addEventListener(HTTPStatusEvent.HTTP_STATUS,httpstatusignore,false,0,true);
         sendaction.addEventListener(SecurityErrorEvent.SECURITY_ERROR,fail,false,0,true);
         sendaction.load(request);
      }
      
      private static function ProcessScores(loader:URLLoader, callback:Function) : void
      {
         var entries:XMLList = null;
         var datestring:String = null;
         var year:int = 0;
         var month:int = 0;
         var day:int = 0;
         var item:XML = null;
         var score:PlayerScore = null;
         var custom:XMLList = null;
         var cfield:XML = null;
         var data:XML = XML(loader["data"]);
         var status:int = parseInt(data["status"]);
         var errorcode:int = parseInt(data["errorcode"]);
         var numscores:int = parseInt(data["numscores"]);
         var results:Array = new Array();
         if(status == 1)
         {
            entries = data["score"];
            for each(item in entries)
            {
               datestring = item["sdate"];
               year = int(datestring.substring(datestring.lastIndexOf("/") + 1));
               month = int(datestring.substring(0,datestring.indexOf("/")));
               day = int(datestring.substring(datestring.indexOf("/") + 1).substring(0,2));
               score = new PlayerScore();
               score.SDate = new Date(year,month - 1,day);
               score.RDate = item["rdate"];
               score.Name = item["name"];
               score.Points = item["points"];
               score.Website = item["website"];
               if(Boolean(item["custom"]))
               {
                  custom = item["custom"];
                  for each(cfield in custom.children())
                  {
                     score.CustomData[cfield.name()] = cfield.text();
                  }
               }
               results.push(score);
            }
         }
         callback(results,numscores,{
            "Success":status == 1,
            "ErrorCode":errorcode
         });
      }
   }
}

