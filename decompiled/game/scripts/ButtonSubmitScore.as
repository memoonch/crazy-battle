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
   
   [Embed(source="/_assets/assets.swf", symbol="symbol52")]
   public dynamic class ButtonSubmitScore extends MovieClip
   {
      
      public var submitText:TextField;
      
      public function ButtonSubmitScore()
      {
         super();
         addFrameScript(0,this.frame1,1,this.frame2);
      }
      
      public function mouseOn(e:Event) : void
      {
         removeEventListener(MouseEvent.MOUSE_OVER,this.mouseOn);
         gotoAndStop(2);
      }
      
      public function mouseOff(e:Event) : void
      {
         removeEventListener(MouseEvent.MOUSE_OUT,this.mouseOff);
         gotoAndStop(1);
      }
      
      internal function frame1() : *
      {
         stop();
         this.submitText.text = FogTrans.translate("submit_score");
         addEventListener(MouseEvent.MOUSE_OVER,this.mouseOn);
         buttonMode = true;
         this.showHandCursor = true;
         mouseChildren = false;
      }
      
      internal function frame2() : *
      {
         stop();
         this.submitText.text = FogTrans.translate("submit_score");
         addEventListener(MouseEvent.MOUSE_OUT,this.mouseOff);
      }
   }
}

