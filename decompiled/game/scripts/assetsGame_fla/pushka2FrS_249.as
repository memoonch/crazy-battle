package assetsGame_fla
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol208")]
   public dynamic class pushka2FrS_249 extends MovieClip
   {
      
      public var k2:MovieClip;
      
      public var k1:MovieClip;
      
      public function pushka2FrS_249()
      {
         super();
         addFrameScript(0,this.frame1,14,this.frame15,16,this.frame17,20,this.frame21,24,this.frame25);
      }
      
      internal function frame1() : *
      {
         stop();
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
      
      internal function frame15() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame17() : *
      {
         this.k1.gotoAndStop(2);
         this.k2.gotoAndStop(2);
      }
      
      internal function frame21() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame25() : *
      {
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
   }
}

