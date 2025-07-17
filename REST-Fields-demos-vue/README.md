# Vue demos

## Results

### Formio
Difficult to work with:
* difficult to get started - v4 and v5 CDNs resolve differently, nuanced npm import `import { Formio } from 'formiojs'` vs `import Formio from 'formiojs'` and typescript problems
* leans heavily into enterprise SaaS and not library code
* styling problems - could not replicate same style as in documentation sample like no "mb-2", uses old Bootstrap 4, requires removing Tailwind preflight
* undesired workflow - save/edit instead of two-way binding, does not initialize in open state (Add another button)


### SurveyJS

### FormKit

### JsonForms
Painpoints:

* Build contains bugs (vite path resolution)
* Styling problems (Vuetify, MDI icons)
* No schema nesting 


This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
