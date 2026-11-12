package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol591")]
   public dynamic class PreloaderProgressBar extends MovieClip
   {
      
      public var s1:MovieClip;
      
      public function PreloaderProgressBar()
      {
         super();
         addFrameScript(99,this.frame100);
      }
      
      internal function frame100() : *
      {
         stop();
      }
   }
}

