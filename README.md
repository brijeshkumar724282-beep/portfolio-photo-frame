# Frame and Field · Photo Frame Portfolio Template

A warm gallery style portfolio for photographers and visual artists. Solid colors, masonry works wall, fullscreen lightbox with before after compare slider, pricing, testimonial rotator, and booking form.

## Features

1. Sticky nav with hamburger under 800px, smooth scroll, scroll progress bar
2. Hero with pure CSS collage (no external images) plus calls to action
3. Gallery of 8 works with category filter plus fullscreen lightbox (Esc and arrow keys, compare slider)
4. About plus services pricing plus auto rotating testimonials
5. Booking form with inline validation plus footer

## Run

One command from this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser. Expect HTTP 200 for `/index.html`.

## Customize

1. Edit gallery cards in `index.html` (title, category, art class). Replace CSS art thumbs with `<img>` tags when you have real photos.
2. Tweak palette in `styles.css` under `:root` (background, ink, terracotta accent).
3. Edit quotes array and pricing in `script.js` and `index.html`.
4. Booking form validates locally. Connect it to your backend or form service by adding a fetch call in the submit handler.

## Structure

```
index.html   markup for nav, hero, gallery, about, services, quotes, booking, lightbox
styles.css   all styling, CSS art thumbs, responsive rules for 360 768 1200
script.js    nav, filter, lightbox, testimonials, form validation
README.md    this file
```
