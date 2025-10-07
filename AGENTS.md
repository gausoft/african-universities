# AGENTS.md

## Project Overview

African Universities Registry (AUR) is an open-source platform that catalogs recognized higher education institutions across Africa. The project provides JSON datasets, a web interface, and APIs for accessing official university information.

**Tech Stack (Planned)**:

- Backend: Hono TypeScript
- Database: PostgreSQL
- Frontend: Next.js
- Data Format: JSON datasets

## Documentation Language Policy

**IMPORTANT**: For all documentation files, always create and maintain both:

- `README.md` (English - primary language)
- `README-fr.md` (French translation)

When creating or updating any README file, automatically generate both versions with equivalent content.

## Code Style

- Use TypeScript strict mode when applicable
- Follow consistent naming conventions
- Document data schemas clearly
- Keep JSON datasets well-formatted and validated
- **All code must be written in English** (variable names, function names, comments, documentation)
- Use English for all code comments and inline documentation

## Data Guidelines

- All university data stored in `data/` directory
- Use JSON format for datasets
- Follow existing schema structure
- Validate data completeness before committing
- Include source references when available

## Project Structure

```
african-universities/
├── data/           # JSON datasets of universities by country
├── README.md       # English documentation
└── README-fr.md    # French documentation
```

## Contributing

1. All contributions must include both English and French documentation updates
2. Validate JSON datasets before committing
3. Follow the existing data schema structure
4. Test any code changes thoroughly
