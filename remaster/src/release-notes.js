// Newest release first. Menu version and release history share this source.
export const RELEASES=Object.freeze([
  {
    version:'1.0',
    title:'The last stand begins',
    changes:[
      'Campaign story and free guided tutorial.',
      'Live defenses, weapons and support.',
      'Improved battles and 12 illustrated medals.',
      'New logo and animated loading screen.'
    ]
  }
]);
export const GAME_VERSION=RELEASES[0].version;
export function releaseNotes(){
  const release=RELEASES[0];
  return `<section class="release-popover" id="release-popover" role="region" aria-label="What's new"><header><strong>What's new <span>v${release.version}</span></strong><button data-action="close-releases" aria-label="Close release notes">×</button></header><ul>${release.changes.slice(0,4).map(change=>`<li>${change}</li>`).join('')}</ul></section>`;
}
