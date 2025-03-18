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

- Allow for basic editing/saving/opening of files.
- Basic formatting (need text wrap, make the page feel more comfortable as a "creative writing app")
- Very bare-bones styling options (italics, bold, header, line break)
- Add basic navigation
- Create basic starter theme

### v2.0

- Allow saving and opening of different file formats.
- Swap between themes, or the ability to create/import custom themes
- Spellchecker
- Add a custom scroll on the right side which shows header (chapter) "nodes" you can click on to quickly autoscroll to them.
  - Maybe show ticks for the number of pages between nodes, so you can visually see variations of chapter lengths

### v3.0

- TBD
  - Possibly integrate some very basic local AI for proofreading / edits
  - Possibly create a graph or "node" viewer to link ideas
    - Plot points, characters, etc.
      - Think a lightweight Obsidian graph but more like a "cork board" with stripped down features
  - Possibly a very basic Spotify / Apple Music player which doesn't allow music controls (to reduce distractions) but can play playlists or stations. (Play / Pause being the only options outside of station or playlist selection)

### Changelog
