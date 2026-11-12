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
   
   [Embed(source="/_assets/assets.swf", symbol="symbol282")]
   public dynamic class soldier_84 extends MovieClip
   {
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public var snd1:Sound;
      
      public var snd2:Sound;
      
      public var snd3:Sound;
      
      public var arrS:Array;
      
      public var ind:int;
      
      public function soldier_84()
      {
         super();
         addFrameScript(0,this.frame1,13,this.frame14,38,this.frame39);
      }
      
      internal function frame1() : *
      {
         stop();
      }
      
      internal function frame14() : *
      {
         this.can = new SoundChannel();
         this.snd1 = new sndAvt1();
         this.snd2 = new sndAvt2();
         this.snd3 = new sndAvt3();
         this.arrS = [this.snd1,this.snd2,this.snd3];
         this.ind = Math.floor(Math.random() * 10 * 0.3);
         this.snd = this.arrS[this.ind];
         this.can = this.snd.play();
      }
      
      internal function frame39() : *
      {
         this.can.stop();
      }
   }
}

