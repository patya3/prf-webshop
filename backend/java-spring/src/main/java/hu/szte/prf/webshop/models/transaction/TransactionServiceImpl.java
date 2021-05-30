package hu.szte.prf.webshop.models.transaction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionServiceImpl implements TransactionService {

    TransactionRepository transactionRepository;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public void addTransaction(Transaction transaction) {
        this.transactionRepository.save(transaction);

    }

    @Override
    public List<Transaction> getAllTransactions(String userId) {
        // request only the transactions which belongs to the user provided.
        List<Transaction> list = this.transactionRepository.getUserOrders(userId);
        return list;
    }

    @Override
    public Transaction getTransactionById(int id) {
        Transaction transaction = this.transactionRepository.findById(id).get();
        return transaction;
    }

    @Override
    public void deleteTransactionById(int id) {
        this.transactionRepository.deleteById(id);

    }

}
