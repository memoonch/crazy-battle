package
{
   import flash.display.MovieClip;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol239")]
   public dynamic class ButtonNewGame extends MovieClip
   {
      
      public var newGameText:TextField;
      
      public function ButtonNewGame()
      {
         super();
         addFrameScript(0,this.frame1,1,this.frame2);
      }
      
      public function mouseOn(e:Event) : void
      {
         removeEventListener(MouseEvent.MOUSE_OVER,this.mouseOn);
         gotoAndStop(2);
      }
      
      public function mouseOff(e:Event) : void
      {
         removeEventListener(MouseEvent.MOUSE_OUT,this.mouseOff);
         gotoAndStop(1);
      }
      
      internal function frame1() : *
      {
         stop();
         this.newGameText.text = FogTrans.translate("new_game");
         buttonMode = true;
         useHandCursor = true;
         mouseChildren = false;
         addEventListener(MouseEvent.MOUSE_OVER,this.mouseOn);
      }
      
      internal function frame2() : *
      {
         stop();
         this.newGameText.text = FogTrans.translate("new_game");
         addEventListener(MouseEvent.MOUSE_OUT,this.mouseOff);
      }
   }
}

