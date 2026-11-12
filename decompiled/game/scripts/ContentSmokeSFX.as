package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol992")]
   public dynamic class ContentSmokeSFX extends MovieClip
   {
      
      public function ContentSmokeSFX()
      {
         super();
         addFrameScript(0,this.frame1,58,this.frame59);
      }
      
      internal function frame1() : *
      {
         this.rotation = Math.floor(Math.random() * 10 * 100);
      }
      
      internal function frame59() : *
      {
         stop();
         this.parent.removeChild(this);
      }
   }
}

