package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol634")]
   public dynamic class UnitTank extends MovieClip
   {
      
      public var t:MovieClip;
      
      public function UnitTank()
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

