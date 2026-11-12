package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol868")]
   public dynamic class helPulemetEm_65 extends MovieClip
   {
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function helPulemetEm_65()
      {
         super();
         addFrameScript(0,this.frame1,1,this.frame2,6,this.frame7);
      }
      
      internal function frame1() : *
      {
         stop();
      }
      
      internal function frame2() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndMax2();
         this.can = this.snd.play();
      }
      
      internal function frame7() : *
      {
         this.can.stop();
      }
   }
}

