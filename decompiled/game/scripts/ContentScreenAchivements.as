package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1356")]
   public dynamic class ContentScreenAchivements extends MovieClip
   {
      
      public var achievementText:TextField;
      
      public function ContentScreenAchivements()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.achievementText.text = FogTrans.translate("achievements");
      }
   }
}

