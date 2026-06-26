package main

import (
	"belajar-golang-dasar/database"
	"belajar-golang-dasar/handlers"
	"log"
	"net/http"
)

func main() {
	// 1. Inisialisasi Database MongoDB
	database.ConnectDB()

	// 2. Routing Internal Endpoint (Aman dari CORS karna satu domain)
	http.HandleFunc("/internal/documents", handlers.DocumentHandler)

	// 3. Menyajikan file statis dari hasil build React (.html, .js, .css)
	fs := http.FileServer(http.Dir("./frontend/dist"))
	http.Handle("/", fs)

	log.Println("🚀 Server Pillbox Monolith berjalan stabil di http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
