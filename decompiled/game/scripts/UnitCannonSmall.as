package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1243")]
   public dynamic class UnitCannonSmall extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitCannonSmall()
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

