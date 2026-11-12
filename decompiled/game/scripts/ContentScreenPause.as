package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol699")]
   public dynamic class ContentScreenPause extends MovieClip
   {
      
      public var pauseText:TextField;
      
      public function ContentScreenPause()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.pauseText.text = FogTrans.translate("pause");
      }
   }
}

