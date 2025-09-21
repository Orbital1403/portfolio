---
title: "Java Desktop Application Development (JAD)"
pubDate: 2025-09-18
description: "Building GUI-based applications with Swing, AWT, event handling, and database connectivity."
categories: ["Java", "ITAcademy", "Desktop Apps"]
slug: java-desktop-application-development
---

# Java Desktop Application Development (JAD)

After completing Core and Advanced Java, this subject introduced me to building **desktop applications** with graphical user interfaces (GUIs).
It gave me practical knowledge on how to combine Java logic with user-friendly windows, forms, and database integration.

## Topics I studied

- Swing and AWT components (buttons, text fields, menus, tables)
- Layout managers (BorderLayout, FlowLayout, GridLayout)
- Event handling and listeners
- Dialog boxes and forms
- Working with images and custom rendering
- JDBC (Java Database Connectivity) for database integration
- MVC pattern in desktop applications

## My experience

At first, understanding layout managers and how they affect component placement was challenging.
But once I practiced with real examples, it became clearer.
The most valuable part was connecting applications to a **MySQL database** using JDBC — this made the apps truly interactive and practical.

## Code Example (Simple Swing App)

```java
import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Hello Desktop App");
        JButton button = new JButton("Click me!");

        button.addActionListener(e -> JOptionPane.showMessageDialog(frame, "Hello, Gordan!"));

        frame.add(button);
        frame.setSize(300, 200);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}
```
