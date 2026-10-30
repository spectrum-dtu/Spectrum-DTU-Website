# Team profiles

The `/team` page reads these four files in section order:

- `facultyAdvisors.json`
- `coreCouncil.json`
- `seniorCouncil.json`
- `members.json`

They intentionally start as empty arrays. Add only approved, real member information.

Each profile uses this structure (replace the example values before publishing):

```json
{
  "id": "unique-member-id",
  "name": "Full Name",
  "position": "Designation",
  "department": "Department name",
  "image": "/assets/team/members/portrait.jpg",
  "linkedin": "https://www.linkedin.com/in/actual-profile/",
  "order": 1
}
```

`id` must be unique within its section. Profiles are sorted by numeric `order` ascending; profiles without an order appear last. `position`, `department`, `image`, and `linkedin` can be omitted. Missing or broken images display initials. LinkedIn icons appear only for valid HTTPS LinkedIn URLs.

## Local photographs

Place image files under `public/assets/team/`, using the existing subfolders:

- `faculty/`
- `core/`
- `senior/`
- `members/`

Reference them in JSON as `/assets/team/core/filename.jpg`, for example. **Do not include `public` in the URL.** Vite serves these files directly, and the card prepends Vite's configured base URL. Arbitrary `src/assets` strings are not imported by this mechanism. Use portrait-oriented, web-optimized images; the cards crop with `object-fit: cover`.

## Page configuration

`page.json` holds the page and section copy and `membersInitialVisibleCount` (default: 12). Members beyond that count are revealed through View More / Show Less. No other component edits are needed when adding profiles.

The shared Navbar and application-level Footer are reused. No backend is involved.
