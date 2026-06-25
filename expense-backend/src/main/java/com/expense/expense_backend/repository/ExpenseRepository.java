package com.expense.expense_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.expense_backend.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long>  {
    List<Expense> findByUser_Id(Long userId);
} 
