package
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1289")]
   public dynamic class UnitOMPAtom extends MovieClip
   {
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function UnitOMPAtom()
      {
         super();
         addFrameScript(0,this.frame1,63,this.frame64);
      }
      
      internal function frame1() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndNuc();
         this.can = this.snd.play();
      }
      
      internal function frame64() : *
      {
         this.can.stop();
      }
   }
}

