---
title: "Advanced Java Programming (AJP)"
pubDate: 2025-09-18
description: "Collections, lambda expressions, streams, multithreading, and advanced OOP concepts."
categories: ["Java", "ITAcademy", "Programming"]
slug: advanced-java-programming
---

# Advanced Java Programming (AJP)

After completing Core Java, this subject introduced me to more advanced features of the Java language and the JDK.
It deepened my understanding of object-oriented programming and modern Java practices.

## Topics I studied

- Generics and type safety
- Collections Framework (List, Set, Map, Queue) in detail
- Exception handling best practices
- File I/O (reading and writing data)
- Multithreading and concurrency basics
- Lambda expressions and functional programming
- Streams API for data processing

## My experience

The most challenging part was understanding **multithreading** and dealing with concurrency issues.
What I found most useful were **lambda expressions and streams**, which make the code shorter, cleaner, and easier to maintain.

## Code Example (Streams + Lambda)

```java
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Gordan", "Mila", "Marija", "Ivan");

        // Print names starting with 'M'
        names.stream()
             .filter(name -> name.startsWith("M"))
             .forEach(System.out::println);
    }
}
```
