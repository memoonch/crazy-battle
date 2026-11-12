package
{
   import view.components.ButtonDefault;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol932")]
   public dynamic class ButtonSoundOffOn extends ButtonDefault
   {
      
      public function ButtonSoundOffOn()
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

