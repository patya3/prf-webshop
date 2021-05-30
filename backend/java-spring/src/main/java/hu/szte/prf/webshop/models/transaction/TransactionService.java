package hu.szte.prf.webshop.models.transaction;

import java.util.List;

public interface TransactionService {
    void addTransaction(Transaction transaction);

    List<Transaction> getAllTransactions(String userId);

    Transaction getTransactionById(int id);

    void deleteTransactionById(int id);
}
