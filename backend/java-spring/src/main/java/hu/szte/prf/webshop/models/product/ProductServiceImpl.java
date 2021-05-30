package hu.szte.prf.webshop.models.product;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void addProduct(Product product) {
        this.productRepository.save(product);
    }

    @Override
    public List<Product> getAllProduct() {
        List<Product> list = this.productRepository.findAll();
        return list;
    }

    @Override
    public Product getProductById(int id) {
        Product product = this.productRepository.findById(id).get();
        return product;
    }

    @Override
    public void deleteProductById(int id) {
        this.productRepository.deleteById(id);
    }

    @Override
    public List<String> getAllId() {
        List<String> ids = this.productRepository.findAllIds();
        return ids;
    }

}
