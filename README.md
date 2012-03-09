# nomo

__no__de __mo__dules for the browser.

## Why?

* Write modules for Node and browsers without environment branching.
* Dependency management with NPM for browser packages.

## Install

`npm install nomo`

## Usage

`nomo`

1. Reads a package.json in the current directory to find the main file or fall
back to `index.js`.
2. Scans the js file for `require` and resolves them relatively. It also looks
into `node_modules`.
3. Generates a `nomo.js` file containing all scripts wrapped into a micro
module loading framework.

## Configure

Put a `nomo` section into your package.json. The following properties are
recognized:

* `require`: The main file to initially require in the generated script
* `exportTarget`: Assigns the result of the initial require call to the given
path, e.g. `window.myCoolStuff`.
* `requireTarget`: Assigns the internal require function to the given path,
e.g. `window.require`. If the require function already exists, it will be
replaced and delegated to if the module is not found.
* `fileName`: The desired file name. Defaults to nomo.js.
* `name`: The name of the project to put into the script header. Defaults to
the package name.
