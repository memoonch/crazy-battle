package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol265")]
   public dynamic class ContentScreenMainMenu extends MovieClip
   {
      
      public var titleText:TextField;
      
      public function ContentScreenMainMenu()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.titleText.text = FogTrans.translate("crazy_battle");
      }
   }
}

