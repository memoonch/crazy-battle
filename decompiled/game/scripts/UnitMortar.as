package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1142")]
   public dynamic class UnitMortar extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitMortar()
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

