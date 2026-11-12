package menu.screens
{
   import Playtomic.*;
   import flash.display.Sprite;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   import flash.text.TextFieldType;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import flash.utils.getQualifiedClassName;
   import game.objects.InfoObject;
   
   public class ScreenHighScores extends Sprite
   {
      
      private var _content:ContentScreenHighScores = new ContentScreenHighScores();
      
      private var _infoObject:InfoObject;
      
      private var _textSprite:Sprite = new Sprite();
      
      private var _tfNameInput:TextField = new TextField();
      
      private var _textFormatScores:TextFormat = new TextFormat("Arial",12,15462589,null,null,null,null,null,TextFormatAlign.CENTER);
      
      public function ScreenHighScores(infoObject:InfoObject)
      {
         super();
         this._infoObject = infoObject;
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._content);
         addChild(this._tfNameInput);
         this._tfNameInput.type = TextFieldType.INPUT;
         this._tfNameInput.defaultTextFormat = this._textFormatScores;
         this._tfNameInput.width = 180;
         this._tfNameInput.height = 24;
         this._tfNameInput.x = 260;
         this._tfNameInput.y = 100;
         this._tfNameInput.text = "Enter your name";
         this._textSprite.x = 5;
         this._textSprite.y = 100;
         addChild(this._textSprite);
         addEventListener(MouseEvent.CLICK,this.clickHandler);
      }
      
      private function clickHandler(event:MouseEvent) : void
      {
         switch(getQualifiedClassName(event.target))
         {
            case "ButtonDay":
               Leaderboards.List("highscores",this.showHighscores,{"mode":"today"});
               break;
            case "ButtonWeek":
               Leaderboards.List("highscores",this.showHighscores,{"mode":"last7days"});
               break;
            case "ButtonMonth":
               Leaderboards.List("highscores",this.showHighscores,{"mode":"last30days"});
               break;
            case "ButtonAll":
               Leaderboards.List("highscores",this.showHighscores,{"mode":"alltime"});
               break;
            case "ButtonSubmit":
               this.submitScores();
         }
      }
      
      public function showHighscores(scores:Array, numscores:int, response:Object) : void
      {
         var limit:int = 0;
         var i:int = 0;
         var score:PlayerScore = null;
         var tfRank:TextField = null;
         var tfName:TextField = null;
         var tfScores:TextField = null;
         while(this._textSprite.numChildren > 0)
         {
            this._textSprite.removeChildAt(0);
         }
         if(Boolean(response.Success))
         {
            trace(scores.length + " scores returned out of " + numscores);
            limit = 7;
            if(scores.length < limit)
            {
               limit = int(scores.length);
            }
            for(i = 0; i < limit; i++)
            {
               score = scores[i];
               tfRank = new TextField();
               tfRank.defaultTextFormat = this._textFormatScores;
               tfRank.width = 38;
               tfRank.height = 24;
               tfRank.x = 192;
               tfRank.y = 124 + 26 * i;
               tfRank.text = String(i + 1);
               this._textSprite.addChild(tfRank);
               tfName = new TextField();
               tfName.defaultTextFormat = this._textFormatScores;
               tfName.width = 150;
               tfName.height = 24;
               tfName.x = 229;
               tfName.y = 124 + 26 * i;
               tfName.text = score.Name;
               this._textSprite.addChild(tfName);
               tfScores = new TextField();
               tfScores.defaultTextFormat = this._textFormatScores;
               tfScores.width = 70;
               tfScores.height = 24;
               tfScores.x = 368;
               tfScores.y = 124 + 26 * i;
               tfScores.text = String(score.Points);
               this._textSprite.addChild(tfScores);
               trace(" - " + score.Name + " got " + score.Points + " on " + score.SDate);
            }
         }
      }
      
      public function submitScores() : void
      {
         var player_name:String = null;
         var player_score:Number = NaN;
         var simple_score:PlayerScore = null;
         if(this._tfNameInput.text != "Enter your name" && this._tfNameInput.text != "" && Boolean(this._infoObject.scores))
         {
            player_name = this._tfNameInput.text;
            player_score = this._infoObject.scores;
            simple_score = new PlayerScore();
            simple_score.Name = player_name;
            simple_score.Points = player_score;
            Leaderboards.Save(simple_score,"highscores",this.submitComplete);
         }
      }
      
      public function submitComplete(score:PlayerScore, response:Object) : void
      {
         if(Boolean(response.Success))
         {
            Leaderboards.List("highscores",this.showHighscores,{"mode":"today"});
         }
      }
   }
}

