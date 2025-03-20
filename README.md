# README

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

- Allow saving and opening of different file formats.
- Swap between themes, or the ability to create/import custom themes
- Spellchecker
- [x] Add a custom scroll on the right side which shows header (chapter) "nodes" you can click on to quickly autoscroll to them.
  - [x] Maybe show ticks for the number of pages between nodes, so you can visually see variations of chapter lengths
  - [ ] Add header-node tooltip in order to see Chapter Titles
  - [ ] Cleanup expensive functions
  - [ ] Restructure editor
  - [ ] Make sure keybindings headers cover edge cases with duplicate ids (deleting and recreating after opening the file again)
    - [ ] Possibly create a hash function to make sure we don't end up with duplicate keys ever

### v3.0

- TBD
  - Possibly integrate some very basic local AI for proofreading / edits
  - Possibly create a graph or "node" viewer to link ideas
    - Plot points, characters, etc.
      - Think a lightweight Obsidian graph but more like a "cork board" with stripped down features
  - Possibly a very basic Spotify / Apple Music player which doesn't allow music controls (to reduce distractions) but can play playlists or stations. (Play / Pause being the only options outside of station or playlist selection)

### Changelog
