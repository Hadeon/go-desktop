# README

## License

This project is licensed under the GNU GPL v3.0 for open source use.

For commercial use, please contact andersene909@gmail.com

# Go Desktop Creative Writing Application

This is just a starter application for a very lightweight creative writing application written in Go.

Usual installation and build steps for a Go project, nothing fancy at the moment.

## About

This is built on the Wails React template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.

## Roadmap

### v1.0

- [x] Allow for basic editing/saving/opening of files.
- [x] Basic formatting (need text wrap, make the page feel more comfortable as a "creative writing app")
- [x] Very bare-bones styling options (italics, bold, header, line break)
- [x] Add basic navigation
- [x] Create basic starter theme

### v2.0

- [x] Allow opening of different file formats.
- [x] Add Save As
- [x] Swap between themes
  - [x] Alt. theme values set
  - [x] Add component to swap themes
- [x] Add a custom scroll on the right side which shows header (chapter) "nodes" you can click on to quickly autoscroll to them.

  - [x] Maybe show ticks for the number of pages between nodes, so you can visually see variations of chapter lengths
  - [x] Add header-node tooltip in order to see Chapter Titles
  - [x] Cleanup expensive functions
    - [x] hooks and functions removed and cleaned up
  - [x] Restructure editor

  ## Header Specific Features and Fixes

  - [x] Make sure keybindings headers cover edge cases with duplicate ids (deleting and recreating after opening the file again)
  - [x] Filter out special characters from statistics.headerPositions.text

### v3.0

- TBD
  - Possibly integrate some very basic local AI for proofreading / summaries
  - Spellcheck
    - Dictionary and thesaurus support on right click as well
  - Possibly create a graph or "node" viewer to link ideas
    - Plot points, characters, etc.
      - Think a lightweight Obsidian graph but more like a "cork board" with stripped down features
  - Versioning for specific chapters
    - Ability to "swap" between saved chapters
      - Need a special project format if this is the case, rather than saving to a traditional file format
  - [ ] Add custom theme option
  - [ ] Will have inputs for hexcodes

### Changelog

_Not needed yet. Will begin once the roadmap is complete._
