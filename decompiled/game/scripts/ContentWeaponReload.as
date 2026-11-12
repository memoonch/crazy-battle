package
{
   import flash.display.MovieClip;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol595")]
   public dynamic class ContentWeaponReload extends MovieClip
   {
      
      public var reloadText:TextField;
      
      public function ContentWeaponReload()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         this.reloadText.text = FogTrans.translate("reload");
      }
   }
}

