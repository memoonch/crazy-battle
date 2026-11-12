package
{
   import adobe.utils.*;
   import flash.accessibility.*;
   import flash.desktop.*;
   import flash.display.*;
   import flash.errors.*;
   import flash.events.*;
   import flash.external.*;
   import flash.filters.*;
   import flash.geom.*;
   import flash.globalization.*;
   import flash.media.*;
   import flash.net.*;
   import flash.net.drm.*;
   import flash.printing.*;
   import flash.profiler.*;
   import flash.sampler.*;
   import flash.sensors.*;
   import flash.system.*;
   import flash.text.*;
   import flash.text.engine.*;
   import flash.text.ime.*;
   import flash.ui.*;
   import flash.utils.*;
   import flash.xml.*;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol842")]
   public dynamic class ButtonStartLevel extends MovieClip
   {
      
      public var weapon_btn:MovieClip;
      
      public function ButtonStartLevel()
      {
         super();
         addFrameScript(0,this.frame1,2,this.frame3);
      }
      
      internal function frame1() : *
      {
         stop();
         buttonMode = true;
         this.showHandCursor = true;
         mouseChildren = false;
      }
      
      internal function frame3() : *
      {
         buttonMode = true;
         this.showHandCursor = true;
         mouseChildren = false;
      }
   }
}

