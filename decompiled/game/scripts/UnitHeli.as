package
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol889")]
   public dynamic class UnitHeli extends MovieClip
   {
      
      public var heli:MovieClip;
      
      public var can:SoundChannel;
      
      public var snd:Sound;
      
      public function UnitHeli()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.can = new SoundChannel();
         this.snd = new sndChop();
      }
   }
}

