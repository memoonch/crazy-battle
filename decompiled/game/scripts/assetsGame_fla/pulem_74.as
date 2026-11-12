package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol878")]
   public dynamic class pulem_74 extends MovieClip
   {
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function pulem_74()
      {
         super();
         addFrameScript(0,this.frame1,1,this.frame2,14,this.frame15);
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
      
      internal function frame15() : *
      {
         if(Boolean(this.can))
         {
            this.can.stop();
         }
      }
   }
}

