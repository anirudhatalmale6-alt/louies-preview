/* Small and deliberate: a menu toggle and a scrollspy. Nothing else runs. */
( function () {
	'use strict';

	var toggle = document.querySelector( '.nav-toggle' );
	var nav    = document.getElementById( 'site-nav' );

	if ( toggle && nav ) {
		toggle.addEventListener( 'click', function () {
			var open = toggle.getAttribute( 'aria-expanded' ) === 'true';
			toggle.setAttribute( 'aria-expanded', String( ! open ) );
			nav.classList.toggle( 'is-open', ! open );
		} );

		// Tapping a link on a phone should close the menu behind it.
		nav.addEventListener( 'click', function ( e ) {
			if ( e.target.closest( 'a' ) && window.matchMedia( '(max-width: 899px)' ).matches ) {
				toggle.setAttribute( 'aria-expanded', 'false' );
				nav.classList.remove( 'is-open' );
			}
		} );
	}

	// Highlight the menu section you are actually looking at.
	var chips = document.querySelectorAll( '.menu-nav a' );
	if ( chips.length && 'IntersectionObserver' in window ) {
		var observer = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( ! entry.isIntersecting ) { return; }
				chips.forEach( function ( chip ) {
					var active = chip.getAttribute( 'href' ) === '#' + entry.target.id;
					chip.style.color       = active ? 'var(--bone)' : '';
					chip.style.borderColor = active ? 'var(--neon)' : '';
				} );
			} );
		}, { rootMargin: '-140px 0px -70% 0px' } );

		document.querySelectorAll( '.menu-section' ).forEach( function ( s ) {
			observer.observe( s );
		} );
	}
} )();
