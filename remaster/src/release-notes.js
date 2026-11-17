// Initial build: keep v1.0 until launch; update these four player-facing highlights.
export const RELEASES=Object.freeze([
  {
    version:'1.0',
    title:'The last stand begins',
    changes:[
      'Story, animated commander guidance and free repair training.',
      'Live defenses, helicopter weapons and support.',
      'Improved battles, supply drops and 12 medals.',
      'New logo, preloader and responsive button effects.'
    ]
  }
]);
export const GAME_VERSION=RELEASES[0].version;
export function releaseNotes(){
  const release=RELEASES[0];
  return `<section class="release-popover" id="release-popover" role="region" aria-label="What's new"><header><strong>What's new <span>v${release.version}</span></strong><button data-action="close-releases" aria-label="Close release notes">×</button></header><ul>${release.changes.slice(0,4).map(change=>`<li>${change}</li>`).join('')}</ul></section>`;
}
