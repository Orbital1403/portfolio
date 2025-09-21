---
title: "Core Java Programming (JCP)"
pubDate: 2025-09-18
description: "Basics of OOP, collections, working with classes and objects."
categories: ["Java", "ITAcademy", "Programming"]
slug: core-advanced-programming
---

# Core Java Programming (JCP)

This was my first serious subject at ITAcademy and also my introduction to Java.
I learned the basics of object-oriented programming:

- Classes and objects
- Inheritance and polymorphism
- Abstract classes and interfaces
- Collections (List, Set, Map)

## Code Example

```java
class Animal {
    void sound() { System.out.println("Some sound..."); }
}
class Dog extends Animal {
    @Override void sound() { System.out.println("Woof!"); }
}
public class Main {
    public static void main(String[] args) {
        Animal dog = new Dog();
        dog.sound(); // Woof!
    }
}
```
