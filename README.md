LEARNING BACKTRACE WEB APP

A lot of times when I’m studying a topic in math, I realize I don’t have the requisite knowledge to learn from whatever source I’m using (textbook, MIT notes, video, etc). I try to find a source for that prerequisite thing, but then I get distracted, etc. I want to create a web app that organizes the sources I use, and the questions/topics they answer. 

Essentially it should be a big directed graph, with two kinds of nodes:

Resource Nodes - these should have the following properties (or the underlying objects should, at least):
- Id
- Name
- Resource type (video, pdf, etc) 
- (optional) topic tag like Topology or Number Theory
- Link to resource

Question Nodes - these are questions I have when studying a resource that I realize are fundamental to understanding it. An example might be, “What is a Principal Ideal Domain?” edges flow FROM question nodes TO the resources that require me to know the answer. When I find a new resource that answers the question, I want to draw an arrow FROM that resource TO the question it should (hopefully) answer. If it is a big or complicated question, it may have several resources flowing into it. These should have the following properties:
- Id 
- Question
- (optional) topic tag like Topology or Number Theory
- Answered Level, ranging from 0 (still no idea) to 1 (I completely understand the answer now)
- -(optional) note where I can explain what I know or what’s tripping me up in my own words. 

The app should have an easy interface for creating/updating new nodes, and directed edges. 
