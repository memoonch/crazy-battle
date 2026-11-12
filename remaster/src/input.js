export class PointerInput {
  constructor(canvas, viewport, enabled) {
    this.canvas = canvas; this.viewport = viewport; this.enabled = enabled;
    this.state = { x: 560, y: 300, inside: false, battlefield: false, pressed: false };
    this.shots = [];
    canvas.addEventListener('pointermove', e => this.move(e));
    canvas.addEventListener('pointerdown', e => {
      this.move(e);
      if (!this.enabled() || !this.state.battlefield || e.button !== 0) return;
      this.state.pressed = true;
      this.shots.push({ x: this.state.x, y: this.state.y });
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointerup', e => { this.release(); if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); });
    canvas.addEventListener('pointercancel', () => this.clear());
    canvas.addEventListener('lostpointercapture', () => this.release());
    canvas.addEventListener('pointerleave', () => { if (!this.state.pressed) this.state.inside = false; });
    window.addEventListener('pointerup', () => this.release());
    window.addEventListener('blur', () => this.clear());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.clear(); });
  }
  move(event) {
    Object.assign(this.state, this.viewport.point(event));
    this.canvas.style.cursor = this.enabled() && this.state.battlefield ? 'none' : '';
    document.querySelector('#pointer-info').textContent = `${this.state.x.toFixed(1)}, ${this.state.y.toFixed(1)} · ${this.state.battlefield ? 'battlefield' : 'outside battlefield'}`;
  }
  drainShots() { return this.shots.splice(0); }
  release() { this.state.pressed = false; }
  clear() { this.release(); this.shots.length = 0; this.canvas.style.cursor = ''; }
}
