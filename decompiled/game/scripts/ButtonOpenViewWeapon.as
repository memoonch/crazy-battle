package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol1379")]
   public dynamic class ButtonOpenViewWeapon extends MovieClip
   {
      
      public function ButtonOpenViewWeapon()
      {
         super();
         addFrameScript(0,this.frame1);
      }
      
      internal function frame1() : *
      {
         stop();
      }
   }
}

