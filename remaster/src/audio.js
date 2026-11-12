// Original exported MP3s supply all music/effects except the new rotor loop.
export class AudioManager {
  constructor(settings) {
    this.settings={...settings};this.context=null;this.scene='menu';this.voices=0;
    this.buffers=new Map();this.variants=new Map();this.loadErrors=[];
  }
  async unlock() {
    const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
    if(!this.context){
      const c=this.context=new AudioContext();this.master=c.createGain();this.music=c.createGain();this.effects=c.createGain();
      const limiter=c.createDynamicsCompressor();limiter.threshold.value=-14;limiter.knee.value=18;limiter.ratio.value=5;limiter.attack.value=.003;limiter.release.value=.15;
      this.music.connect(this.master);this.effects.connect(this.master);this.master.connect(limiter);limiter.connect(c.destination);
      this.helicopter();this.apply(this.settings);
      this.loading=this.loadOriginals().then(()=>this.setScene(this.scene,true));
    }
    if(this.context.state==='suspended')await this.context.resume();
    await this.loading;
  }
  async loadOriginals() {
    const root=new URL('../assets/audio/',import.meta.url);
    try{
      const response=await fetch(new URL('manifest.json',root));if(!response.ok)throw Error('Audio manifest unavailable');
      const manifest=await response.json();
      await Promise.all(Object.entries(manifest).map(async([key,file])=>{
        try{const response=await fetch(new URL(file,root));if(!response.ok)throw Error(String(response.status));
          this.buffers.set(key,await this.context.decodeAudioData(await response.arrayBuffer()));
        }catch(error){this.loadErrors.push(key+': '+error.message);}
      }));
    }catch(error){this.loadErrors.push(error.message);}
    if(this.loadErrors.length)console.warn('Original audio load errors',this.loadErrors);
  }
  apply(settings) {
    this.settings={...settings};if(!this.context)return;
    for(const key of ['master','music','effects']){
      const gain=this[key].gain,now=this.context.currentTime;
      if(key==='master'&&settings.muted){gain.cancelScheduledValues(now);gain.setValueAtTime(0,now);}
      else gain.setTargetAtTime(settings[key]/100,now,.025);
    }
  }
  helicopter() {
    const c=this.context,noise=c.createBuffer(1,c.sampleRate*2,c.sampleRate),data=noise.getChannelData(0);let seed=371;
    for(let i=0;i<data.length;i++){seed=seed*16807%2147483647;data[i]=seed/1073741824-1;}
    const rotor=c.createBufferSource(),filter=c.createBiquadFilter(),pulse=c.createOscillator(),depth=c.createGain(),gain=c.createGain();
    rotor.buffer=noise;rotor.loop=true;filter.type='bandpass';filter.frequency.value=240;filter.Q.value=.6;gain.gain.value=.009;
    pulse.type='sine';pulse.frequency.value=22;depth.gain.value=.006;pulse.connect(depth);depth.connect(gain.gain);
    this.rotorLevel=c.createGain();this.rotorLevel.gain.value=0;rotor.connect(filter);filter.connect(gain);gain.connect(this.rotorLevel);this.rotorLevel.connect(this.effects);rotor.start();pulse.start();
  }
  setScene(scene,force=false) {
    if(this.scene===scene&&!force)return;this.scene=scene;if(!this.context)return;
    this.rotorLevel.gain.setTargetAtTime(scene==='combat'?1:scene==='preparation'?.35:0,this.context.currentTime,.15);
    const track=['menu','confirm','loading'].includes(scene)?'menuMusic':['combat','preparation'].includes(scene)?'fonMusic':this.trackKey||'menuMusic';
    this.playMusic(track);
  }
  playMusic(key) {
    if(this.trackKey===key&&this.track)return;
    const buffer=this.buffers.get(key);if(!buffer)return;
    const c=this.context,now=c.currentTime,source=c.createBufferSource(),gain=c.createGain();
    source.buffer=buffer;source.loop=true;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.55,now+.2);
    source.connect(gain);gain.connect(this.music);source.start();
    if(this.track){const old=this.track;old.gain.gain.cancelScheduledValues(now);old.gain.gain.setValueAtTime(old.gain.gain.value,now);old.gain.gain.linearRampToValueAtTime(0,now+.2);old.source.stop(now+.21);}
    source.onended=()=>{source.disconnect();gain.disconnect();};this.track={source,gain};this.trackKey=key;
  }
  sample(keys,volume=.35) {
    if(!this.context||this.context.state!=='running'||this.voices>=24)return;
    keys=Array.isArray(keys)?keys:[keys];const id=keys.join(','),index=this.variants.get(id)||0;
    const buffer=this.buffers.get(keys[index%keys.length]);if(!buffer)return;this.variants.set(id,index+1);
    const source=this.context.createBufferSource(),gain=this.context.createGain();this.voices++;
    source.buffer=buffer;gain.gain.value=volume;source.connect(gain);gain.connect(this.effects);
    source.onended=()=>{this.voices--;source.disconnect();gain.disconnect();};source.start();
  }
  // No dedicated original UI click exists; reuse the original ricochet quietly.
  click() {this.sample('sndRik1',.07);}
  combatEvent(type,detail={}) {
    if(type==='shot')return this.sample({Cannon:'sndCann1',MashineGun:'sndMax2',Bazooka:'sndRmet',Rocket:'sndRoket'}[detail.weapon]||'sndCann1',.42);
    if(type==='explosion')return this.sample(detail.sound==='Atom'?'sndNuc':detail.sound==='Avia'?['sndSvistBomb1','sndSvistBomb2']:detail.sound==='Mine'?'sndImpMet3':['sndExp1','sndExp2','sndExp3'],detail.sound==='Atom'?.45:.38);
    if(type==='defense-shot')return this.sample({Maxim:['sndMax','sndMax2'],Mortar:'sndMinomet',CannonSmall:'sndCann1',CannonNormal:'sndCann2',CannonBig:'sndCann3'}[detail.weapon]||'sndCann2',.3);
    if(type==='enemy-shot')return this.sample(detail.weapon==='SoldatBazooka'?'sndMinomet':detail.weapon?.startsWith('Tank')?['sndCann1','sndCann2','sndCann3']:detail.vehicle?['sndGun1','sndGun2','sndGun3']:['sndAvt1','sndAvt2','sndAvt3'],.18);
    if(type==='enemy-hit'){
      if(!this.context||this.context.currentTime-(this.lastImpact??-1)<.035)return;this.lastImpact=this.context.currentTime;
      this.sample(detail.vehicle?['sndImpMet1','sndImpMet2','sndImpMet3']:['sndImpMurd1','sndImpMurd2'],.3);
      if(detail.destroyed)this.sample(detail.vehicle?'sndExp3':['sndVopl1','sndVopl2','sndVopl3'],.24);return;
    }
    if(type==='base-hit'||type==='defense-hit')return this.sample(['sndImpMet1','sndImpMet2'],.28);
    if(type==='reload-start')return this.sample('sndVistrelPreload',.24);
    if(type==='reload-complete')return this.sample('sndImpMet3',.16);
    if(['achievement','victory','defeat'].includes(type))return this.sample('sndGong',type==='achievement'?.18:.32);
  }
}
