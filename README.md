# What's My District (Redux)

## What is this?

[What's My District?](http://www.whatsmydistrict.org) started off as a National
Day of Civic Hacking project. It essentially allows anyone in Lexington, KY to
input their address and find out all the differenct districts they are in,
including schools, council districts, magistrate districts, and etc.


It was a Sinatra app using convoluted PostGIS queries and a pain to deploy.
With Mapbox releasing Turf.js I decided to remake What's My District. This
is the tentative results. All client side, all static files, and can be
deployed on GitHub. I'm even adding finding and showing the nearest
hospital, library, post office, and fire station.


The end goal is to break the abstract logic into a small
library with all city/county specific stuff in a lexington.js file. This
way other cities can get a jump start building their own version.

Current Dependencies:

- Mapbox.js
- Turf.js
- jQuery (could probably be replaced easily)
- Handlebars.js