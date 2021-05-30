package hu.szte.prf.webshop.models.transaction;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import hu.szte.prf.webshop.models.product.Product;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    /* @Column(name = "user_id") */
    private String userId;

    private int totalPrice;

    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "products_transactions", joinColumns = {
            @JoinColumn(name = "transaction_id") }, inverseJoinColumns = { @JoinColumn(name = "product_id") })
    @JsonIgnoreProperties("transactions")
    private Set<Product> products = new HashSet<>();

    public Transaction() {
    }

    public Transaction(int id, String userId, int totalPrice, Date date) {
        this.id = id;
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.date = date;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void addProduct(Product product) {
        products.add(product);
        product.getTransactions().add(this);
    }

    @Override
    public String toString() {
        return "Transaction [amount=" + totalPrice + ", date=" + date + ", id=" + id + ", products=" + products
                + ", userId=" + userId + "]";
    }

}
