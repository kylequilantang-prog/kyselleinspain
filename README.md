# Site starter

Static site for GitHub Pages. No build step, no dependencies — the files you edit
are the files that get served.

## Files

    index.html        page markup
    css/style.css     all styling; the tokens at the top are the fastest thing to change
    js/main.js        mobile menu, active nav link, footer year
    assets/           images, favicon, downloads
    CNAME             your custom domain, one line, nothing else
    .nojekyll         stops GitHub Pages from running Jekyll on the folder
    .gitignore        OS junk files

## Publish

1. Create a repo on GitHub and push these files to the root of the `main` branch.
2. Repo → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Wait a minute or two. It'll be live at `https://<username>.github.io/<repo>/`.

## Custom domain

Edit `CNAME` so it contains only your domain — no `https://`, no trailing slash:

    yourdomain.com

Then add DNS records at your registrar.

**Apex domain** (`yourdomain.com`) — four A records pointing at:

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

**Subdomain** (`www.yourdomain.com`) — one CNAME record pointing at `<username>.github.io`.

DNS changes can take anywhere from a few minutes to a day to propagate. Once
GitHub sees the records, tick **Enforce HTTPS** in Settings → Pages.

If you use the apex domain, also add a `www` CNAME so both spellings work.

## Local preview

    cd site
    python3 -m http.server 8000

Then open http://localhost:8000

## Before launch

- [ ] Replace the `<title>`, `<meta name="description">`, and og: tags in `index.html`
- [ ] Put your real domain in `CNAME` and the canonical/og URLs
- [ ] Swap `assets/favicon.svg` for your own
- [ ] Add `assets/img/social-preview.png` (1200×630) for link previews
- [ ] Replace the placeholder copy with real content
