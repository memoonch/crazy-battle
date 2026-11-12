package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1387")]
   public dynamic class UnitSoldatBazooka extends MovieClip
   {
      
      public var s1:MovieClip;
      
      public function UnitSoldatBazooka()
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

