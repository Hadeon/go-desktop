package ui

import (
	"strings"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

type Editor struct {
    TextArea  *widget.Entry
    preview   *fyne.Container
    Container fyne.CanvasObject
    lastContent string
}

func NewEditor() *Editor {
    editor := &Editor{
        TextArea: widget.NewMultiLineEntry(),
        preview:  container.NewVBox(),
    }
    
    editor.TextArea.SetPlaceHolder("Start writing your story here...")
    editor.TextArea.Wrapping = fyne.TextWrapWord
    
    // Set up preview handling
    editor.TextArea.OnChanged = editor.updatePreview
    
    // Create split view
    splitView := container.NewHSplit(editor.TextArea, container.NewScroll(editor.preview))
    splitView.SetOffset(0.5)
    
    editor.Container = splitView
    return editor
}

func (e *Editor) updatePreview(content string) {
    if content == e.lastContent {
        return
    }
    e.lastContent = content

    e.preview.Objects = nil
    lines := strings.Split(content, "\n")

    for _, line := range lines {
        var textObjs []*canvas.Text
        currentText := ""

        // Handle headers
        if strings.HasPrefix(line, "##") {
            text := strings.TrimPrefix(line, "##")
            textObj := canvas.NewText(text, theme.ForegroundColor())
            textObj.TextSize = 24
            textObj.TextStyle = fyne.TextStyle{Bold: true}
            e.preview.Add(textObj)
            continue
        }

        // Process line character by character
        for i := 0; i < len(line); i++ {
            if i < len(line)-1 && line[i:i+2] == "**" {
                if len(currentText) > 0 {
                    textObjs = append(textObjs, canvas.NewText(currentText, theme.ForegroundColor()))
                    currentText = ""
                }
                // Find closing **
                end := strings.Index(line[i+2:], "**")
                if end != -1 {
                    boldText := canvas.NewText(line[i+2:i+2+end], theme.ForegroundColor())
                    boldText.TextStyle = fyne.TextStyle{Bold: true}
                    textObjs = append(textObjs, boldText)
                    i = i + 3 + end
                    continue
                }
            } else if line[i] == '*' {
                if len(currentText) > 0 {
                    textObjs = append(textObjs, canvas.NewText(currentText, theme.ForegroundColor()))
                    currentText = ""
                }
                // Find closing *
                end := strings.Index(line[i+1:], "*")
                if end != -1 {
                    italicText := canvas.NewText(line[i+1:i+1+end], theme.ForegroundColor())
                    italicText.TextStyle = fyne.TextStyle{Italic: true}
                    textObjs = append(textObjs, italicText)
                    i = i + 1 + end
                    continue
                }
            }
            currentText += string(line[i])
        }

        if len(currentText) > 0 {
            textObjs = append(textObjs, canvas.NewText(currentText, theme.ForegroundColor()))
        }

        // Create horizontal container for the line
        lineContainer := container.NewHBox()
        for _, obj := range textObjs {
            lineContainer.Add(obj)
        }
        e.preview.Add(lineContainer)
    }

    e.preview.Refresh()
}