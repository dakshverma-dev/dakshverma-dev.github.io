# Eternal Blyss

A static portfolio and inquiry site for wedding, engagement, and anniversary invitation websites.

## Preview

Open `index.html` directly in a browser or run `python -m http.server 8765` in this folder and open [the local preview](http://localhost:8765/). There is no build step.

## Edit the catalog

- Edit titles, descriptions, and indicative prices in `index.html`.
- Edit features, preview captions, and demo links in `app.js`.
- Replace preview images in `assets/`. Each project uses a cover and an opened view.
- The WhatsApp number in `index.html` comes from the original invitation portfolio. The inquiry form builds a message that visitors review and send in WhatsApp. Update the form action and fallback links together if the number changes.

The Botanical Gatefold, Royal Jharokha, and Silver Letter have interactive demo pages. The Gilded Evening has a two-screen gallery preview. The portfolio versions use sample details where applicable and the demo RSVP forms give local feedback.

## Publish on GitHub Pages

1. Push the site files to the repository’s `main` branch. The supplied reference images are excluded by `.gitignore`.
2. In the repository’s **Settings → Pages**, select **Deploy from a branch** and choose **main** and **/(root)**. GitHub Free supports public source repositories for Pages. Private source repositories require an eligible paid plan.
3. Set the custom domain to `eternalblyss.me` in Pages settings. The root `CNAME` file already contains that name, and the apex domain currently resolves to the four GitHub Pages IPv4 addresses.
4. After GitHub completes its DNS check and provisions the certificate, enable **Enforce HTTPS**.

The site presents the portfolio and takes inquiries on WhatsApp. GitHub Pages restricts sites primarily directed at commercial transactions.

[Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Custom domain setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) · [Usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
