package Fog_EN3_fla
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1429")]
   public dynamic class preloaderBar_56 extends MovieClip
   {
      
      public var loader_txt:TextField;
      
      public var textB:TextField;
      
      public var loaderBar:MovieClip;
      
      public function preloaderBar_56()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         stop();
      }
   }
}

