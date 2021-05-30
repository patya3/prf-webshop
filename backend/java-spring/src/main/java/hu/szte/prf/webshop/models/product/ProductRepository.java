package hu.szte.prf.webshop.models.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query(value = "SELECT id FROM products", nativeQuery = true)
    List<String> findAllIds();
}
