package fileops

import (
	"io"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/storage"
	"fyne.io/fyne/v2/widget"
)

type FileOps struct {
    window       fyne.Window
    editor       *widget.Entry
    CurrentFile  fyne.URI
    onFileChange func()
}

func New(window fyne.Window, editor *widget.Entry, onFileChange func()) *FileOps {
    return &FileOps{
        window:       window,
        editor:       editor,
        onFileChange: onFileChange,
    }
}

func (f *FileOps) OpenFile() {
    dialog.ShowFileOpen(func(reader fyne.URIReadCloser, err error) {
        if err != nil {
            dialog.ShowError(err, f.window)
            return
        }
        if reader == nil {
            return
        }
        defer reader.Close()

        data, err := io.ReadAll(reader)
        if err != nil {
            dialog.ShowError(err, f.window)
            return
        }
        f.CurrentFile = reader.URI()
        f.editor.SetText(string(data))
        f.onFileChange()
    }, f.window)
}

func (f *FileOps) SaveFile() {
    if f.CurrentFile == nil {
        f.SaveAsFile()
        return
    }

    writer, err := storage.Writer(f.CurrentFile)
    if err != nil {
        dialog.ShowError(err, f.window)
        return
    }
    defer writer.Close()

    _, err = writer.Write([]byte(f.editor.Text))
    if err != nil {
        dialog.ShowError(err, f.window)
        return
    }
    f.onFileChange()
}

func (f *FileOps) SaveAsFile() {
    dialog.ShowFileSave(func(writer fyne.URIWriteCloser, err error) {
        if err != nil {
            dialog.ShowError(err, f.window)
            return
        }
        if writer == nil {
            return
        }
        defer writer.Close()

        _, err = writer.Write([]byte(f.editor.Text))
        if err != nil {
            dialog.ShowError(err, f.window)
            return
        }
        f.CurrentFile = writer.URI()
        f.onFileChange()
    }, f.window)
}