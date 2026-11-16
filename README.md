# Nadia Izzati: portfolio website

A static website (plain HTML, CSS and JavaScript). No build step, no dependencies, no framework.
It deploys for free on GitHub Pages.

```
nadia-portfolio/
├── index.html          all text content (profile, journey, projects, skills, contact)
├── css/style.css       design (3 colors only: #FFFFFF, #050505, #548CFF)
├── js/content.js       YOU EDIT THIS: document links + photo/video gallery
├── js/main.js          behavior (menu, timeline, filters, gallery viewer)
├── assets/
│   ├── fonts/          self-hosted fonts (Bricolage Grotesque, Figtree)
│   ├── photos/         profile.jpg and gallery photos
│   ├── videos/         short mp4 clips (optional)
│   └── docs/           CV and transcript PDFs (download buttons)
└── favicon.svg
```

## 1. Preview on your own computer

```bash
cd nadia-portfolio
python -m http.server 8000
```
On Windows the command is `python` (or `py`); on Mac/Linux use `python3`.
Explanation: starts a tiny local web server. Open http://localhost:8000 in a browser.
Press Ctrl+C in the terminal to stop it.
Alternative in VS Code: install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".

## 2. Add your content

1. **Profile photo.** Save a portrait as `assets/photos/profile.jpg` (about 900 px wide, under 300 KB). The site crops it to 4:5 and keeps the top, so a head-to-waist photo works best (the focus point is set by `object-position` on `.portrait img` in `css/style.css`). To use a different file name or format, change the `src` of the `<img>` in the hero section of `index.html`. If the file is missing the site shows your initials.
2. **Social preview image** (optional). Save `assets/photos/og-image.jpg` (1200 x 630 px). It is the picture shown when the link is shared on WhatsApp, LinkedIn, etc.
3. **Documents.** Your CV and transcript live in `assets/docs/` (`Nadia_Izzati_CV.pdf`, `Nadia_Izzati_Transcript.pdf`) and download directly when clicked. To update one, replace the PDF with the same file name.
4. **Photos and videos.** Copy files into `assets/photos/`, then add one line per item to `GALLERY` in `js/content.js`. The "Moments" section and its menu link appear automatically once the list has items.

5. **Project screenshots** (optional). Copy a picture into `assets/photos/`, then add a line to `PROJECT_IMAGES` in `js/content.js`. It appears inside that project when it is expanded.

## 3. Where to keep photos, videos, and documents

| Material | Best place | Why |
|---|---|---|
| Photos | In the repo, `assets/photos/` | Fast, reliable. Resize first: about 1600 px wide, JPG or WebP, under 400 KB each. |
| Short videos (under ~20 MB) | In the repo, `assets/videos/` | Plays directly on the site. |
| Long videos | YouTube (Unlisted) or Google Drive | GitHub rejects files over 100 MB and a repo should stay under ~1 GB. |
| CV, transcript | In the repo, `assets/docs/` | Downloads directly on click. A Google Drive link only opens in a new tab, it cannot force a download. |

Drive image links are unreliable for embedding on a website, so use Drive only for long videos, and keep photos and documents in the repo.

Privacy: a public GitHub repo and a public site can be read by anyone. Your CV contains a phone number, and a transcript contains your student number and academic records. Consider uploading a version without the phone number or student number.

## 4. Deploy with GitHub Pages

```bash
cd nadia-portfolio
git init
git add .
git commit -m "Add portfolio website"
```
Explanation: turns the folder into a Git repository and saves the first snapshot.

On GitHub, create a **public** repository named `nadizzati.github.io` (your username + `.github.io`). This special name gives you the clean address `https://nadizzati.github.io`. Do not tick "Add a README".

```bash
git branch -M main
git remote add origin https://github.com/nadizzati/nadizzati.github.io.git
git push -u origin main
```
Explanation: names the branch `main`, links your folder to the GitHub repository, and uploads the files.

Then on GitHub: **Settings > Pages > Build and deployment > Source: "Deploy from a branch" > Branch: `main`, folder `/ (root)` > Save.**
After one to two minutes the site is live at `https://nadizzati.github.io`.

If you use a different repository name (for example `portfolio`), the address becomes `https://nadizzati.github.io/portfolio/`. The site uses relative paths, so it works either way.

## 5. Update later

```bash
git add .
git commit -m "Add new photos and transcript link"
git push
```
Explanation: saves your changes and uploads them. GitHub Pages republishes automatically.

## Editing text

All text lives in `index.html`. Search for the words you want to change (for example `Lab assistant to 200+`) and edit them directly.
To add a project, copy one `<li class="project"> ... </li>` block, paste it at the top of the list, and edit it. `data-cat` controls which filter button it belongs to (`networking`, `web`, `data`, `games`, `embedded`).
