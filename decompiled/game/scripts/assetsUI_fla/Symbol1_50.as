package assetsUI_fla
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol824")]
   public dynamic class Symbol1_50 extends MovieClip
   {
      
      public var startText:TextField;
      
      public function Symbol1_50()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         stop();
         this.startText.text = FogTrans.translate("click_start");
      }
   }
}

