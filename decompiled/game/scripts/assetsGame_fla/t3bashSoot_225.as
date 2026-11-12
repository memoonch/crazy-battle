package assetsGame_fla
{
   import flash.display.MovieClip;
   import flash.media.Sound;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol552")]
   public dynamic class t3bashSoot_225 extends MovieClip
   {
      
      public var rock:MovieClip;
      
      public var snd:Sound;
      
      public function t3bashSoot_225()
      {
         super();
         addFrameScript(0,this.frame1,1,this.frame2);
      }
      
      internal function frame1() : *
      {
         stop();
      }
      
      internal function frame2() : *
      {
         this.snd = new sndRoket();
         this.snd.play();
      }
   }
}

