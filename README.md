# bun-monorepo-template

Opinionated Bun monorepo template with:

- **apps/api**: Bun + Hono
- **apps/web**: Bun + Nuxt v4
- **packages/shared**: shared utilities/types
- **Biome**: formatter + linter
- **Husky + lint-staged**: pre-commit checks

## Structure

```
apps/
	api/
	web/
packages/
	shared/
```

## Requirements

- Bun (latest)

## Install

```bash
bun install
```

## Dev

Run both apps from the root:

```bash
bun run dev
```

Run individually:

```bash
bun run dev:api
bun run dev:web
```

## Lint / Format (Biome)

```bash
bun run lint
bun run format
```

## Shared package usage

In any workspace:

```ts
import { /* ... */ } from "@workspace/shared";
```

## Husky / lint-staged

After install, Husky is set up via `prepare`.
Pre-commit runs:

```bash
bunx lint-staged
```

## Notes

- Prefer separate containers for api/web in production.
- Add workspace-specific `tsconfig.json` only if needed.

## License

MIT
