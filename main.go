package main

import (
	"github.com/Hadeon/go-desktop/internal/app"
	"github.com/Hadeon/go-desktop/internal/fileops"
	"github.com/Hadeon/go-desktop/internal/ui"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

func main() {
	app := app.New()
	editor := ui.NewEditor()

	var fileOps *fileops.FileOps
	updateTitle := func() {
		if fileOps.CurrentFile != nil {
			app.Window.SetTitle("Creative Writing App - " + fileOps.CurrentFile.Name())
		} else {
			app.Window.SetTitle("Creative Writing App - Untitled")
		}
	}

	fileOps = fileops.New(app.Window, editor.TextArea, updateTitle)

	setupUI(app, editor, fileOps)

	app.Window.Resize(fyne.NewSize(800, 600))
	app.Run()
}

func setupUI(app *app.WritingApp, editor *ui.Editor, fileOps *fileops.FileOps) {
	// Create main menu
	mainMenu := fyne.NewMainMenu(
		fyne.NewMenu("File",
			fyne.NewMenuItem("Open", fileOps.OpenFile),
			fyne.NewMenuItem("Save", fileOps.SaveFile),
			fyne.NewMenuItem("Save As", fileOps.SaveAsFile),
		),
	)
	app.Window.SetMainMenu(mainMenu)

	// Create toolbar
	toolbar := widget.NewToolbar(
		widget.NewToolbarAction(theme.FolderOpenIcon(), fileOps.OpenFile),
		widget.NewToolbarAction(theme.DocumentSaveIcon(), fileOps.SaveFile),
		widget.NewToolbarAction(theme.DocumentCreateIcon(), fileOps.SaveAsFile),
	)

	// Update the window content to include the toolbar
	content := container.NewBorder(
		toolbar, nil, nil, nil, // top, bottom, left, right
		editor.Container,
	)
	app.Window.SetContent(content)
}