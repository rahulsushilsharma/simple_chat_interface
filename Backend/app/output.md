10

11

12

13

19

20

2 22324215 26 27

# Agent Service - Architecture Document

## Table of Contents o.[Concept Glossary &amp; Reading Guide](#0-concept-glossary--reading-guide)

1.[High-Level Architecture Overview](#l-high-level-architecture-overview)

2.[Agent Invocation Pipeline](#2-agent-invocation-pipeline)

3.[Skill Invocation Pipeline](#3-skill-invocation-pipeline）

4.[Entity Recognition Pipeline](#4-entity-recognition-pipeline)

s.[Infrastructure Architecture](#s-infrastructure-architecture)

6.[Key Design Patterns](#6-key-design-patterns)

7.[Key Files Reference](#7-key-files-reference)

8.[Configuration Options](#8-configuration-options)

## O. Concept Glossary &amp; Reading Guide

&gt;**hho is this document for?**

&gt;You know Python basics and have used Aws at Least once.You may have heard of "LLM agents" but LangGraph, ReAct Loops,

Human-in-the-Loop interrupts, and multi-agent Supervisor patterns are new to you. Every section follows a four-part pattern:

**（1) What is X,(2) Why does it exist,（3) How it works generally,(4) How Agent5ervice uses it specifically.** Read this 50

first; it defines every term you will encounter Later.

## Core Concepts

### ReAct （Reason + Act)

Ln23.Col1

Spaces:4UTF-8 LF  Markdowm```
##0.Concept Gosay & Re#org Goo **What is it** ReAct is a pattern for LLM agents where the model alternates between *reasoning*（"I need to look up the document") and &acting* (calling a tool that actually fetches it). The cycle repeats until the LLM decides it has a final answer. 203132 **Why does it exist?** A plain LLM can only answer from its training data. ReAct gives it the ability to call external tools -APIs, databases, search engines - and incorporate those results into its next reasoning step. This makes the agent far more capable and current than any static model. 133435367383949442 **How it works generally:** User query →LLM reasons:"I need tool x" →Tool x is called, result returned →LLM reasons again with new context →LlM reasons:"I have enough,here is the answer →Final response returned 43 44 **How AgentService uses it:** 45 The Reactiworkflow class (app/workflow/workflow_controller_llm_bind.py) implements ReAct. The LLM is bound to a list of LambdaTool objects.Each tool wraps an AWS Lambda function. The LLM emits a tool_calls field in its response; LangGraph routes execution to the appropriate Lambda, returns the result as a ToolMessage, and feeds it back to the LLM - repeating HOOURAAG until tool_callsis empty. 46 47 484958 ### LangGraph
```ent