import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("@client-monorepo/applets/wealth").then(
        (c) => c.WealthPageComponent,
      ),
    loadChildren: () =>
      import("@client-monorepo/applets/wealth").then((lib) => lib.wealthRoutes),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
