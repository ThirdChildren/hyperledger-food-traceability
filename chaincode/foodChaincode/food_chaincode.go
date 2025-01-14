package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Batch rappresenta un lotto nella filiera alimentare
type Batch struct {
	ID          string    `json:"id"`
	ProductType string    `json:"productType"`
	Producer    string    `json:"producer"`
	Timestamp   string    `json:"timestamp"`
	CurrentNode string    `json:"currentNode"`
	Status      string    `json:"status"`
}

// SmartContract definisce il chaincode
type SmartContract struct {
	contractapi.Contract
}

// CreateBatch crea un nuovo lotto
func (s *SmartContract) CreateBatch(ctx contractapi.TransactionContextInterface, id string, productType string, producer string, currentNode string) error {
	// Controlla se il lotto esiste già
	exists, err := s.BatchExists(ctx, id)
	if err != nil {
		return fmt.Errorf("errore durante il controllo esistenza lotto: %v", err)
	}
	if exists {
		return fmt.Errorf("il lotto con ID %s esiste già", id)
	}

	// Crea il timestamp
	timestamp := time.Now().Format(time.RFC3339)
	fmt.Printf("Creazione lotto con ID: %s, timestamp: %s\n", id, timestamp)

	// Crea il lotto
	batch := Batch{
		ID:          id,
		ProductType: productType,
		Producer:    producer,
		Timestamp:   timestamp,
		CurrentNode: currentNode,
		Status:      "Created",
	}
	fmt.Printf("Dati del lotto: %+v\n", batch)

	// Serializza il lotto in JSON
	batchJSON, err := json.Marshal(batch)
	if err != nil {
		return fmt.Errorf("errore durante la serializzazione JSON: %v", err)
	}

	// Salva il lotto nello stato ledger
	err = ctx.GetStub().PutState(id, batchJSON)
	if err != nil {
		return fmt.Errorf("errore durante il salvataggio del lotto: %v", err)
	}

	fmt.Printf("Lotto con ID %s salvato con successo.\n", id)
	return nil
}


// UpdateBatchState aggiorna lo stato o la posizione di un lotto
func (s *SmartContract) UpdateBatchState(ctx contractapi.TransactionContextInterface, id string, newNode string, newStatus string) error {
	batchJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("impossibile leggere il lotto: %v", err)
	}
	if batchJSON == nil {
		return fmt.Errorf("il lotto con ID %s non esiste", id)
	}

	var batch Batch
	err = json.Unmarshal(batchJSON, &batch)
	if err != nil {
		return err
	}

	batch.CurrentNode = newNode
	batch.Status = newStatus
	batch.Timestamp = time.Now().Format(time.RFC3339)

	updatedBatchJSON, err := json.Marshal(batch)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, updatedBatchJSON)
}

// GetBatchByID recupera i dettagli di un lotto specifico
func (s *SmartContract) GetBatchByID(ctx contractapi.TransactionContextInterface, id string) (*Batch, error) {
	batchJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("impossibile leggere il lotto: %v", err)
	}
	if batchJSON == nil {
		return nil, fmt.Errorf("il lotto con ID %s non esiste", id)
	}

	var batch Batch
	err = json.Unmarshal(batchJSON, &batch)
	if err != nil {
		return nil, err
	}

	return &batch, nil
}

// GetBatchHistory recupera la cronologia delle modifiche di un lotto
func (s *SmartContract) GetBatchHistory(ctx contractapi.TransactionContextInterface, id string) ([]map[string]interface{}, error) {
	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var history []map[string]interface{}
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var record map[string]interface{}
		err = json.Unmarshal(response.Value, &record)
		if err != nil {
			return nil, err
		}

		record["txId"] = response.TxId
		record["timestamp"] = response.Timestamp
		record["isDeleted"] = response.IsDelete

		history = append(history, record)
	}

	return history, nil
}

func (s *SmartContract) BatchExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
    batchJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return false, fmt.Errorf("errore durante il controllo esistenza lotto: %v", err)
    }
    return batchJSON != nil, nil
}

// GetAllBatches ritorna tutti i lotti presenti nello stato ledger
func (s *SmartContract) GetAllBatches(ctx contractapi.TransactionContextInterface) ([]*Batch, error) {
    // Definisci un intervallo vuoto per ottenere tutti i record
    resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
    if err != nil {
        return nil, fmt.Errorf("failed to get batches: %v", err)
    }
    defer resultsIterator.Close()

    var batches []*Batch
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, fmt.Errorf("error reading batch: %v", err)
        }

        var batch Batch
        err = json.Unmarshal(queryResponse.Value, &batch)
        if err != nil {
            return nil, fmt.Errorf("error unmarshalling batch: %v", err)
        }
        batches = append(batches, &batch)
    }
    return batches, nil
}


func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Errore durante la creazione del chaincode: %v\n", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Errore durante l'avvio del chaincode: %v\n", err)
	}
}
