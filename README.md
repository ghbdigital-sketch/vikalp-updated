# Vikalp Phase II website: HTML prototype

Design Option B. Every page in the final sitemap, built from the IDF-reviewed website content (comments of 22 Nov 2026 applied).

## How to open
Unzip the folder and open `index.html` in any browser. Every page, menu and footer link works from the local folder, with no server needed.

- **हिं / EN** in the header switches language. The choice carries across pages.
- **Moon / sun** button switches light and dark theme. This choice also carries across pages.
- Phone numbers are live `tel:` links.

## Pages (22 + 2 sample articles)

| # | Page | Route (Hindi) | English route in Next.js |
|---|---|---|---|
| 1 | होम · Home | `/` | `/en` |
| 2 | पहला बच्चा कब? | `/pehle-bachche-mein-deri` | `/en/pehle-bachche-mein-deri` |
| 3 | दूसरा बच्चा कब? | `/bachchon-mein-antar` | `/en/…` |
| 3.1 | डिलीवरी के बाद | `/bachchon-mein-antar/delivery-ke-baad` | |
| 4 | गर्भनिरोध के साधन | `/garbhnirodh-ke-saadhan` | |
| 4.1–4.6 | अंतरा · छाया · माला-एन · IUCD/कॉपर-टी · कंडोम · इमरजेंसी गोली | `/garbhnirodh-ke-saadhan/{antara, chhaya, mala-n, copper-t, condom, aapatkalin-goli}` | |
| 4.7–4.9 | सेफ़ डेज़ और विड्रॉल · साइड इफ़ेक्ट हों तो · पति बाहर रहते हों तो | `/garbhnirodh-ke-saadhan/{paramparik-tarike, pareshani-ho-to, sathi-door-rehte-hon-to}` | |
| 5 | साधनों की तुलना (tool) | `/saadhan-tulna` | |
| 6 | सच या सुनी-सुनाई? (game) | `/sach-ya-suni-sunayi` | |
| 7 | भ्रम और सच | `/sach-aur-mithak` | |
| 8 | पति-पत्नी के लिए | `/saath-milkar-faisla` | |
| 9 | सवाल-जवाब | `/sawal-jawab` | |
| 10 | नए लेख (blog) | `/blog` | |
| 10.x | Sample articles | `/blog/iucd-copper-t-lagwane-ka-sahi-samay`, `/blog/72-ghante-beet-gaye-to` | |
| 11 | सखी हेल्पलाइन | `/sakhi-helpline` | |
| 12 | गोपनीयता नीति | `/privacy-policy` | |

## Folder structure
```
index.html, <route>/index.html   one folder per route (maps 1:1 to the Next.js app router)
assets/css/vikalp.css            all styles; theme colours are CSS variables (body.dark overrides them)
assets/css/fonts.css             Mukta and Yatra One, self-hosted woff2 in assets/fonts
assets/js/vikalp.js              language, theme, menu, filter chips, contents panel, effects
assets/js/game.js + game-data.js         myth-or-fact game
assets/js/compare.js + compare-data.js   comparison tool
assets/img/                      logo, Sakhi illustration, video thumbnails
data/site-content.json           final page content (Hindi + English, SEO title and description per page)
```

## Notes for the Next.js build
- **Bilingual:** the prototype holds Hindi and English in one page and toggles them. In Next.js, render Hindi at the route above and English under `/en/…`, with `hreflang` alternates. The English title for each page is in a comment in each page's `<head>`.
- **Shared components:** Header with menu dropdowns, Footer, Helpline box, Sticky call bar (mobile), Page hero with breadcrumb, Short answer, Key points, Effectiveness chart, Method cards, Myth card, Related questions (FAQ accordion), Next steps, Video card.
- **Schema:** each page already carries JSON-LD (MedicalWebPage, FAQPage, Quiz, WebApplication, Article). Keep it in the Next.js metadata.
- **Game and comparison tool:** both run fully client-side from their data files. The "better than X% of players" line on the game result is a placeholder until the analytics backend supplies real numbers. The comparison tool's PDF uses the browser's print-to-PDF, styled for print.
- **Dark theme:** follows the visitor's choice and is stored in `localStorage`.
- **Videos:** link to the Vikalp YouTube channel. Swap in individual video URLs when available.
- **Placeholder:** the privacy policy contact email is to be confirmed by IDF.
