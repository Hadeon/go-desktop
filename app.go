package main

import (
	"context"
	"fmt"
	"os"
	"regexp"
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
func (a *App) CalculateStatistics(text string) map[string]interface{} {
	fmt.Println("🚀 CalculateStatistics called")

	// Remove HTML tags for word counting
	re := regexp.MustCompile(`<[^>]*>`)
	cleanText := re.ReplaceAllString(text, "")

	// Split the cleaned text into words
	words := strings.Fields(cleanText)
	wordCount := len(words)

	// Define words per page
	wordsPerPage := 300
	pageCount := (wordCount / wordsPerPage) + 1

	// Track headers while iterating through the words
	headerPositions := []map[string]interface{}{}

	// Regex to match headers (works without \1 backreference)
	headerRe := regexp.MustCompile(`<(h[1-6])[^>]*>(.*?)</h[1-6]>`)

	// Find all headers in the text
	matches := headerRe.FindAllStringSubmatchIndex(text, -1)

	for index, match := range matches {
			// Extract header details
			headerTag := text[match[2]:match[3]]
			headerText := text[match[4]:match[5]]

			// Calculate page number based on words before this header
			wordsBeforeHeader := len(strings.Fields(cleanText[:match[0]]))
			headerPage := (wordsBeforeHeader / wordsPerPage) + 1

			// Store the header along with its assigned page
			headerPositions = append(headerPositions, map[string]interface{}{
					"id":   fmt.Sprintf("%s-%d", headerTag, index),
					"tag":  headerTag,
					"text": headerText,
					"page": headerPage,
			})

			fmt.Printf("✅ Found header: %s on page %d (Words before: %d)\n", headerText, headerPage, wordsBeforeHeader)
	}

	fmt.Printf("📊 Final header positions: %v\n", headerPositions)

	return map[string]interface{}{
			"wordCount":       wordCount,
			"headerCount":     len(headerPositions),
			"pageCount":       pageCount,
			"headerPositions": headerPositions,
	}
}