package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol724")]
   public dynamic class pushka2BrS_248 extends MovieClip
   {
      
      public var k2:MovieClip;
      
      public var k1:MovieClip;
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function pushka2BrS_248()
      {
         super();
         addFrameScript(0,this.frame1,9,this.frame10,14,this.frame15,16,this.frame17,20,this.frame21,24,this.frame25);
      }
      
      internal function frame1() : *
      {
         stop();
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
      
      internal function frame10() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndCann2();
         this.can = this.snd.play();
      }
      
      internal function frame15() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame17() : *
      {
         this.k1.gotoAndStop(2);
         this.k2.gotoAndStop(2);
      }
      
      internal function frame21() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame25() : *
      {
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
   }
}

