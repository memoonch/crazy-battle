package assetsGame_fla
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
   
   [Embed(source="/_assets/assets.swf", symbol="symbol221")]
   public dynamic class t2pushka_147 extends MovieClip
   {
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public var snd1:Sound;
      
      public var snd2:Sound;
      
      public var snd3:Sound;
      
      public var arrS:Array;
      
      public var ind:int;
      
      public function t2pushka_147()
      {
         super();
         addFrameScript(0,this.frame1,13,this.frame14,39,this.frame40);
      }
      
      internal function frame1() : *
      {
         stop();
      }
      
      internal function frame14() : *
      {
         this.can = new SoundChannel();
         this.snd1 = new sndCann1();
         this.snd2 = new sndCann2();
         this.snd3 = new sndCann3();
         this.arrS = [this.snd1,this.snd2,this.snd3];
         this.ind = Math.floor(Math.random() * 10 * 0.3);
         this.snd = this.arrS[this.ind];
         this.can = this.snd.play();
      }
      
      internal function frame40() : *
      {
         this.can.stop();
      }
   }
}

