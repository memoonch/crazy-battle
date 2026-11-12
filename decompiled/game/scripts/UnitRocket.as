package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol556")]
   public dynamic class UnitRocket extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitRocket()
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

