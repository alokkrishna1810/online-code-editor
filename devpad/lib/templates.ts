export interface LanguageTemplate {
  name: string;
  language: string;
  extension: string;
  description: string;
  category: "web" | "programming" | "data";
  icon: string;
  content: string;
}

export const languageTemplates: LanguageTemplate[] = [
  // Web Development Templates
  {
    name: "HTML5 Boilerplate",
    language: "html",
    extension: "html",
    description: "Modern HTML5 document structure with semantic elements",
    category: "web",
    icon: "🌐",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Your page description">
    <title>Document Title</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <h1>Your Website</h1>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Welcome</h2>
            <p>Your content goes here.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Your Website. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: "CSS Reset & Grid",
    language: "css",
    extension: "css",
    description: "Modern CSS with reset, custom properties, and grid layout",
    category: "web",
    icon: "🎨",
    content: `/* CSS Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Custom Properties */
:root {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --background-color: #ffffff;
    --text-color: #1f2937;
    --border-radius: 8px;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Base Styles */
body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

/* Layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

.grid {
    display: grid;
    gap: var(--spacing-md);
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Utilities */
.text-center { text-align: center; }
.text-primary { color: var(--primary-color); }
.bg-primary { background-color: var(--primary-color); }
.rounded { border-radius: var(--border-radius); }
.shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }

/* Responsive */
@media (max-width: 768px) {
    .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
    }
}`,
  },
  {
    name: "Modern JavaScript",
    language: "javascript",
    extension: "js",
    description: "ES6+ JavaScript with modern patterns and best practices",
    category: "web",
    icon: "⚡",
    content: `// Modern JavaScript Template
'use strict';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application initialized');
    init();
});

// Application initialization
function init() {
    setupEventListeners();
    loadData();
}

// Event listeners
function setupEventListeners() {
    // Example: Button click handler
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

// Event handlers
function handleButtonClick(event) {
    const button = event.target;
    console.log('Button clicked:', button.textContent);
    
    // Add loading state
    button.classList.add('loading');
    
    // Simulate async operation
    setTimeout(() => {
        button.classList.remove('loading');
        showNotification('Action completed!', 'success');
    }, 1000);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification notification--\${type}\`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// API functions
async function loadData() {
    try {
        // Example API call
        const response = await fetch('/api/data');
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to load data');
        }
        
        renderData(data);
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Failed to load data', 'error');
    }
}

function renderData(data) {
    // Render data to DOM
    console.log('Data loaded:', data);
}

// Export for modules (if needed)
// export { init, showNotification };`,
  },

  // Programming Language Templates
  {
    name: "Python Hello World",
    language: "python",
    extension: "py",
    description: "Basic Python script with common patterns",
    category: "programming",
    icon: "🐍",
    content: `#!/usr/bin/env python3
"""
Python Template
A basic Python script demonstrating common patterns and best practices.
"""

import sys
import os
from typing import List, Dict, Optional


def main() -> None:
    """Main function - entry point of the program."""
    print("🐍 Hello from Python!")
    
    # Example: Working with data
    numbers = [1, 2, 3, 4, 5]
    result = process_numbers(numbers)
    print(f"Processed numbers: {result}")
    
    # Example: User input
    name = get_user_input("Enter your name: ")
    greet_user(name)


def process_numbers(numbers: List[int]) -> List[int]:
    """Process a list of numbers and return squared values."""
    return [num ** 2 for num in numbers]


def get_user_input(prompt: str) -> str:
    """Get user input with error handling."""
    try:
        return input(prompt).strip()
    except KeyboardInterrupt:
        print("\\nProgram interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"Error getting input: {e}")
        return ""


def greet_user(name: str) -> None:
    """Greet the user with a personalized message."""
    if name:
        print(f"Hello, {name}! Welcome to Python programming! 🎉")
    else:
        print("Hello, anonymous user! 👋")


class Calculator:
    """A simple calculator class demonstrating OOP in Python."""
    
    def __init__(self):
        self.history: List[str] = []
    
    def add(self, a: float, b: float) -> float:
        """Add two numbers."""
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def subtract(self, a: float, b: float) -> float:
        """Subtract two numbers."""
        result = a - b
        self.history.append(f"{a} - {b} = {result}")
        return result
    
    def get_history(self) -> List[str]:
        """Get calculation history."""
        return self.history.copy()


if __name__ == "__main__":
    main()`,
  },
  {
    name: "Java Hello World",
    language: "java",
    extension: "java",
    description: "Basic Java class with main method and common patterns",
    category: "programming",
    icon: "☕",
    content: `import java.util.*;
import java.util.stream.Collectors;

/**
 * Java Template
 * A basic Java class demonstrating common patterns and best practices.
 */
public class Main {
    private static final Scanner scanner = new Scanner(System.in);
    
    public static void main(String[] args) {
        System.out.println("☕ Hello from Java!");
        
        // Example: Working with collections
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        List<Integer> squared = processNumbers(numbers);
        System.out.println("Processed numbers: " + squared);
        
        // Example: User interaction
        System.out.print("Enter your name: ");
        String name = getUserInput();
        greetUser(name);
        
        // Example: Using custom class
        Calculator calc = new Calculator();
        double result = calc.add(10.5, 5.3);
        System.out.println("Calculation result: " + result);
        
        scanner.close();
    }
    
    /**
     * Process a list of numbers using streams
     */
    private static List<Integer> processNumbers(List<Integer> numbers) {
        return numbers.stream()
                .map(n -> n * n)
                .collect(Collectors.toList());
    }
    
    /**
     * Get user input with error handling
     */
    private static String getUserInput() {
        try {
            return scanner.nextLine().trim();
        } catch (Exception e) {
            System.err.println("Error reading input: " + e.getMessage());
            return "";
        }
    }
    
    /**
     * Greet the user with a personalized message
     */
    private static void greetUser(String name) {
        if (name != null && !name.isEmpty()) {
            System.out.println("Hello, " + name + "! Welcome to Java programming! 🎉");
        } else {
            System.out.println("Hello, anonymous user! 👋");
        }
    }
}

/**
 * A simple calculator class demonstrating OOP in Java
 */
class Calculator {
    private List<String> history;
    
    public Calculator() {
        this.history = new ArrayList<>();
    }
    
    public double add(double a, double b) {
        double result = a + b;
        history.add(String.format("%.2f + %.2f = %.2f", a, b, result));
        return result;
    }
    
    public double subtract(double a, double b) {
        double result = a - b;
        history.add(String.format("%.2f - %.2f = %.2f", a, b, result));
        return result;
    }
    
    public double multiply(double a, double b) {
        double result = a * b;
        history.add(String.format("%.2f * %.2f = %.2f", a, b, result));
        return result;
    }
    
    public double divide(double a, double b) {
        if (b == 0) {
            throw new IllegalArgumentException("Division by zero is not allowed");
        }
        double result = a / b;
        history.add(String.format("%.2f / %.2f = %.2f", a, b, result));
        return result;
    }
    
    public List<String> getHistory() {
        return new ArrayList<>(history);
    }
}`,
  },
  {
    name: "C++ Hello World",
    language: "cpp",
    extension: "cpp",
    description: "Modern C++ program with STL and best practices",
    category: "programming",
    icon: "⚙️",
    content: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>
#include <stdexcept>

/**
 * C++ Template
 * A basic C++ program demonstrating modern C++ patterns and best practices.
 */

class Calculator {
private:
    std::vector<std::string> history;

public:
    double add(double a, double b) {
        double result = a + b;
        history.push_back(std::to_string(a) + " + " + std::to_string(b) + " = " + std::to_string(result));
        return result;
    }
    
    double subtract(double a, double b) {
        double result = a - b;
        history.push_back(std::to_string(a) + " - " + std::to_string(b) + " = " + std::to_string(result));
        return result;
    }
    
    double multiply(double a, double b) {
        double result = a * b;
        history.push_back(std::to_string(a) + " * " + std::to_string(b) + " = " + std::to_string(result));
        return result;
    }
    
    double divide(double a, double b) {
        if (b == 0) {
            throw std::invalid_argument("Division by zero is not allowed");
        }
        double result = a / b;
        history.push_back(std::to_string(a) + " / " + std::to_string(b) + " = " + std::to_string(result));
        return result;
    }
    
    const std::vector<std::string>& getHistory() const {
        return history;
    }
};

// Function to process numbers using STL algorithms
std::vector<int> processNumbers(const std::vector<int>& numbers) {
    std::vector<int> result;
    result.reserve(numbers.size());
    
    std::transform(numbers.begin(), numbers.end(), std::back_inserter(result),
                   [](int n) { return n * n; });
    
    return result;
}

// Function to get user input with error handling
std::string getUserInput(const std::string& prompt) {
    std::cout << prompt;
    std::string input;
    
    try {
        std::getline(std::cin, input);
        return input;
    } catch (const std::exception& e) {
        std::cerr << "Error reading input: " << e.what() << std::endl;
        return "";
    }
}

// Function to greet user
void greetUser(const std::string& name) {
    if (!name.empty()) {
        std::cout << "Hello, " << name << "! Welcome to C++ programming! 🎉" << std::endl;
    } else {
        std::cout << "Hello, anonymous user! 👋" << std::endl;
    }
}

int main() {
    std::cout << "⚙️ Hello from C++!" << std::endl;
    
    // Example: Working with vectors and algorithms
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    auto squared = processNumbers(numbers);
    
    std::cout << "Processed numbers: ";
    for (size_t i = 0; i < squared.size(); ++i) {
        std::cout << squared[i];
        if (i < squared.size() - 1) std::cout << ", ";
    }
    std::cout << std::endl;
    
    // Example: User interaction
    std::string name = getUserInput("Enter your name: ");
    greetUser(name);
    
    // Example: Using smart pointers and custom class
    auto calc = std::make_unique<Calculator>();
    
    try {
        double result = calc->add(10.5, 5.3);
        std::cout << "Calculation result: " << result << std::endl;
        
        // Display history
        const auto& history = calc->getHistory();
        if (!history.empty()) {
            std::cout << "Calculation history:" << std::endl;
            for (const auto& entry : history) {
                std::cout << "  " << entry << std::endl;
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}`,
  },
  {
    name: "C Hello World",
    language: "c",
    extension: "c",
    description: "Basic C program with standard library functions",
    category: "programming",
    icon: "🔧",
    content: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

/**
 * C Template
 * A basic C program demonstrating common patterns and best practices.
 */

#define MAX_NAME_LENGTH 100
#define MAX_NUMBERS 10

// Function prototypes
void greet_user(const char* name);
void process_numbers(int* numbers, int size, int* result);
double calculate(double a, double b, char operation);
char* get_user_input(const char* prompt);

int main() {
    printf("🔧 Hello from C!\\n");
    
    // Example: Working with arrays
    int numbers[MAX_NUMBERS] = {1, 2, 3, 4, 5};
    int squared[MAX_NUMBERS];
    int size = 5;
    
    process_numbers(numbers, size, squared);
    
    printf("Processed numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d", squared[i]);
        if (i < size - 1) printf(", ");
    }
    printf("\\n");
    
    // Example: User interaction
    char* name = get_user_input("Enter your name: ");
    if (name != NULL) {
        greet_user(name);
        free(name); // Don't forget to free allocated memory
    }
    
    // Example: Calculator functionality
    double result = calculate(10.5, 5.3, '+');
    printf("Calculation result: %.2f\\n", result);
    
    return 0;
}

/**
 * Greet the user with a personalized message
 */
void greet_user(const char* name) {
    if (name != NULL && strlen(name) > 0) {
        printf("Hello, %s! Welcome to C programming! 🎉\\n", name);
    } else {
        printf("Hello, anonymous user! 👋\\n");
    }
}

/**
 * Process an array of numbers (square each number)
 */
void process_numbers(int* numbers, int size, int* result) {
    if (numbers == NULL || result == NULL) {
        fprintf(stderr, "Error: NULL pointer passed to process_numbers\\n");
        return;
    }
    
    for (int i = 0; i < size; i++) {
        result[i] = numbers[i] * numbers[i];
    }
}

/**
 * Simple calculator function
 */
double calculate(double a, double b, char operation) {
    switch (operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b != 0) {
                return a / b;
            } else {
                fprintf(stderr, "Error: Division by zero\\n");
                return 0.0;
            }
        case '^':
            return pow(a, b);
        default:
            fprintf(stderr, "Error: Unknown operation '%c'\\n", operation);
            return 0.0;
    }
}

/**
 * Get user input with dynamic memory allocation
 */
char* get_user_input(const char* prompt) {
    printf("%s", prompt);
    
    char* input = malloc(MAX_NAME_LENGTH * sizeof(char));
    if (input == NULL) {
        fprintf(stderr, "Error: Memory allocation failed\\n");
        return NULL;
    }
    
    if (fgets(input, MAX_NAME_LENGTH, stdin) != NULL) {
        // Remove newline character if present
        size_t len = strlen(input);
        if (len > 0 && input[len - 1] == '\\n') {
            input[len - 1] = '\\0';
        }
        return input;
    } else {
        free(input);
        fprintf(stderr, "Error: Failed to read input\\n");
        return NULL;
    }
}`,
  },
];

export class TemplateManager {
  static getTemplatesByCategory(category?: string): LanguageTemplate[] {
    if (!category) {
      return languageTemplates;
    }
    return languageTemplates.filter(
      (template) => template.category === category
    );
  }

  static getTemplatesByLanguage(language: string): LanguageTemplate[] {
    return languageTemplates.filter(
      (template) => template.language === language
    );
  }

  static getTemplate(name: string): LanguageTemplate | undefined {
    return languageTemplates.find((template) => template.name === name);
  }

  static getAvailableLanguages(): string[] {
    return [...new Set(languageTemplates.map((template) => template.language))];
  }

  static getAvailableCategories(): string[] {
    return [...new Set(languageTemplates.map((template) => template.category))];
  }

  static createFileFromTemplate(
    templateName: string,
    fileName?: string
  ): { name: string; content: string; extension: string } | null {
    const template = this.getTemplate(templateName);
    if (!template) {
      return null;
    }

    const name = fileName || `new-file.${template.extension}`;
    return {
      name,
      content: template.content,
      extension: template.extension,
    };
  }
}
