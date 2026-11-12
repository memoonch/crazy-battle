// Audited centers and inner-hub bounds; outer tires and tread stay untouched.
export const VEHICLE_WHEELS={
 BTRLite:[[340,250,13,21,54],[420,247,13,21,51],[510,240,12,20,49],[585,233,12,19,47]],
 BTR:[[1063,254,14,22,61],[1150,250,14,22,58],[1285,247,13,21,55],[1368,238,12,20,54]],
 TankLite:[[441,593,10,17,32],[490,592,10,17,32],[538,589,10,17,32],[584,585,10,17,31],[627,580,9,15,29]],
 Tank:[[1192,592,9,14,32],[1244,591,9,14,32],[1290,589,9,14,31],[1335,588,9,14,30],[1377,585,9,14,29],[1419,580,8,13,27]],
 RocketLite:[[350,970,11,17,27],[407,970,11,17,27],[455,968,10,17,27],[502,965,10,17,26],[546,961,9,15,25]],
 RocketBig:[[1080,966,10,16,32],[1132,965,10,16,32],[1183,965,10,16,31],[1232,962,10,16,30],[1280,960,10,16,29],[1327,959,10,16,28],[1370,956,9,15,27]]
};
export function vehicleMotion(enemy,dead,reducedMotion) {
 const moving=enemy.state==='move'&&!dead&&!reducedMotion;
 const distance=(680-enemy.x)*815/540,tracked=!enemy.name.startsWith('BTR');
 return {moving,tracked,distance,
  // Tyres stay planted; do not bounce the entire painted vehicle off the ground.
  bob:0,
  roll:!dead&&!reducedMotion?-distance:0};
}
export function wheelAngle(distance,outerRadius,scale){return -distance/(outerRadius*scale);}
