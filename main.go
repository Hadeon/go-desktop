package main

import (
	"strings"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

func main() {
    myApp := app.New()
    myWindow := myApp.NewWindow("Creative Writing App")

    // Create a multi-line text editor for writing
    editor := widget.NewMultiLineEntry()
    editor.SetPlaceHolder("Start writing your story here...")
    editor.Wrapping = fyne.TextWrapWord

    // Create a container for the preview
    previewContainer := container.NewVBox()

    // Update preview when text changes
    var lastContent string
    editor.OnChanged = func(content string) {
        if content == lastContent {
            return
        }
        lastContent = content
        
        // Clear previous preview
        previewContainer.Objects = nil
        
        // Format the text for preview
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
                previewContainer.Add(textObj)
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
            previewContainer.Add(lineContainer)
        }
        
        previewContainer.Refresh()
    }

    // Create split view with editor and preview
    split := container.NewHSplit(editor, container.NewScroll(previewContainer))
    split.SetOffset(0.5)

    myWindow.SetContent(split)
    myWindow.Resize(fyne.NewSize(800, 600))
    myWindow.ShowAndRun()
}