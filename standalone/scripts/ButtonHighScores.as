package
{
   import view.components.ButtonDefault;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol241")]
   public dynamic class ButtonHighScores extends ButtonDefault
   {
      
      public function ButtonHighScores()
      {
         super();
         this.visible = false;
         this.mouseEnabled = false;
      }
   }
}

