package main

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"strings"

	"golang.org/x/net/html"

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

	// Regex to match headers (captures tag name, attributes, and inner text)
	headerRe := regexp.MustCompile(`<(h[1-6])([^>]*)>(.*?)</h[1-6]>`)

	// Find all headers in the text
	matches := headerRe.FindAllStringSubmatchIndex(text, -1)

	for _, match := range matches {
		if len(match) < 8 {
			fmt.Println("⚠️ Skipping invalid match due to incorrect indices:", match)
			continue
		}

		headerTag := text[match[2]:match[3]]  // Captures "h1", "h2", etc.
		headerAttrs := text[match[4]:match[5]] // Captures attributes inside the tag
		headerText := text[match[6]:match[7]]  // Captures the inner text of the header

		// **Normalize Header Text**
		headerText = html.UnescapeString(headerText) // Decode HTML entities
		headerText = strings.TrimSpace(headerText)  // Trim extra spaces

		// Extract the ID attribute using regex
		idRegex := regexp.MustCompile(`id="([^"]+)"`)
		idMatch := idRegex.FindStringSubmatch(headerAttrs)

		headerId := ""
		if len(idMatch) > 1 {
			headerId = idMatch[1] // Extracts the ID from `id="some-id"`
		} else {
			headerId = fmt.Sprintf("%s-%d", headerTag, len(headerPositions)) // Fallback ID
		}

		// Find word position to determine page number
		wordsBeforeHeader := len(strings.Fields(cleanText[:match[0]]))
		headerPage := (wordsBeforeHeader / wordsPerPage) + 1

		// Store header info
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