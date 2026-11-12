package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol945")]
   public dynamic class ContentScreenLevelVictory extends MovieClip
   {
      
      public var victoryText:TextField;
      
      public function ContentScreenLevelVictory()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.victoryText.text = FogTrans.translate("victory");
      }
   }
}

