package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol269")]
   public dynamic class ContentScreenCredits extends MovieClip
   {
      
      public var credits3Text:TextField;
      
      public var credits2Text:TextField;
      
      public var credits1Text:TextField;
      
      public function ContentScreenCredits()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.credits1Text.text = FogTrans.translate("credits_1");
         this.credits2Text.text = FogTrans.translate("credits_2");
         this.credits3Text.text = FogTrans.translate("credits_3");
      }
   }
}

