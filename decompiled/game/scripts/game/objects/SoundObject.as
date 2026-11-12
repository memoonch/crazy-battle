package game.objects
{
   import flash.events.Event;
   import flash.events.EventDispatcher;
   import flash.media.Sound;
   import flash.media.SoundChannel;
   import flash.media.SoundMixer;
   import flash.media.SoundTransform;
   
   public class SoundObject extends EventDispatcher
   {
      
      public static const SOUND_CHANGE:String = "soundChange";
      
      private var _cannel:SoundChannel;
      
      private var _musicMenu:Sound = new menuMusic();
      
      private var _musicGame:Sound = new fonMusic();
      
      private var _soundOn:Boolean;
      
      public function SoundObject()
      {
         super();
         this.init();
      }
      
      public function get soundOn() : Boolean
      {
         return this._soundOn;
      }
      
      public function set soundOn(value:Boolean) : void
      {
         this._soundOn = value;
         if(this._soundOn)
         {
            SoundMixer.soundTransform = new SoundTransform(0);
         }
         else
         {
            SoundMixer.soundTransform = new SoundTransform(1);
         }
         dispatchEvent(new Event(SoundObject.SOUND_CHANGE));
      }
      
      private function init() : void
      {
         this.soundOn = false;
      }
      
      public function onMusicMenu() : void
      {
         if(Boolean(this._cannel))
         {
            this._cannel.stop();
         }
         this._cannel = this._musicMenu.play(0,1000000);
      }
      
      public function onMusicGame() : void
      {
         if(Boolean(this._cannel))
         {
            this._cannel.stop();
         }
         this._cannel = this._musicGame.play(0,1000000);
      }
   }
}

