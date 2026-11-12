package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1109")]
   public dynamic class zenitF_234 extends MovieClip
   {
      
      public var k2:MovieClip;
      
      public var k1:MovieClip;
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function zenitF_234()
      {
         super();
         addFrameScript(0,this.frame1,7,this.frame8,9,this.frame10,10,this.frame11,11,this.frame12,20,this.frame21,25,this.frame26,30,this.frame31);
      }
      
      internal function frame1() : *
      {
         stop();
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame8() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndCann3();
         this.can = this.snd.play();
      }
      
      internal function frame10() : *
      {
         this.k1.gotoAndStop(2);
         this.k2.gotoAndStop(2);
      }
      
      internal function frame11() : *
      {
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
      
      internal function frame12() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame21() : *
      {
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
      
      internal function frame26() : *
      {
         this.k1.gotoAndStop(2);
         this.k2.gotoAndStop(2);
      }
      
      internal function frame31() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
   }
}

