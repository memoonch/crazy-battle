package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol647")]
   public dynamic class ContentScreenUIGame extends MovieClip
   {
      
      public var levelText:TextField;
      
      public var ptsText:TextField;
      
      public function ContentScreenUIGame()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.levelText.text = FogTrans.translate("level");
         this.ptsText.text = FogTrans.translate("pts");
      }
   }
}

