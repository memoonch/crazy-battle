package
{
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import flash.display.StageAlign;
   import flash.display.StageScaleMode;
   import flash.text.Font;
   import flash.ui.ContextMenu;
   import flash.utils.getDefinitionByName;
   
   public dynamic class Preloader extends MovieClip
   {
      
      public static var main:Object;
      
      public static var fontCooper:Font = new Cooper_std();
      
      public static var FogAPI:fog = new fog();
      
      private var _backgroundPreloader:MovieClip = new PreloaderBackground();
      
      public function Preloader()
      {
         super();
         this.init();
      }
      
      private function init() : void
      {
         if(Boolean(stage))
         {
            stage.scaleMode = StageScaleMode.NO_SCALE;
            stage.align = StageAlign.TOP_LEFT;
         }
         contextMenu = new ContextMenu();
         contextMenu.hideBuiltInItems();
      }
      
      private function startup() : void
      {
         gotoAndStop(2);
         var mainClass:Class = getDefinitionByName("Main") as Class;
         if(parent == stage)
         {
            stage.addChildAt(new mainClass() as DisplayObject,0);
         }
         else
         {
            addChildAt(new mainClass() as DisplayObject,0);
         }
      }
   }
}

