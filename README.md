# nomo

__no__de __mo__dules for the browser.

## Why?

* I want to write modules that work on node and in the browser.
* I want to use NPM as my package manager, regardless of whether it's a Node or a browser package.
* I want all scripts to be merged into a single file for browsers.

## Usage

_(work in progress - this is how it is supposed to work once it's ready)_

Run `nomo` in your package directory. It will start with the main script declared in your `package.json` or default to `index.js`. `require`d scripts are resolved relatively. It will also find scripts in `node_modules`.

The generated `nomo.js` file contains all scripts wrapped into a micro module loading framework.
