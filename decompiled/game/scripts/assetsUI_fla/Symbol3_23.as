package assetsUI_fla
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol657")]
   public dynamic class Symbol3_23 extends MovieClip
   {
      
      public var arsenalText:TextField;
      
      public function Symbol3_23()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.arsenalText.text = FogTrans.translate("arsenal");
      }
   }
}

