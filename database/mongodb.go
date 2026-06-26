package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Melakukan koneksi ke MongoDB lokal
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal("Gagal koneksi ke MongoDB:", err)
	}

	DB = client.Database("pillbox_db")
	log.Println("✅ Berhasil terhubung ke MongoDB!")
}
