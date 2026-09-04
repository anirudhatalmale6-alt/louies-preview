# Louie's Cocktail Lounge — clickable preview

A **static snapshot** of the WordPress site, published so it can be browsed
without a server. Every page, event, photo and menu item is real.

Live: https://anirudhatalmale6-alt.github.io/louies-preview/

What works: all navigation, the menu jump-links, the mobile layout, tap-to-call,
and the Directions links into Google Maps.

What doesn't, because a static host has no PHP:

* The contact and private-event forms can't submit.
* "Open now / Closed", "Happy hour is on right now", "Tonight at Louie's" and the
  *Tonight* highlight in the weekly grid are frozen at the moment the snapshot
  was taken. On the real site they update themselves.
* The admin screens aren't here at all.

Source code: https://github.com/anirudhatalmale6-alt/louies-cocktail-lounge

## A note on the open/closed light

On the real WordPress site the "Open now / Closed" pill in the header is worked
out **in your browser**, against the bar's own timezone, and re-checked every
minute — so it is correct here too, even though these are flat files with no PHP
running behind them.

It did not always work that way. It used to be decided on the server when the
page was built, which meant this preview froze whatever it said at build time —
and spent an evening advertising the bar as closed. The same thing would have
happened on a live host with a page cache in front of it.

## v6 — karaoke leads the page

Karaoke now has its own band directly under the hero, with the four nights read
straight off the events. The line on the photo changes on its own: **"on right
now"** while it is running, **"tonight from 9:00 pm"** earlier in the day, and
**"next karaoke: Wednesday"** the rest of the week. Like the open/closed light,
it is worked out in your browser against Rancho Cordova's clock, so it is right
no matter when this page was built or where you are reading it from.
