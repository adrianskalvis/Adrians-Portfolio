# Adrian Kalvis — Portfolio

Personal portfolio for Adrian Kalvis, a Latvian web developer and programming
technician. The site presents selected projects, technical skills, creative
hardware work and contact information in a responsive Liquid Glass-inspired
interface.

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Local development

Node.js 20 or newer is recommended.

```sh
npm ci
npm run dev
```

The development server is available at `http://localhost:8080`.

## Validation

```sh
npm run build
npm test -- --run
npm run lint
```

## Deployment

The repository is configured for Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

Import the GitHub repository into Vercel or run `vercel --prod` from the
project directory. A custom domain can then be connected from the Vercel
project's Domains settings.
