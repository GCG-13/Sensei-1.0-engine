# 🥋 Sensei AI: Sensei-1.0 Engine

> **Advanced Symbolic AI & Expert System for Karate-do Excellence.**

[](https://www.typescriptlang.org/)
[](https://github.com/GCG-13/Sensei-1.0-engine)
[](https://opensource.org/licenses/MIT)

**Sensei AI** es una arquitectura de **Inteligencia Artificial Simbólica** diseñada para actuar como un tutor experto en Karate-do. A diferencia de los modelos generativos probabilísticos (LLMs), este motor utiliza un sistema determinista de reglas y scoring para garantizar respuestas precisas, de baja latencia y funcionamiento 100% offline.

## 🧠 Filosofía del Modelo: Sensei-1.0

El modelo **Sensei-1.0** representa el salto de un script procedimental a un **Motor de Inferencia Modular**. Está diseñado bajo los principios **SOLID**, permitiendo que el cerebro de la IA sea agnóstico a la interfaz y a la base de conocimiento.

### Pilares Técnicos:

  * **Determinismo:** Respuestas basadas en hechos técnicos de Karate, no en alucinaciones.
  * **Privacidad:** Procesamiento local sin necesidad de APIs externas.
  * **Eficiencia:** Motor de búsqueda optimizado con complejidad algorítmica reducida.

## 🛠️ Arquitectura y Desafíos Técnicos

### 1\. Motor de Inferencia (Scoring System)

Implementé un algoritmo de **puntuación por relevancia** que pondera la intención del usuario mediante tres capas de validación:

  * **Exact Match (1.0):** Coincidencia total de términos técnicos.
  * **Keyword Weights (0.8):** Identificación de palabras clave críticas en el contexto marcial.
  * **Fuzzy Matching (0.6):** Tolerancia a errores ortográficos mediante **Distancia de Levenshtein**, permitiendo que términos complejos como *Gyakuzuki* sean detectados incluso con typos.

### 2\. Procesamiento de Lenguaje Natural (NLP) Local

El sistema realiza una sanitización profunda antes de la consulta:

  * **Normalización Unicode:** Eliminación de diacríticos para compatibilidad total.
  * **Tokenización Inteligente:** Limpieza de *stop-words* para extraer la semántica real.
  * **Pattern Matching:** Validaciones específicas para rangos (Kyu/Dan) y comandos de dojo.

### 3\. Ingeniería de Software (Production-Ready)

  * **SOLID & Modularidad:** Clases especializadas (`NLPProcessor`, `InferenceEngine`, `DOMHandler`).
  * **TypeScript 5.2+:** Tipado estricto para garantizar la integridad de la base de conocimiento.
  * **Vite:** Pipeline de construcción ultra rápido para despliegues modernos.

## 🎯 Problem Statement

El entrenamiento tradicional enfrenta la falta de guía técnica personalizada fuera del dojo. **Sensei AI** resuelve esto mediante:

  * ✅ Filtrado de técnicas por rango del estudiante.
  * ✅ Sugerencias pedagógicas basadas en prerrequisitos.
  * ✅ Acceso instantáneo a historia y etimología del Karate-do.


## 🚀 Quick Start

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/GCG-13/Sensei-1.0-engine.git

# Entrar a la carpeta
cd Sensei-1.0-engine

# Instalar dependencias
npm install
```

### Desarrollo

```bash
npm run dev
```


## 📊 Métricas de Rendimiento

  * **Latencia de respuesta:** \< 50ms (Core Engine).
  * **Precisión NLP:** \> 85% con soporte de fuzzy matching.
  * **Footprint:** \< 2MB de base de conocimiento JSON.

## 📈 Roadmap & Visión

Este motor es la base de la marca **Sensei AI**. Las próximas iteraciones incluirán:

  * [ ] **Persistencia Local:** Historial de aprendizaje del estudiante.
  * [ ] **Voice Synthesis:** Comandos de voz para entrenamiento manos libres.
  * [ ] **Multimedia Integration:** Visualización dinámica de Katas.


**Desarrollado por Gustavo (GCG-13)** *Arquitecto de Software enfocado en Sistemas Expertos y Tecnología Aplicada al Deporte.*

**Osu\! ¡Buen entrenamiento\!** 🥋
