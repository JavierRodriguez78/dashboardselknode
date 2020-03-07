package main

import (
	"fmt"
	"time"

	"github.com/interactive-solutions/go-logrus-elasticsearch"
	"github.com/olivere/elastic"
	"github.com/sirupsen/logrus"
)

func main() {
	// Create logger
	logger := logrus.New()

	// Create elastic client
	client, err := elastic.NewSimpleClient(elastic.SetURL("http://127.0.0.1:9200"))
	if err != nil {
		logger.WithError(err).Fatal("Failed to construct elasticsearch client")
	}

	// Create logger with 15 seconds flush interval
	hook, err := elastic_logrus.NewElasticHook(client, "some-host", logrus.DebugLevel, func() string {
		return fmt.Sprintf("%s-%s", "some-index", time.Now().Format("2006-01-02"))
	}, time.Second*15)

	if err != nil {
		logger.WithError(err).Fatal("Failed to create elasticsearch hook for logger")
	}

	logger.Hooks.Add(hook)
	logger.Info("All done")
}
