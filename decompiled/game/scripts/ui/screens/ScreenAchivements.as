package ui.screens
{
   import flash.display.Sprite;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   import flash.text.TextFormat;
   import flash.text.TextFormatAlign;
   import game.objects.AchivementsObject;
   
   public class ScreenAchivements extends Sprite
   {
      
      private var _contentAchivementBronze:ContentAchivementBronze = new ContentAchivementBronze();
      
      private var _contentAchivementCombo2:ContentAchivementCombo2 = new ContentAchivementCombo2();
      
      private var _contentAchivementCombo5:ContentAchivementCombo5 = new ContentAchivementCombo5();
      
      private var _contentAchivementDefender:ContentAchivementDefender = new ContentAchivementDefender();
      
      private var _contentAchivementGold:ContentAchivementGold = new ContentAchivementGold();
      
      private var _contentAchivementSilver:ContentAchivementSilver = new ContentAchivementSilver();
      
      private var _contentScreen:ContentScreenAchivements = new ContentScreenAchivements();
      
      private var _spriteAchivements:Sprite = new Sprite();
      
      private var _textField:TextField = new TextField();
      
      private var _textFormat:TextFormat = new TextFormat("Arial",14,15462589,true,null,null,null,null,TextFormatAlign.CENTER);
      
      public function ScreenAchivements()
      {
         super();
         this.init();
      }
      
      private function init() : void
      {
         addChild(this._contentScreen);
         addChild(this._spriteAchivements);
         this._contentAchivementCombo2.mouseChildren = false;
         this._contentAchivementCombo2.x = 195;
         this._contentAchivementCombo2.y = 200;
         this._contentAchivementCombo5.mouseChildren = false;
         this._contentAchivementCombo5.x = this._contentAchivementCombo2.x + this._contentAchivementCombo2.width + 27;
         this._contentAchivementCombo5.y = this._contentAchivementCombo2.y;
         this._contentAchivementDefender.mouseChildren = false;
         this._contentAchivementDefender.x = this._contentAchivementCombo5.x + this._contentAchivementCombo5.width + 27;
         this._contentAchivementDefender.y = this._contentAchivementCombo2.y;
         this._contentAchivementBronze.mouseChildren = false;
         this._contentAchivementBronze.x = this._contentAchivementCombo2.x;
         this._contentAchivementBronze.y = this._contentAchivementCombo2.y + this._contentAchivementCombo2.height + 34;
         this._contentAchivementSilver.mouseChildren = false;
         this._contentAchivementSilver.x = this._contentAchivementBronze.x + this._contentAchivementBronze.width + 45;
         this._contentAchivementSilver.y = this._contentAchivementBronze.y;
         this._contentAchivementGold.mouseChildren = false;
         this._contentAchivementGold.x = this._contentAchivementSilver.x + this._contentAchivementSilver.width + 45;
         this._contentAchivementGold.y = this._contentAchivementBronze.y;
         this._textField.x = 161;
         this._textField.y = 359;
         this._textField.width = 310;
         this._textField.height = 40;
         this._textField.selectable = false;
         this._textField.defaultTextFormat = this._textFormat;
         this._textField.text = "0";
         addChild(this._textField);
         addEventListener(MouseEvent.MOUSE_OVER,this.rollOverHandler);
      }
      
      public function addAchivement(achivementName:String) : void
      {
         switch(achivementName)
         {
            case AchivementsObject.ACHIVEMENTS_BRONZE:
               this._spriteAchivements.addChild(this._contentAchivementBronze);
               break;
            case AchivementsObject.ACHIVEMENTS_COMBO2:
               this._spriteAchivements.addChild(this._contentAchivementCombo2);
               break;
            case AchivementsObject.ACHIVEMENTS_COMBO5:
               this._spriteAchivements.addChild(this._contentAchivementCombo5);
               break;
            case AchivementsObject.ACHIVEMENTS_DEFENDER:
               this._spriteAchivements.addChild(this._contentAchivementDefender);
               break;
            case AchivementsObject.ACHIVEMENTS_GOLD:
               this._spriteAchivements.addChild(this._contentAchivementGold);
               break;
            case AchivementsObject.ACHIVEMENTS_SILVER:
               this._spriteAchivements.addChild(this._contentAchivementSilver);
         }
      }
      
      public function refreshScreen(array:Array) : void
      {
         var item:String = null;
         while(Boolean(this._spriteAchivements.numChildren))
         {
            this._spriteAchivements.removeChildAt(0);
         }
         for(var i:int = 0; i < array.length; i++)
         {
            item = array[i];
            switch(item)
            {
               case AchivementsObject.ACHIVEMENTS_BRONZE:
                  this._spriteAchivements.addChild(this._contentAchivementBronze);
                  break;
               case AchivementsObject.ACHIVEMENTS_COMBO2:
                  this._spriteAchivements.addChild(this._contentAchivementCombo2);
                  break;
               case AchivementsObject.ACHIVEMENTS_COMBO5:
                  this._spriteAchivements.addChild(this._contentAchivementCombo5);
                  break;
               case AchivementsObject.ACHIVEMENTS_DEFENDER:
                  this._spriteAchivements.addChild(this._contentAchivementDefender);
                  break;
               case AchivementsObject.ACHIVEMENTS_GOLD:
                  this._spriteAchivements.addChild(this._contentAchivementGold);
                  break;
               case AchivementsObject.ACHIVEMENTS_SILVER:
                  this._spriteAchivements.addChild(this._contentAchivementSilver);
            }
         }
      }
      
      private function rollOverHandler(event:MouseEvent) : void
      {
         if(event.target is ContentAchivementBronze)
         {
            this._textField.text = FogTrans.translate("lasted_5");
         }
         else if(event.target is ContentAchivementCombo2)
         {
            this._textField.text = FogTrans.translate("finished_2");
         }
         else if(event.target is ContentAchivementCombo5)
         {
            this._textField.text = FogTrans.translate("finished_5");
         }
         else if(event.target is ContentAchivementDefender)
         {
            this._textField.text = FogTrans.translate("defender");
         }
         else if(event.target is ContentAchivementGold)
         {
            this._textField.text = FogTrans.translate("lasted_20");
         }
         else if(event.target is ContentAchivementSilver)
         {
            this._textField.text = FogTrans.translate("lasted_10");
         }
         else
         {
            this._textField.text = "";
         }
      }
   }
}

