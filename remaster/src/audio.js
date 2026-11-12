// Procedural sound design: no external audio service, downloads or Flash assets.
export class AudioManager {
  constructor(settings) { this.settings=settings;this.context=null;this.scene='menu';this.voices=0; }
  async unlock() {
    const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
    if(!this.context){
      const c=this.context=new AudioContext();this.master=c.createGain();this.music=c.createGain();this.effects=c.createGain();
      const limiter=c.createDynamicsCompressor();limiter.threshold.value=-14;limiter.knee.value=18;limiter.ratio.value=5;limiter.attack.value=.003;limiter.release.value=.15;
      this.music.connect(this.master);this.effects.connect(this.master);this.master.connect(limiter);limiter.connect(c.destination);
      this.noise=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const data=this.noise.getChannelData(0);let seed=371;
      for(let i=0;i<data.length;i++){seed=seed*16807%2147483647;data[i]=seed/1073741824-1;}
      this.ambience();this.apply(this.settings);this.setScene(this.scene,true);
    }
    if(this.context.state==='suspended')await this.context.resume();
  }
  apply(settings) {
    this.settings={...settings};if(!this.context)return;
    for(const key of ['master','music','effects']){
      const gain=this[key].gain,now=this.context.currentTime;
      if(key==='master'&&settings.muted){gain.cancelScheduledValues(now);gain.setValueAtTime(0,now);}
      else gain.setTargetAtTime(settings[key]/100,now,.025);
    }
  }
  ambience() {
    const c=this.context,wind=c.createBufferSource(),filter=c.createBiquadFilter();wind.buffer=this.noise;wind.loop=true;filter.type='lowpass';filter.frequency.value=430;
    this.ambientGain=c.createGain();this.ambientGain.gain.value=.018;wind.connect(filter);filter.connect(this.ambientGain);this.ambientGain.connect(this.music);wind.start();
    for(const hz of [110,164.81]){const tone=c.createOscillator(),gain=c.createGain();tone.type='sine';tone.frequency.value=hz;gain.gain.value=.003;tone.connect(gain);gain.connect(this.music);tone.start();}
    const rotor=c.createBufferSource(),rotorFilter=c.createBiquadFilter(),pulse=c.createOscillator(),pulseDepth=c.createGain(),rotorGain=c.createGain();
    rotor.buffer=this.noise;rotor.loop=true;rotorFilter.type='bandpass';rotorFilter.frequency.value=240;rotorFilter.Q.value=.6;rotorGain.gain.value=.009;
    pulse.type='sine';pulse.frequency.value=22;pulseDepth.gain.value=.006;pulse.connect(pulseDepth);pulseDepth.connect(rotorGain.gain);
    this.rotorLevel=c.createGain();this.rotorLevel.gain.value=0;rotor.connect(rotorFilter);rotorFilter.connect(rotorGain);rotorGain.connect(this.rotorLevel);this.rotorLevel.connect(this.effects);rotor.start();pulse.start();
  }
  setScene(scene,force=false) {
    if(this.scene===scene&&!force)return;this.scene=scene;if(!this.context)return;
    this.rotorLevel.gain.setTargetAtTime(scene==='combat'?1:scene==='preparation'?.35:0,this.context.currentTime,.15);
    this.ambientGain.gain.setTargetAtTime(scene==='combat'?.012:.018,this.context.currentTime,.2);
  }
  tone(start,end,duration,volume,type='sine',delay=0) {
    if(!this.context||this.context.state!=='running'||this.voices>=24)return;
    const c=this.context,now=c.currentTime+delay,source=c.createOscillator(),gain=c.createGain();this.voices++;
    source.type=type;source.frequency.setValueAtTime(start,now);source.frequency.exponentialRampToValueAtTime(end,now+duration);
    gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);source.connect(gain);gain.connect(this.effects);source.start(now);source.stop(now+duration+.01);
    source.onended=()=>{this.voices--;source.disconnect();gain.disconnect();};
  }
  burst(frequency,duration,volume) {
    if(!this.context||this.context.state!=='running'||this.voices>=24)return;
    const c=this.context,now=c.currentTime,source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();this.voices++;
    source.buffer=this.noise;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.7;gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    source.connect(filter);filter.connect(gain);gain.connect(this.effects);source.start(now,.3);source.stop(now+duration+.01);
    source.onended=()=>{this.voices--;source.disconnect();filter.disconnect();gain.disconnect();};
  }
  click() { this.tone(760,420,.035,.025); }
  combatEvent(type) {
    if(type==='achievement'){this.tone(660,660,.18,.04,'sine');this.tone(990,990,.24,.035,'sine',.12);return;}
    if(type==='explosion'){this.burst(180,.35,.2);this.tone(85,28,.3,.16,'triangle');return;}
    if(type==='shot'){this.burst(1900,.09,.19);this.tone(150,48,.085,.12,'triangle');this.tone(2600,900,.025,.025);}
    if(type==='defense-shot'){this.burst(2200,.065,.10);this.tone(125,62,.065,.055,'triangle');}
    if(type==='base-hit'||type==='defense-hit'){this.burst(700,.13,.07);this.tone(95,38,.13,.055,'triangle');}
    if(type==='reload-start'){this.burst(2600,.07,.035);this.tone(850,360,.06,.025);}
    if(type==='reload-complete'){this.burst(3200,.035,.035);this.tone(1300,700,.035,.035);}
    if(type==='victory')for(const [i,hz]of[523.25,659.25,783.99].entries())this.tone(hz,hz,.24,.055,'sine',i*.10);
    if(type==='defeat')for(const [i,hz]of[220,174.61,130.81].entries())this.tone(hz,hz*.97,.3,.045,'triangle',i*.12);
  }
}
