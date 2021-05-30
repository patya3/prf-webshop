package hu.szte.prf.webshop.models.product;

import java.util.List;

public interface ProductService {
    void addProduct(Product product);

    List<Product> getAllProduct();

    Product getProductById(int id);

    void deleteProductById(int id);

    List<String> getAllId();
}
