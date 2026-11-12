package
{
   import flash.display.Bitmap;
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import flash.utils.getDefinitionByName;
   
   [SWF(width="640", height="530", backgroundColor="#ffffff", frameRate="30")]
   public class Preloader extends MovieClip
   {
      
      private static const background:Class = Preloader_background;
      
      private var FogAPI:fog = new fog();
      
      private var bg:MovieClip = new MovieClip();
      
      public function Preloader()
      {
         super();
         this.bg.addChild(new background() as Bitmap);
         this.FogAPI.setPreloaderBackground(this.bg);
         this.FogAPI.setGameName("crazy-battle");
         this.FogAPI.setCoinGame = true;
         this.FogAPI.preloaderStart("4df72d17beedd",this,true,"shooting",this.startup);
      }
      
      private function startup() : void
      {
         var mainClass:Class = getDefinitionByName("MainGame") as Class;
         addChild(new mainClass(this.FogAPI) as DisplayObject);
      }
   }
}

