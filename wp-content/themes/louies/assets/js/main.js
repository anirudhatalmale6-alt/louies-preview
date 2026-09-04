/* Small and deliberate: a menu toggle, a scrollspy, and the open/closed light. */
( function () {
	'use strict';

	/* ----------------------------------------------------------------------
	   Open / closed, and happy hour.

	   These have to be worked out in the browser, not on the server. PHP only
	   knows what time it was when the page was BUILT, and a built page gets
	   kept: hosts put a page cache in front of WordPress, CDNs hold copies,
	   the static preview is flat files. The bar spent an evening telling
	   people it was closed because a page generated at 3am was still being
	   served at 8pm.

	   Everything is pinned to the bar's own timezone, so it reads the same for
	   a customer down the road and one looking it up from another state.
	   ---------------------------------------------------------------------- */

	// Minutes past midnight, right now, in the bar's timezone.
	// Returns null if the browser can't do it, which means "leave the
	// server's answer alone" - a wrong correction is worse than no correction.
	function minutesNowIn( tz ) {
		try {
			var parts = new Intl.DateTimeFormat( 'en-GB', {
				timeZone: tz || undefined,
				hour12: false,
				hour: '2-digit',
				minute: '2-digit'
			} ).formatToParts( new Date() );

			var h = null, m = null;
			parts.forEach( function ( p ) {
				if ( 'hour' === p.type )   { h = parseInt( p.value, 10 ); }
				if ( 'minute' === p.type ) { m = parseInt( p.value, 10 ); }
			} );

			// Midnight comes back as "24" in some engines under hour12:false.
			if ( 24 === h ) { h = 0; }
			if ( null === h || null === m || isNaN( h ) || isNaN( m ) ) { return null; }
			return ( h * 60 ) + m;
		} catch ( e ) {
			return null;
		}
	}

	function toMinutes( hhmm ) {
		var bits = String( hhmm || '' ).split( ':' );
		if ( 2 !== bits.length ) { return null; }
		var h = parseInt( bits[0], 10 ), m = parseInt( bits[1], 10 );
		if ( isNaN( h ) || isNaN( m ) ) { return null; }
		return ( h * 60 ) + m;
	}

	// Closing at 2am means the window wraps past midnight, so "after opening
	// AND before closing" is wrong for exactly the hours the bar is busiest.
	function within( now, start, end ) {
		if ( end <= start ) { return now >= start || now < end; }
		return now >= start && now < end;
	}

	function refreshStatus() {
		var pill = document.querySelector( '[data-louies-status]' );
		if ( pill ) {
			var now   = minutesNowIn( pill.getAttribute( 'data-tz' ) );
			var open  = toMinutes( pill.getAttribute( 'data-open' ) );
			var close = toMinutes( pill.getAttribute( 'data-close' ) );
			var text  = pill.querySelector( '.status-text' );

			if ( null !== now && null !== open && null !== close ) {
				var isOpen = within( now, open, close );
				pill.classList.toggle( 'is-open', isOpen );
				if ( text ) {
					text.textContent = isOpen
						? ( pill.getAttribute( 'data-label-open' ) || 'Open now' )
						: ( pill.getAttribute( 'data-label-closed' ) || 'Closed' );
				}
			}
		}

		var hh = document.querySelector( '[data-louies-happy-hour]' );
		if ( hh ) {
			var hhNow = minutesNowIn( hh.getAttribute( 'data-tz' ) );
			var windows = [];
			try { windows = JSON.parse( hh.getAttribute( 'data-windows' ) || '[]' ); } catch ( e ) { windows = []; }

			if ( null !== hhNow && windows.length ) {
				var on = windows.some( function ( w ) {
					var s = toMinutes( w[0] ), e = toMinutes( w[1] );
					return null !== s && null !== e && within( hhNow, s, e );
				} );
				hh.classList.toggle( 'is-on', on );
			}
		}
	}

	refreshStatus();
	// Re-check every minute so a page left open on the bar's own TV, or on a
	// phone in someone's pocket, flips over at opening time on its own.
	setInterval( refreshStatus, 60000 );

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
