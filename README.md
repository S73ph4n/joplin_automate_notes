# Link to note

This plugin adds an icon to the toolbar. When clicked, it creates a link to the note with a title matching the selected text (or, if such a note does not exist, creates it).

Also adds a link back to the current note.

## Joplin Plugin

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.

The plugin is built using webpack, which create the compiled code in `/dist`. The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

## Building the plugin

To build the plugin, simply run `npm run dist`.
