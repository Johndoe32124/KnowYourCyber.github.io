# KnowYourCyber

A cybersecurity awareness website that helps people understand data breaches and protect themselves online.

**[View Live Demo →]** *(https://youtube.com)*

---

## What is this?

I built this as a prototype for "KnowYourCyber" - a charitable organisation that wants to help regular people understand cyber threats. The website has three main pages:

- **Home** - Explains what the project is about
- **Database** - Shows major data breaches you can search through
- **Safety Advice** - Practical tips to stay safe online

The database loads from a JSON file, so you can easily add more breaches. The whole site works as a single-page app (no annoying page reloads) with smooth transitions.

---

## What it looks like

Dark theme with a blue/cyan glow. Cards tilt when you hover over them. Pages slide in and out when you navigate. Nothing too flashy, just clean and usable.

---

## Tech stuff

- HTML, CSS, vanilla JavaScript (no frameworks)
- JSON for the breach database
- Fetch API to load data
- Intersection Observer for scroll animations
- View Transitions API for page transitions

The JavaScript is split into modules so it's (hopefully) easy to understand:

| Folder | Purpose |
|--------|---------|
| core/ | routing, caching, transitions |
| api/ | fetching breach data |
| ui/ | alerts, buttons, search |
| animations/ | page-specific effects |

---

## Running it locally

1. Clone or download this repo
2. Open it with a local server (I use VS Code's Live Server)
3. That's it

Don't just open the HTML files directly - the JSON fetch won't work because of CORS.

---

## The data

Breaches are stored in `database/breaches.json`. Each entry looks like this:

```json
{
    "company": "Company Name",
    "year": 2024,
    "records": "number of records",
    "type": "what data was exposed",
    "summary": "brief description"
}
```
> Add more entries and the year filters will update automatically.

## Things I'd like to improve

- Better search (maybe fuzzy matching for typos)
- Pagination if the database gets too big
- Visual badges for breach severity
- Dark/light theme toggle (because why not)

## Credits

- The YouTube video is embedded from YouTube
- External links go to Have I Been Pwned, CISA, FTC, etc.
- No external libraries or frameworks were used

## License

MIT - do whatever you want with it, just don't blame me if something breaks.

---

Made with too much coffee and a genuine interest in cybersecurity. 🛡️

*KnowYourCyber - because most people only learn about data breaches after they're already in one.*
