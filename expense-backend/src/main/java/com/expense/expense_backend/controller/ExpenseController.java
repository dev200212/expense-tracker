package com.expense.expense_backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.expense_backend.model.Expense;
import com.expense.expense_backend.model.User;
import com.expense.expense_backend.repository.ExpenseRepository;
import com.expense.expense_backend.repository.UserRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;




@CrossOrigin(origins ="http://localhost:5173")
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private List<Expense> expenses = new ArrayList<>();

    @Autowired
     private ExpenseRepository expenseRepository;

     @Autowired
     private UserRepository userRepo;

    @PostMapping
    public String addExpense(@RequestBody Expense expense, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        expense.setUser(user);
        expenseRepository.save(expense);
        return "Expense Added";
    }

    @GetMapping
    public List<Expense> getExpenses(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        return expenseRepository.findByUser_Id(user.getId());
    }
    
    @DeleteMapping("/delete/{id}")
    public String delteExpense(@PathVariable Long id,Authentication authentication){
        Expense expense = expenseRepository.findById(id).orElseThrow();
        if(!expense.getUser().getEmail().equals(authentication.getName())){
            return "Unauthorized";
        }
        expenseRepository.delete(expense);

        return "Expense Deleted";
    }

   @PutMapping("/update/{id}")
public Expense updateExpense(@PathVariable Long id,
                            @RequestBody Expense expense,
                            Authentication authentication) {
   Expense oldExpense = expenseRepository.findById(id).orElseThrow();
   if (!oldExpense.getUser().getEmail().equals(authentication.getName())) {
       throw new RuntimeException("Unauthorized");
   }
   expense.setId(id);
   expense.setUser(oldExpense.getUser());
   return expenseRepository.save(expense);
}



    
    
    
}
