package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"golang.org/x/net/html"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct now tracks the current file name and extension.
type App struct {
	ctx                 context.Context
	currentFilename     string
	currentFileExtension string
}

// NewApp creates a new App application struct.
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// getFileExtension returns the lower-cased extension (without the dot) of a filename.
func getFileExtension(filename string) string {
	ext := filepath.Ext(filename) // e.g., ".txt"
	if ext != "" {
		return strings.ToLower(ext[1:]) // Remove the dot
	}
	return ""
}

// SaveText saves the given text to a file.
func (a *App) SaveText(filename, text string) error {
	// Update current filename and extension.
	a.currentFilename = filename
	a.currentFileExtension = getFileExtension(filename)
	return os.WriteFile(filename, []byte(text), 0644)
}

// OpenText opens a file and returns its content.
// It also updates the current filename and file format.
func (a *App) OpenText(filename string) (string, error) {
	content, err := os.ReadFile(filename)
	if err != nil {
		return "", err
	}
	a.currentFilename = filename
	a.currentFileExtension = getFileExtension(filename)
	return string(content), nil
}

// SaveCurrentFile saves text directly to the existing file without changing its extension.
func (a *App) SaveCurrentFile(filename, text string) error {
	fmt.Printf("SaveCurrentFile called with filename: %s\n", filename)
	
	if filename == "" {
		return fmt.Errorf("no filename provided")
	}

	// Use the provided filename (assumed to have the correct extension)
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

	// Update our stored state
	a.currentFilename = filename
	a.currentFileExtension = getFileExtension(filename)

	fmt.Printf("Successfully verified save of file: %s (size: %d bytes)\n", filename, len(content))
	return nil
}

// SaveAs saves the current text to a new file (copy) under a different name or format.
func (a *App) SaveAs(text string) (string, error) {
	// Open the save dialog for the user to choose a new name/format.
	newFilename, err := a.SaveFileDialog()
	if err != nil {
		return "", err
	}

	// Write the current text to the new file.
	if err := os.WriteFile(newFilename, []byte(text), 0644); err != nil {
		return "", fmt.Errorf("failed to write file: %w", err)
	}

	// Update the current file state to reflect the new file.
	a.currentFilename = newFilename
	a.currentFileExtension = getFileExtension(newFilename)

	return newFilename, nil
}


// OpenFileDialog opens a file dialog to select a file.
// The filters now include .txt, .html, and common document formats.
func (a *App) OpenFileDialog() (string, error) {
	filename, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open File",
		Filters: []runtime.FileFilter{
			{DisplayName: "Text Files", Pattern: "*.txt"},
			{DisplayName: "HTML Files", Pattern: "*.html"},
			{DisplayName: "Document Files", Pattern: "*.doc;*.docx;*.pdf;*.odt"},
		},
	})
	if err != nil {
		return "", err
	}
	// Update the current file state.
	a.currentFilename = filename
	a.currentFileExtension = getFileExtension(filename)
	return filename, nil
}

// SaveFileDialog opens a file dialog to save a file.
// It uses the current file extension if available.
func (a *App) SaveFileDialog() (string, error) {
	// Choose a default filename based on the current extension.
	defaultName := "untitled.txt"
	if a.currentFileExtension != "" {
		defaultName = "untitled." + a.currentFileExtension
	}
	filename, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save File",
		DefaultFilename: defaultName,
		Filters: []runtime.FileFilter{
			{DisplayName: "Text Files", Pattern: "*.txt"},
			{DisplayName: "HTML Files", Pattern: "*.html"},
			{DisplayName: "Document Files", Pattern: "*.doc;*.docx;*.pdf;*.odt"},
		},
	})
	if err != nil {
		return "", err
	}
	// Update our stored state.
	a.currentFilename = filename
	a.currentFileExtension = getFileExtension(filename)
	return filename, nil
}

// CalculateStatistics calculates word count, header count, and page count.
func (a *App) CalculateStatistics(text string) map[string]interface{} {
	fmt.Println("🚀 CalculateStatistics called")

	// Remove HTML tags for word counting.
	re := regexp.MustCompile(`<[^>]*>`)
	cleanText := re.ReplaceAllString(text, "")

	words := strings.Fields(cleanText)
	wordCount := len(words)

	// Define words per page.
	wordsPerPage := 300
	pageCount := (wordCount / wordsPerPage) + 1

	headerPositions := []map[string]interface{}{}

	// Regex to match headers.
	headerRe := regexp.MustCompile(`<(h[1-6])([^>]*)>(.*?)</h[1-6]>`)
	matches := headerRe.FindAllStringSubmatchIndex(text, -1)

	for _, match := range matches {
		if len(match) < 8 {
			fmt.Println("⚠️ Skipping invalid match:", match)
			continue
		}

		headerTag := text[match[2]:match[3]]
		headerAttrs := text[match[4]:match[5]]
		headerText := text[match[6]:match[7]]

		// Normalize header text.
		headerText = html.UnescapeString(headerText)
		headerText = strings.TrimSpace(headerText)

		// Extract the ID attribute.
		idRegex := regexp.MustCompile(`id="([^"]+)"`)
		idMatch := idRegex.FindStringSubmatch(headerAttrs)
		headerId := ""
		if len(idMatch) > 1 {
			headerId = idMatch[1]
		} else {
			headerId = fmt.Sprintf("%s-%d", headerTag, len(headerPositions))
		}

		wordsBeforeHeader := len(strings.Fields(cleanText[:match[0]]))
		headerPage := (wordsBeforeHeader / wordsPerPage) + 1

		headerPositions = append(headerPositions, map[string]interface{}{
			"id":   headerId,
			"tag":  headerTag,
			"text": headerText,
			"page": headerPage,
		})
	}

	return map[string]interface{}{
		"wordCount":       wordCount,
		"headerCount":     len(headerPositions),
		"pageCount":       pageCount,
		"headerPositions": headerPositions,
	}
}
