package game.objects
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.media.Sound;
   
   public class SFXObject extends Sprite
   {
      
      private var _content:MovieClip;
      
      private var _parentName:String;
      
      public function SFXObject(parentName:String)
      {
         super();
         this._parentName = parentName;
         this.init();
      }
      
      public function get content() : MovieClip
      {
         return this._content;
      }
      
      public function set content(value:MovieClip) : void
      {
         this._content = value;
      }
      
      private function init() : void
      {
         var snd:Sound = null;
         if(this._parentName == EnemyObject.NAME_ROCKET_BIG || this._parentName == EnemyObject.NAME_ROCKET_LITE)
         {
            this._content = new ContentLargeSFX();
            snd = new sndExp3();
         }
         else if(this._parentName == WeaponObject.NAME_CANNON || this._parentName == WeaponObject.NAME_MASHINEGUN)
         {
            this._content = new ContentBulletSFX();
            snd = new sndRik2();
         }
         else if(this._parentName == "Smoke")
         {
            this._content = new ContentSmokeSFX();
         }
         else
         {
            this._content = new ContentSmallSFX();
            this._content.scaleX = this._content.scaleY = 0.1;
            snd = new sndExp1();
         }
         if(Boolean(snd))
         {
            snd.play();
         }
         this.content.cacheAsBitmap = true;
         addChild(this._content);
      }
   }
}

