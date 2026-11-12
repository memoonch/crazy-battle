package assetsGame_fla
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol223")]
   public dynamic class zenitFull_229 extends MovieClip
   {
      
      public var k2:MovieClip;
      
      public var k1:MovieClip;
      
      public function zenitFull_229()
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

