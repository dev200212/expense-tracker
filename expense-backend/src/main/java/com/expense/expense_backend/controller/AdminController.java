package com.expense.expense_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.expense.expense_backend.model.Expense;

import com.expense.expense_backend.model.User;

import com.expense.expense_backend.repository.ExpenseRepository;

import com.expense.expense_backend.repository.UserRepository;

@RestController

@RequestMapping("/admin")

@CrossOrigin(origins = "http://localhost:5173")

public class AdminController {

    @Autowired

    private UserRepository userRepo;

    @Autowired

    private ExpenseRepository expenseRepo;



@PutMapping("/users/{id}")
public User updateUser(@PathVariable Long id, @RequestBody User user) {
    User oldUser = userRepo.findById(id).orElse(null);

    if (oldUser == null) {
        return null;
    }

    oldUser.setEmail(user.getEmail());
    oldUser.setFirstName(user.getFirstName());
    oldUser.setLastName(user.getLastName());
    oldUser.setPhoneNumber(user.getPhoneNumber());
    oldUser.setRole(user.getRole());

    return userRepo.save(oldUser);
}

    @GetMapping("/dashboard")
public Map<String, Object> dashboard() {
   Map<String, Object> map = new HashMap<>();
   List<User> users = userRepo.findAll();
   List<Expense> expenses = expenseRepo.findAll();
   double totalAmount = expenses.stream()
           .mapToDouble(Expense::getAmount)
           .sum();
   map.put("totalUsers", users.size());
   map.put("totalExpenses", expenses.size());
   map.put("totalAmount", totalAmount);
   return map;
}

    @GetMapping("/users")

    public List<User> getAllUsers() {

        return userRepo.findAll();

    }

    @GetMapping("/users/{id}")

    public User getUser(@PathVariable Long id) {

        return userRepo.findById(id).orElse(null);

    }

    @DeleteMapping("/users/{id}")

    public String deleteUser(@PathVariable Long id) {

        User user = userRepo.findById(id).orElse(null);

        if (user == null) {

            return "User Not Found";

        }

        userRepo.delete(user);

        return "User Deleted Successfully";

    }

    // ================= EXPENSES =================

    @GetMapping("/expenses")

    public List<Expense> getAllExpenses() {

        return expenseRepo.findAll();

    }

    @DeleteMapping("/expenses/{id}")

    public String deleteExpense(@PathVariable Long id) {

        if (!expenseRepo.existsById(id)) {

            return "Expense Not Found";

        }

        expenseRepo.deleteById(id);

        return "Expense Deleted Successfully";

    }

    @PutMapping("/expenses/{id}")

    public Expense updateExpense(@PathVariable Long id,

                                 @RequestBody Expense expense) {

        Expense oldExpense = expenseRepo.findById(id).orElse(null);

        if (oldExpense == null) {

            return null;

        }

        expense.setId(id);

        // Existing user preserve karo

        expense.setUser(oldExpense.getUser());

        return expenseRepo.save(expense);

    }

}
 