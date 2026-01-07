# Ticket Monorepo

This monorepo contains multiple Angular applications managed with Nx.

## Applications

- **web-wallet**: Digital wallet application
- **credit**: Credit management application
- **merchant-credit**: Merchant credit application

## Libraries

- **libs/shared**: Shared libraries and utilities
- **libs/applets**: Feature modules and applets

## Development

```bash
# Install dependencies
pnpm install

# Serve an application
nx serve <app-name>

# Build an application
nx build <app-name>

# Run tests
nx test <app-name>

# Lint
nx lint <app-name>
```

## Structure

This monorepo follows the same structure as client-monorepo with:
- NX version: 18.3.4
- Angular version: 17.3.0
- Package manager: pnpm 10.15.0
