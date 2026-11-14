# Neema Home Care: Website

A static marketing website (HTML, CSS, vanilla JavaScript). No build tools, frameworks or backend.

## Open it locally
Double-click `index.html`, or serve the folder:

```
python -m http.server 8080     # then visit http://localhost:8080
```

All paths are relative, so the site works from any folder or static host.

## Deploy
- **Netlify:** drag the `neema-home-care` folder onto app.netlify.com/drop (or connect a repo; no build command, publish directory `/`). Netlify serves `404.html` automatically.
- **GitHub Pages:** push the folder contents to a repo, then Settings > Pages > deploy from branch. GitHub Pages serves `404.html` automatically.
- **Any static host (cPanel, S3, Hostinger, etc.):** upload the folder contents to the web root.

Note: `404.html` uses relative asset paths. If your host serves it for deep URLs (e.g. `/a/b/c`), styles may not load; in that case change the asset links in `404.html` to start with `/`.

## Placeholder checklist (replace before launch)
- [x] **Domain:** set to `https://www.neemahomecare.org` (canonical, Open Graph, `sitemap.xml`, `robots.txt`). Register the domain and point DNS at the host before launch.
- [ ] **Email:** the site uses `info@neemahomecare.org` everywhere. Create this mailbox before launch, or messages and applications will bounce.
- [ ] **Logo:** `assets/images/logo.svg` (header, dark text) and `assets/images/logo-light.svg` (footer). Keep the same file names, or search/replace. Logo text uses Georgia as a fallback; for a final logo, convert text to outlines.
- [ ] **Favicon:** `assets/images/favicon.svg` (add PNG/ICO versions if needed for older browsers).
- [ ] **Social share image:** create `assets/images/og-image.jpg` (1200x630). It is referenced by `og:image` but does not exist yet.
- [x] **Photos:** `assets/images/caregiver-*.jpg` (supplied by the client). Confirm each photo is licensed for commercial use before launch.
- [ ] **Remaining placeholder images** (SVG stand-ins; replace with real photos, update the `src` and `alt`):
  - `assets/images/placeholder-service-area.svg`: Contact page service-area map/graphic
- [ ] **Founder bio and credentials:** labeled placeholder block on `about.html` ("Meet the team"). Replace or remove.
- [ ] **Office hours:** set to Mon&ndash;Fri 9:00am&ndash;5:00pm, Sat&ndash;Sun closed (footer, `contact.html`, home page JSON-LD). Confirm with the owner.
- [x] **Service areas:** `service-areas.html` (Seattle, Shoreline, Edmonds, Bellevue, Kirkland, Redmond, Mercer Island, Renton, Kent). Office: 1140 NW Market St, Unit 401, Seattle, WA 98107.
- [ ] **Privacy policy:** `privacy-policy.html` is a **draft and needs legal review**. Add the effective date.
- [ ] **Not included on purpose** (add only if true and verifiable): testimonials, statistics, years in business, awards, licenses/certifications, insurance or Medicaid acceptance, staff names.
- [ ] **Pricing / FAQ answers:** several FAQ answers say "contact us for details". Update in `why-choose-us.html` once specifics are decided.

## Connecting the contact form to a real backend
The form (`contact.html`) is validated in `assets/js/forms.js`. On submit it currently opens a pre-filled `mailto:` to info@neemahomecare.org.

Everything that sends data lives in one function, `submitForm(data)`, in `forms.js`. Replace its body with a `fetch` call and return the Promise. The file includes commented examples for:
- **Formspree:** POST JSON to `https://formspree.io/f/YOUR_FORM_ID`
- **Netlify Forms:** add `data-netlify="true"` and a hidden `form-name` input, POST URL-encoded data
- **Custom API:** POST to your endpoint

The success and error messages are shown automatically based on whether the Promise resolves or rejects. If you use a service, also update `privacy-policy.html` ("How the contact form works").

## Careers page
`careers.html` uses the glass design in `assets/css/glass.css` (frosted panels over soft color orbs, with solid fallbacks for older browsers). The application form is handled by `assets/js/careers-form.js`; like the contact form, it currently opens a pre-filled email to `info@neemahomecare.org`. To connect a real service, replace the body of `submitApplication(data)` (examples in the file).

## Preview on GitHub Pages
Push to `main`, then on GitHub open **Settings > Pages**, set *Source* to **Deploy from a branch**, branch `main`, folder `/ (root)`. The preview appears at `https://<username>.github.io/<repo>/` within a minute or two.

## Notes
- The home page includes one `application/ld+json` block (HomeAndCareService: name, phone, email only). This is data, not executable script.
- Fonts (Lora, Nunito Sans) load from Google Fonts. For full privacy, self-host them and update the policy.
- Pages were generated with consistent header/footer markup. If you change navigation (including the Services dropdown), update it in every HTML file.

## Structure
```
index.html  about.html  services.html  hourly-care.html  live-in-care.html  healthcare-professionals.html  service-areas.html  why-choose-us.html  careers.html  contact.html
privacy-policy.html  404.html  robots.txt  sitemap.xml
assets/css/   variables.css (all design tokens), base.css, components.css, pages.css, responsive.css
assets/css/glass.css  (careers page glass design)
assets/js/    main.js (nav, header, smooth scroll, FAQ, year), forms.js, careers-form.js, animations.js
assets/images/
```
