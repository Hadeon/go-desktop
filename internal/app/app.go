package app

import (
	"fyne.io/fyne/v2"
	fyneapp "fyne.io/fyne/v2/app"
)

type WritingApp struct {
  fyneApp fyne.App
  Window  fyne.Window
}

func New() *WritingApp {
	app := &WritingApp{
			fyneApp: fyneapp.New(),
	}
	app.Window = app.fyneApp.NewWindow("Creative Writing App")
	return app
}

func (a *WritingApp) Run() {
	a.Window.ShowAndRun()
}