package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol454")]
   public dynamic class pushkaS_254 extends MovieClip
   {
      
      public var k1:MovieClip;
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function pushkaS_254()
      {
         super();
         addFrameScript(0,this.frame1,10,this.frame11);
      }
      
      internal function frame1() : *
      {
         stop();
      }
      
      internal function frame11() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndCann1();
         this.can = this.snd.play();
      }
   }
}

