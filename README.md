# olalekanamoo.com

Plain HTML, CSS and a little JavaScript. No framework and no build step, so it loads fast.

Everything that gets published lives in `public/`.

| Page | What it's for |
| --- | --- |
| `index.html` | Main site (Classic mode): built to bring in leads |
| `tree.html` | Tree mode: pick fruit off the tree to explore roles, projects and certificates |
| `roots.html` | Mechanical engineering background |
| `thanks.html` | Shown after the contact form is sent without JavaScript |

## Preview locally

```sh
cd public && python3 -m http.server 4321   # then open http://localhost:4321
```

## Deploy (Netlify, free)

1. Push this folder to GitHub, then choose **Add new site → Import from Git** in Netlify. No build command is needed; the publish directory is `public` (already set in `netlify.toml`).
2. The contact form works automatically through Netlify Forms. Submissions show up under **Site → Forms**. Turn on email notifications there.
3. Point your domain at the site. If it isn't `olalekanamoo.com`, update the `canonical` and `og:` URLs in the three HTML files.

## Editing content

- **Tree mode content:** the `items` list at the top of `public/assets/js/tree.js`. `branch` and `t` set where each fruit hangs.
- **Photos:** the full-size originals live in `photos/` and are never published. Run `npm install && npm run images` to regenerate the compressed sizes in `public/assets/img/`.
- **Résumé:** replace `public/files/Olalekan-Amoo-Software-Engineer-Resume.pdf`, keeping the same file name. The mechanical engineering résumé isn't published because it contains a home address; the Roots page asks visitors to request it by email instead.
