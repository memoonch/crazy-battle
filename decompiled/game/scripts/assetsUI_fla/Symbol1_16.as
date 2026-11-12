package assetsUI_fla
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1367")]
   public dynamic class Symbol1_16 extends MovieClip
   {
      
      public var chopperText:TextField;
      
      public function Symbol1_16()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.chopperText.text = FogTrans.translate("chopper");
      }
   }
}

