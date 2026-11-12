package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1087")]
   public dynamic class UnitCannonNormal extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitCannonNormal()
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

