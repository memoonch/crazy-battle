package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1043")]
   public dynamic class UnitTankLite extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitTankLite()
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

