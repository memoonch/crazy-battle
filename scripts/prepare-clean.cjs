const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const input = path.join(root,'decompiled/game/scripts');
const output = path.join(root,'standalone/scripts');
function edit(file, change) {
  const target=path.join(output,file); fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,change(fs.readFileSync(path.join(input,file),'utf8')));
}
edit('Main.as',s=>s.replace('super();','super();\n         if(stage) this.init();\n         else addEventListener(Event.ADDED_TO_STAGE,this.init);')
 .replace(/      public function loadAPI[\s\S]*?(?=      private function init)/,'')
 .replace('         Preloader.main.grabCurrency(InfoObject,"_amountMoney");',''));
edit('Preloader.as',s=>s.replace('      public static var main:Object;','').replace('      public static var FogAPI:fog = new fog();','')
 .replace('   import flash.display.DisplayObject;','   import flash.display.DisplayObject;\n   import flash.events.Event;')
 .replace('         this.init();','         this.init();\n         addEventListener(Event.ENTER_FRAME,this.ready);')
 .replace('      private function startup() : void',`      private function ready(e:Event) : void
      {
         if(!stage || framesLoaded < totalFrames) return;
         removeEventListener(Event.ENTER_FRAME,this.ready);
         this.startup();
      }
      private function startup() : void`));
edit('game/objects/InfoObject.as',s=>s.replace('SharedObject.getLocal("lso")','SharedObject.getLocal("crazy-battle-standalone-v1")')
 .replace('         this.parseEmbedResourse();','         this.parseEmbedResourse();\n         _amountMoney = this._lso.data.write ? int(this._lso.data.currentMoney) : 0;')
 .replace(/         if\(Preloader.FogAPI.isConnected\)[\s\S]*?\n         }/g,'')
 .replace(/^[^\n]*Preloader.FogAPI[^\n]*\n/gm,''));
edit('game/Game.as',s=>s.replace(/      private function spendFogCoins[\s\S]*?(?=      public function treatTurret)/,''));
edit('ui/views/ViewProcess.as',s=>s.replace(/^[^\n]*Preloader.main[^\n]*\n/gm,''));
edit('ui/UI.as',s=>s.replace(/^[^\n]*Preloader\.(main|FogAPI)[^\n]*\n/gm,''));
edit('menu/Menu.as',s=>s.replace(/^[^\n]*Preloader.FogAPI[^\n]*\n/gm,''));
// Hide obsolete portal/online controls wherever timeline art places them.
for (const file of ['ButtonAddGame.as','ButtonHighScores.as','ButtonSubmitScore.as','ButtonBuyCoins.as']) {
 edit(file,s=>s.replace('super();','super();\n         this.visible = false;\n         this.mouseEnabled = false;'));
}
// Remove the dormant remote API and leaderboard implementations as well.
edit('fog.as',()=> 'package { public class fog { public function fog() {} } }\n');
edit('menu/screens/ScreenHighScores.as',()=>`package menu.screens {
 import flash.display.Sprite;
 import game.objects.InfoObject;
 public class ScreenHighScores extends Sprite {
  public function ScreenHighScores(infoObject:InfoObject) { super(); }
 }
}\n`);
for(const name of ['Encode','Leaderboards','Log','LogRequest','PlayerScore']) {
 edit('Playtomic/'+name+'.as',()=>`package Playtomic { public class ${name} { public function ${name}() {} } }\n`);
}
console.log('Standalone patches prepared in standalone/scripts');
