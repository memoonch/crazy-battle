package assetsGame_fla
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol101")]
   public dynamic class shootTank_111 extends MovieClip
   {
      
      public function shootTank_111()
      {
         super();
         addFrameScript(6,this.frame7);
      }
      
      internal function frame7() : *
      {
         stop();
      }
   }
}

