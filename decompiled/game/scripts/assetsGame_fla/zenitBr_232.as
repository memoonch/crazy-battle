package assetsGame_fla
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1258")]
   public dynamic class zenitBr_232 extends MovieClip
   {
      
      public var k2:MovieClip;
      
      public var k1:MovieClip;
      
      public function zenitBr_232()
      {
         super();
         addFrameScript(0,this.frame1,169,this.frame170);
      }
      
      internal function frame1() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame170() : *
      {
         stop();
      }
   }
}

