package assetsUI_fla
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol652")]
   public dynamic class Symbol2_20 extends MovieClip
   {
      
      public var bombingText:TextField;
      
      public function Symbol2_20()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.bombingText.text = FogTrans.translate("bombing");
      }
   }
}

