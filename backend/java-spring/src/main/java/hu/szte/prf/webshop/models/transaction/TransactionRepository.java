package hu.szte.prf.webshop.models.transaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;



public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    
    @Query(value = "SELECT * FROM transactions WHERE user_id = ?1", nativeQuery = true)
    List<Transaction> getUserOrders(String userId);
}
