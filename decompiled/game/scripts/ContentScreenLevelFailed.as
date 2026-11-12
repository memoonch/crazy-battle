package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol846")]
   public dynamic class ContentScreenLevelFailed extends MovieClip
   {
      
      public var failedText:TextField;
      
      public function ContentScreenLevelFailed()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.failedText.text = FogTrans.translate("failed");
      }
   }
}

