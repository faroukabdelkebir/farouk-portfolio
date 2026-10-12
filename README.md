# Farouk Abdelkebir — Portfolio

A responsive, single-page portfolio built with plain HTML, CSS and JavaScript, with a full-stack positioning, animated interactions, and a custom 3D hero illustration.

## Run locally
Open `index.html` in a browser, or run a local static server from this directory:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to Vercel
1. Create a GitHub repository and upload `index.html`, `style.css`, `script.js`, and the `assets/` directory (including the CV PDF and hero illustration).
2. In Vercel, choose **Add New → Project** and import that repository.
3. Vercel should detect a static site. No build command is required.
4. Set the output directory to `.` if prompted, then deploy.

Alternatively, install the Vercel CLI and run `vercel` from this directory.

## Before publishing
- Confirm the project details and internship dates are still accurate.
- Add project-specific GitHub repositories and demo URLs only when they are available.
- The contact links and downloadable CV use the details provided in the supplied CV. Verify the PDF and public contact details before publishing.

## Included interactions
- Responsive mobile navigation
- Scroll reveal animations
- Custom 3D workstation hero illustration
- Subtle cursor glow
- Project card tilt on desktop
- Accessible project detail dialog
- Reduced-motion preference support
