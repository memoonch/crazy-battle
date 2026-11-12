package assetsUI_fla
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol833")]
   public dynamic class weapon_btn_52 extends MovieClip
   {
      
      public var start1Text:TextField;
      
      public var start2Text:TextField;
      
      public function weapon_btn_52()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.start1Text.text = FogTrans.translate("start_1");
         this.start2Text.text = FogTrans.translate("start_2");
      }
   }
}

