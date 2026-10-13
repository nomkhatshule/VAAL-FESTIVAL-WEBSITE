# Vaal Festival: Crossing Bridges

Website for Vaal Festival: Crossing Bridges, Saturday 12 December 2026 at The Hills, Sasolburg.

It is a plain static website (HTML, CSS and a little JavaScript), so it needs no build step and can be hosted anywhere. It is set up for [Netlify](https://www.netlify.com).

## What's in here

```
public/                 everything that goes online
  index.html            the whole page: text, layout, lineup, tickets, FAQ
  styles.css            shared styles and animations
  main.js               headliner slideshow + FAQ pop-up
  images/
    logo.png, logo-footer.png
    artists/            headliner and supporting artist photos
    sponsors/           sponsor logos
netlify.toml            tells Netlify to publish the "public" folder
```

## Putting it online with Netlify (one time)

1. Go to <https://app.netlify.com> and sign up with your GitHub account.
2. Click **Add new site → Import an existing project → GitHub**.
3. Pick the **VAAL-FESTIVAL-WEBSITE** repository and the branch you want to publish.
4. Netlify reads `netlify.toml` and fills in the settings for you (publish directory `public`, no build command). Click **Deploy**.

You get an address like `vaal-festival.netlify.app`. To use your own domain, open **Domain management → Add a domain** in Netlify.

After that, every change pushed to that branch on GitHub goes live by itself within about a minute.

## Making changes

- **Text, prices, lineup, FAQ:** edit `public/index.html`.
- **Headliner slideshow:** the slides are in `public/index.html` (search for `vf-sname`); the names shown in the caption and the speed (`STORY_SECONDS`) are at the top of `public/main.js`. Keep the two in the same order.
- **Images:** put new files in `public/images/` and point the `src="..."` in `index.html` at them.

To preview locally, open `public/index.html` in a browser, or run `npx serve public`.
