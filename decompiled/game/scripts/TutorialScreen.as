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
   
   [Embed(source="/_assets/assets.swf", symbol="symbol841")]
   public dynamic class TutorialScreen extends MovieClip
   {
      
      public var tut1Text:TextField;
      
      public var tut3Text:TextField;
      
      public var tut2Text:TextField;
      
      public var startText:TextField;
      
      public var tutTitleText:TextField;
      
      public function TutorialScreen()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.tutTitleText.text = FogTrans.translate("tutorial_title");
         this.tut1Text.text = FogTrans.translate("tutorial_1");
         this.tut2Text.text = FogTrans.translate("tutorial_2");
         this.tut3Text.text = FogTrans.translate("tutorial_3");
         this.startText.text = FogTrans.translate("click_start");
         buttonMode = true;
         this.showHandCursor = true;
         mouseChildren = false;
      }
   }
}

