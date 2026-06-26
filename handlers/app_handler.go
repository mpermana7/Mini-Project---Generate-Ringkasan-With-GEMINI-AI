package handlers

import (
	"belajar-golang-dasar/database"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Document struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string             `bson:"title" json:"title"`
	Category  string             `bson:"category" json:"category"`
	Content   string             `bson:"content" json:"content"`
	AISummary string             `bson:"ai_summary" json:"ai_summary"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

func generateAISummary(content string) string {
	// Ganti dengan API Key Gemini
	apiKey := "AQ.Ab8RN6JL3WwHczwCG3OguvQlN2A1zBPTt2mFnMFbczk5V9v6sg"

	apiURL := "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

	promptText := fmt.Sprintf(
		"Buat ringkasan singkat maksimal 3 kalimat dari teks berikut:\n\n%s",
		content,
	)

	requestPayload := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]interface{}{
					{
						"text": promptText,
					},
				},
			},
		},
	}

	requestBody, err := json.Marshal(requestPayload)
	if err != nil {
		return "[AI Error] Gagal membuat payload request."
	}

	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	// Retry maksimal 3 kali jika Gemini sedang sibuk
	for attempt := 1; attempt <= 3; attempt++ {

		req, err := http.NewRequest(
			"POST",
			apiURL,
			bytes.NewBuffer(requestBody),
		)

		if err != nil {
			return "[AI Error] Gagal membuat request HTTP."
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-goog-api-key", apiKey)

		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("Gemini Connection Error: %v\n", err)

			if attempt < 3 {
				time.Sleep(2 * time.Second)
				continue
			}

			return "[AI Error] Tidak dapat terhubung ke server Gemini."
		}

		defer resp.Body.Close()

		// Jika server Gemini sedang sibuk
		if resp.StatusCode == 503 {
			fmt.Printf(
				"Gemini sedang sibuk, percobaan ke-%d dari 3...\n",
				attempt,
			)

			if attempt < 3 {
				time.Sleep(2 * time.Second)
				continue
			}

			return "Ringkasan AI sementara tidak tersedia karena server Gemini sedang sibuk."
		}

		// Error selain 503
		if resp.StatusCode != http.StatusOK {
			var errDetail map[string]interface{}
			json.NewDecoder(resp.Body).Decode(&errDetail)

			fmt.Printf(
				"⚠️ Gemini API Error Debug: %+v\n",
				errDetail,
			)

			return fmt.Sprintf(
				"[AI Error] Gemini menolak request dengan status %d.",
				resp.StatusCode,
			)
		}

		var result map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			return "[AI Error] Gagal membaca response Gemini."
		}

		if candidates, ok := result["candidates"].([]interface{}); ok && len(candidates) > 0 {
			if firstCandidate, ok := candidates[0].(map[string]interface{}); ok {
				if contentMap, ok := firstCandidate["content"].(map[string]interface{}); ok {
					if parts, ok := contentMap["parts"].([]interface{}); ok && len(parts) > 0 {
						if firstPart, ok := parts[0].(map[string]interface{}); ok {
							if aiText, ok := firstPart["text"].(string); ok {
								return aiText
							}
						}
					}
				}
			}
		}

		return "[AI Error] Format response Gemini tidak dikenali."
	}

	return "Ringkasan AI sementara tidak tersedia."
}

func DocumentHandler(w http.ResponseWriter, r *http.Request) {
	collection := database.DB.Collection("documents")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	w.Header().Set("Content-Type", "application/json")

	switch r.Method {

	case "GET":
		cursor, err := collection.Find(ctx, bson.M{})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)

		docs := []Document{}

		for cursor.Next(ctx) {
			var doc Document
			if err := cursor.Decode(&doc); err == nil {
				docs = append(docs, doc)
			}
		}

		json.NewEncoder(w).Encode(docs)

	case "POST":
		var doc Document

		if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		doc.ID = primitive.NewObjectID()
		doc.CreatedAt = time.Now()

		// Membuat ringkasan menggunakan Gemini
		doc.AISummary = generateAISummary(doc.Content)

		_, err := collection.InsertOne(ctx, doc)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(doc)

	default:
		http.Error(
			w,
			"Method tidak diizinkan",
			http.StatusMethodNotAllowed,
		)
	}
}
