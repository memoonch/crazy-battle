package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1262")]
   public dynamic class UnitCannonBig extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitCannonBig()
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

