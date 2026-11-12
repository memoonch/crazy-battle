package assetsGame_fla
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol182")]
   public dynamic class zenit_236 extends MovieClip
   {
      
      public var k2:MovieClip;
      
      public var k1:MovieClip;
      
      public function zenit_236()
      {
         super();
         addFrameScript(0,this.frame1,9,this.frame10,10,this.frame11,11,this.frame12,20,this.frame21,25,this.frame26,30,this.frame31);
      }
      
      internal function frame1() : *
      {
         stop();
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame10() : *
      {
         this.k1.gotoAndStop(2);
         this.k2.gotoAndStop(2);
      }
      
      internal function frame11() : *
      {
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
      
      internal function frame12() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
      
      internal function frame21() : *
      {
         this.k1.gotoAndStop(1);
         this.k2.gotoAndStop(1);
      }
      
      internal function frame26() : *
      {
         this.k1.gotoAndStop(2);
         this.k2.gotoAndStop(2);
      }
      
      internal function frame31() : *
      {
         this.k1.gotoAndStop(3);
         this.k2.gotoAndStop(3);
      }
   }
}

