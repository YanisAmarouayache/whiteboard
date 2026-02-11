package config

import (
	"os"
)

type Config struct {
	Port        string
	Env         string
	DatabaseURL string
	JWTSecret   string
	JWTExpiry   string
	CORSOrigins string
}

func Load() Config {
	return Config{
		Port:        getEnv("PORT", "8080"),
		Env:         getEnv("ENV", "development"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/miro_clone?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "change-me"),
		JWTExpiry:   getEnv("JWT_EXPIRY", "24h"),
		CORSOrigins: getEnv("CORS_ORIGINS", "http://localhost:4200"),
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok {
		return v
	}
	return fallback
}
