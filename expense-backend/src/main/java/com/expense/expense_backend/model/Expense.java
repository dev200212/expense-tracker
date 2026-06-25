package com.expense.expense_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
@Entity
@Table(name="expenses")
public class Expense {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private Double amount;
    private String date;
    @Transient
    private Long userId;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;


    public Expense() {
    }


    


    public Expense(Long id, String title, Double amount, String date, Long userId, User user) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.userId = userId;
        this.user = user;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    
}
