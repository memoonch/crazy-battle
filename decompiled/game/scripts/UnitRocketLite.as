package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1178")]
   public dynamic class UnitRocketLite extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitRocketLite()
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

