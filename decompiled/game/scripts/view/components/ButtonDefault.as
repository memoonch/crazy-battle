package view.components
{
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import flash.events.MouseEvent;
   
   public class ButtonDefault extends MovieClip
   {
      
      private var _mc:MovieClip;
      
      public function ButtonDefault()
      {
         var child:DisplayObject = null;
         super();
         stop();
         buttonMode = true;
         useHandCursor = true;
         mouseChildren = false;
         addEventListener(MouseEvent.MOUSE_OVER,this.mouseOverHandler);
         addEventListener(MouseEvent.MOUSE_OUT,this.mouseOutHandler);
         for(var i:int = 0; i < numChildren; i++)
         {
            child = getChildAt(i);
            trace("debug:" + this.name + "/" + child.name);
            if(child is MovieClip)
            {
               this._mc = child as MovieClip;
            }
         }
      }
      
      private function mouseOverHandler(event:MouseEvent) : void
      {
         trace("na:" + this._mc.numChildren);
         if(this._mc.numChildren != 4)
         {
            if(Boolean(this._mc))
            {
               this._mc.gotoAndStop(2);
            }
         }
      }
      
      private function mouseOutHandler(event:MouseEvent) : void
      {
         if(this._mc.numChildren != 4)
         {
            if(Boolean(this._mc))
            {
               this._mc.gotoAndStop(1);
            }
         }
      }
   }
}

