---
title: "Java Web Application Development"
pubDate: 2025-09-18
description: "Building dynamic web applications with Servlets, JSP, JSTL, sessions, and MVC architecture."
categories: ["Java", "Web Development", "ITAcademy"]
slug: java-web-application-development
---

# Java Web Application Development

This subject introduced me to the fundamentals of creating **dynamic web applications** in Java.
It was the first step towards understanding how backend Java interacts with the web browser.

## Topics I studied

- Introduction to Java EE and web application architecture
- HTTP protocol basics (requests, responses, GET/POST methods)
- Servlets and deployment descriptor (`web.xml`)
- Annotations for simplifying configuration
- JavaServer Pages (JSP) for dynamic HTML generation
- Expression Language (EL) and JSTL (JSP Standard Tag Library)
- Custom tags in JSP
- HTML forms processing in Java
- Session and cookie management
- MVC design pattern in web applications
- Introduction to frameworks: Spring Web MVC and JSF basics

## My experience

At first, working directly with **Servlets** and manually handling requests and responses felt very low-level.
Learning **JSP + JSTL** made it much easier to build dynamic pages.
The concept of **sessions** was a turning point — I finally understood how user login and shopping carts work.

## Example: Simple Servlet

```java
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
        resp.setContentType("text/html");
        PrintWriter out = resp.getWriter();
        out.println("<h1>Hello from my first Servlet!</h1>");
    }
}
Example: JSP with Expression Language
jsp
Copy code
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
  <body>
    <h2>Welcome, ${user.name}!</h2>
    <p>Your session ID: ${pageContext.session.id}</p>
  </body>
</html>
```
