# Honda Cars Dasmariñas

This project is an ongoing update for the **Honda Cars Dasmariñas** website.

## Project Files

- `index.html` – main landing page
- `services.html`, `technology.html`, `facilities.html`, `careers.html` – inner pages
- `brio.html` – sample vehicle detail page
- `honda-dasma-style.css` – site styling
- `honda-dasma.js` – interactive behavior/scripts
- `images/` – image assets

## Run Locally

1. Download or clone this project.
2. Open `index.html` in your browser.

## Reusable Vehicle Page Pattern

Use `brio.html` as a template for new vehicle pages.

1. Duplicate `brio.html` and rename it (example: `civic.html`).
2. Update hero media paths inside `.hero-slide`.
3. Update vehicle logo inside `.vehicle-subnav-brand`.
4. Keep class names the same: `.hero`, `.vehicle-hero`, `.hero-slide`, `.carousel-prev`, `.carousel-next`, `.vehicle-subnav`.
5. Optional: if mobile image filename is different from the default `-mobile` pattern, set it directly on the image:

```html
<img src="images/cars/civic/civic-main.jpg" data-mobile-src="images/cars/civic/civic-main-mobile-v2.jpg" alt="Honda Civic">
```

Notes:
- Default mobile image mapping is automatic: `name.jpg` -> `name-mobile.jpg` in the same vehicle folder.
- Slider text is optional and reusable with either IDs or data attributes:
	- `data-hero-title`
	- `data-hero-description`

