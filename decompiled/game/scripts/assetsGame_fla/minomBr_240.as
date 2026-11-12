package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol763")]
   public dynamic class minomBr_240 extends MovieClip
   {
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function minomBr_240()
      {
         super();
         addFrameScript(0,this.frame1,16,this.frame17,49,this.frame50);
      }
      
      internal function frame1() : *
      {
         stop();
      }
      
      internal function frame17() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndMinomet();
         this.can = this.snd.play();
      }
      
      internal function frame50() : *
      {
         this.can.stop();
      }
   }
}

