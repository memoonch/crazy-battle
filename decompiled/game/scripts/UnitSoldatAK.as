package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol440")]
   public dynamic class UnitSoldatAK extends MovieClip
   {
      
      public var s1:MovieClip;
      
      public function UnitSoldatAK()
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

