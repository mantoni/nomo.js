# nomo

__no__de __mo__dules for the browser.

## Why?

I want to write modules that work on node and in the browser. I want to use NPM as my package manager, regardless of whether it's a Node or a browser package.

## Usage

Run `nomo` in your package directory. It will take the main module declared in your `package.json` or default to `index.js`. `require`d modules are resolved relatively. it will also find script in `node_modules`.
