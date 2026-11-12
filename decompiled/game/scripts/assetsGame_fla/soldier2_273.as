package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol641")]
   public dynamic class soldier2_273 extends MovieClip
   {
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function soldier2_273()
      {
         super();
         addFrameScript(0,this.frame1,5,this.frame6,20,this.frame21);
      }
      
      internal function frame1() : *
      {
         stop();
      }
      
      internal function frame6() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndMinomet();
         this.can = this.snd.play();
      }
      
      internal function frame21() : *
      {
         this.can.stop();
      }
   }
}

