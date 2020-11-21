# Automate notes with JS

Finds blocks of javascript in the current note (blocks have to start with "```javascript" and end with "```") and runs it as a function. Writes whatever it returns in a "results" block right under your code.

This only works on notes with a title starting with "[Run]", so you don't end up running all the example javascript snippets you have stored somewhere.

## Joplin Plugin

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.

The plugin is built using webpack, which create the compiled code in `/dist`. The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

## Building the plugin

To build the plugin, simply run `npm run dist`.
