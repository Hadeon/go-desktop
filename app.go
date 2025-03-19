package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// SaveText saves the given text to a file
func (a *App) SaveText(filename, text string) error {
	return os.WriteFile(filename, []byte(text), 0644)
}

// OpenText opens a text file and returns its content
func (a *App) OpenText(filename string) (string, error) {
	content, err := os.ReadFile(filename)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

// SaveCurrentFile saves text directly to an existing file
func (a *App) SaveCurrentFile(filename, text string) error {
	fmt.Printf("SaveCurrentFile called with filename: %s\n", filename)
	fmt.Printf("Content to save (first 100 chars): %.100s...\n", text)
	
	if filename == "" {
		return fmt.Errorf("no filename provided")
	}

	// Write the file
	if err := os.WriteFile(filename, []byte(text), 0644); err != nil {
		fmt.Printf("Write error: %v\n", err)
		return fmt.Errorf("failed to write file: %w", err)
	}

	// Verify the file was written correctly
	content, err := os.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("failed to verify file write: %w", err)
	}
	
	if string(content) != text {
		return fmt.Errorf("file content verification failed")
	}

	fmt.Printf("Successfully verified save of file: %s (size: %d bytes)\n", filename, len(content))
	return nil
}

// OpenFileDialog opens a file dialog to select a file
func (a *App) OpenFileDialog() (string, error) {
	filename, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open File",
		Filters: []runtime.FileFilter{
			{DisplayName: "Text Files", Pattern: "*.txt"},
			{DisplayName: "Document Files", Pattern: "*.doc;*.docx;*.pdf;*.odt"},
		},
	})
	if err != nil {
		return "", err
	}
	return filename, nil
}

// SaveFileDialog opens a file dialog to save a file
func (a *App) SaveFileDialog() (string, error) {
	filename, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save File",
		DefaultFilename: "untitled.txt",
	})
	if err != nil {
		return "", err
	}
	return filename, nil
}

// CalculateStatistics calculates word count, number of headers, and number of pages
func (a *App) CalculateStatistics(text string) []int {
	wordCount := len(strings.Fields(text))
	headerCount := strings.Count(text, "<h1>") + strings.Count(text, "<h2>") + strings.Count(text, "<h3>") + strings.Count(text, "<h4>") + strings.Count(text, "<h5>") + strings.Count(text, "<h6>")
	pageCount := (wordCount / 300) + 1 // Assuming 300 words per page

	return []int{wordCount, headerCount, pageCount}
}
