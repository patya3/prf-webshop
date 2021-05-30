package hu.szte.prf.webshop.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.szte.prf.webshop.models.product.Product;
import hu.szte.prf.webshop.models.product.ProductService;
import hu.szte.prf.webshop.models.transaction.Transaction;
import hu.szte.prf.webshop.models.transaction.TransactionService;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class TransactionController {

    TransactionService transactionService;
    ProductService productService;

    @Autowired
    public TransactionController(TransactionService transactionService, ProductService productService) {
        this.transactionService = transactionService;
        this.productService = productService;
    }

    @GetMapping("/orders")
    public List<Transaction> getOrders(@RequestParam String user_id) {
        try {
            return this.transactionService.getAllTransactions(user_id);
        } catch (Exception e) {
            System.err.println(e);
            return null;
        }
    }

    /* Save a transaction and products which are not in the database yet. */
    @PostMapping(path = "/orders", consumes = "application/json")
    public Map<String, Object> newTransaction(@RequestBody Transaction transaction) {
        /* All product_id in the postgresql db. */
        List<String> existingProductIDs = this.productService.getAllId();

        Map<String, Object> res = new HashMap<>();

        /* Iterate over products in the transaction, if a product not in the database, saves it. */
        for (Product p : transaction.getProducts()) {
            if (!existingProductIDs.contains(p.getId())) {
                try {
                    this.productService.addProduct(p);
                } catch (Exception e) {
                    System.out.println(e);
                    res.put("successfull", false);
                    res.put("error", "An error occured.");
                    return res;
                }
            }
        }

        /* Save the transaction and send response. */
        try {
            this.transactionService.addTransaction(transaction);
            res.put("successfull", true);
            res.put("msg", "Your order was successfull.");
            return res;
        } catch (Exception e) {
            System.out.println(e);
            res.put("successfull", false);
            res.put("error", "An error occured.");
            return res;
        }

    }

    @PostMapping(path = "/products", consumes = "application/json")
    public String newProduct(@RequestBody Product product) {
        try {
            this.productService.addProduct(product);
            return "Success";
        } catch (Exception e) {
            System.out.println(e);
            return "Error, check log";
        }
    }

}
