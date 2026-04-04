#!/usr/bin/env node

/**
 * Project: Sensei IA - Symbolic AI Engine for Karate-do
 * Author: GCG-13 (Gustavo Alberto Martínez Parra)
 * Architecture: Deterministic Inference & XAI (Explainable AI)
 * License: MIT
 * Repository: https://github.com/GCG-13/Sensei-1.0-engine
 * 
 * Sensei AI CLI - Command Line Interface
 * 
 * Herramienta de línea de comandos para interactuar con Sensei AI
 * Permite instalación global y ejecución desde cualquier terminal
 * 
 * @author GCG-13 Studio
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Importar el motor (simulado para CLI)
class SenseiCLI {
  constructor() {
    this.knowledgeBase = this.loadKnowledgeBase();
    this.version = '1.0.0';
  }

  loadKnowledgeBase() {
    try {
      const kbPath = path.join(__dirname, '..', 'data', 'knowledge_base.json');
      return JSON.parse(fs.readFileSync(kbPath, 'utf8'));
    } catch (error) {
      console.error('❌ Error cargando base de conocimiento:', error.message);
      process.exit(1);
    }
  }

  normalizeText(text) {
    return text.toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  fuzzyMatch(str1, str2) {
    const normalized1 = this.normalizeText(str1);
    const normalized2 = this.normalizeText(str2);
    
    if (normalized1 === normalized2) return 1.0;
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return 0.8;
    
    // Levenshtein distance
    const distance = this.levenshteinDistance(normalized1, normalized2);
    const maxLength = Math.max(normalized1.length, normalized2.length);
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  search(query) {
    // Guard clauses para robustez
    if (!query) return null;
    if (typeof query !== 'string') {
      try {
        query = String(query);
      } catch (e) {
        return null;
      }
    }
    
    const normalizedQuery = this.normalizeText(query);
    let bestMatch = null;
    let bestScore = 0;

    // 🧠 DETECCIÓN DE COACHING - LÓGICA AVANZADA
    const coachingKeywords = ['mejorar', 'corregir', 'arreglar', 'fix', 'mejora', 'error', 'fallo', 'problema', 'mal', 'incorrecto'];
    const isCoachingRequest = coachingKeywords.some(keyword => normalizedQuery.includes(keyword));
    
    // 🔍 DETECCIÓN DE INTENCIÓN ESPECÍFICA - NUEVO
    const intentPatterns = {
      biomechanics: ['biomecanica', 'control', 'puntos', 'movimiento', 'como se hace', 'tecnica perfecta', 'ejecucion'],
      breathing: ['respirar', 'respiracion', 'kokyu', 'aire', 'exhalar', 'inhalar'],
      kime: ['kime', 'contraccion', 'tension', 'fuerza', 'potencia', 'explosion'],
      mistakes: ['errores', 'error', 'mal', 'incorrecto', 'falla', 'problema'],
      katas: ['kata', 'katas', 'practicar', 'donde practico', 'secuencia'],
      followups: ['sigue', 'despues', 'combo', 'combinacion', 'encadenamiento'],
      bunkai: ['aplicacion', 'real', 'combate', 'cuando uso', 'sirve para'],
      prerequisites: ['requiere', 'necesito', 'antes de', 'prerrequisito', 'previo'],
      targets: ['golpea', 'impacto', 'target', 'donde golpea', 'anatomia', 'kyusho']
    };
    
    // Detectar intención específica
    let detectedIntent = null;
    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        detectedIntent = intent;
        break;
      }
    }
    
    // Si es una solicitud de coaching, buscar la técnica mencionada
    if (isCoachingRequest) {
      for (const [name, technique] of Object.entries(this.knowledgeBase.techniqueDetails || {})) {
        if (normalizedQuery.includes(this.normalizeText(name))) {
          // Encontró la técnica en una pregunta de coaching
          return {
            type: 'coaching',
            name: name,
            technique: technique,
            matchType: 'coaching',
            searchSource: 'coaching_intelligence',
            intent: detectedIntent
          };
        }
      }
    }
    
    // 🔍 BÚSQUEDA CON INTENCIÓN ESPECÍFICA - NUEVO
    for (const [name, technique] of Object.entries(this.knowledgeBase.techniqueDetails || {})) {
      const similarity = this.fuzzyMatch(normalizedQuery, this.normalizeText(name));
      if (similarity > 0.7) {
        // Si detectó intención específica, devolver resultado contextualizado
        if (detectedIntent) {
          return {
            type: 'technique_with_intent',
            name: name,
            technique: technique,
            matchType: similarity === 1.0 ? 'exact' : 'fuzzy',
            searchSource: 'techniqueDetails',
            intent: detectedIntent
          };
        }
        
        // Búsqueda normal si no hay intención específica
        if (similarity > bestScore) {
          bestScore = similarity;
          bestMatch = {
            type: 'technique',
            name: name,
            technique: technique,
            matchType: similarity === 1.0 ? 'exact' : 'fuzzy',
            searchSource: 'techniqueDetails'
          };
        }
      }
    }

    // Búsqueda secundaria: En techniquesByRank si no se encontró nada
    if (!bestMatch) {
      for (const [rank, categories] of Object.entries(this.knowledgeBase.techniquesByRank || {})) {
        for (const [category, techniques] of Object.entries(categories)) {
          for (const technique of techniques) {
            const similarity = this.fuzzyMatch(normalizedQuery, this.normalizeText(technique));
            if (similarity > bestScore && similarity > 0.7) {
              bestScore = similarity;
              bestMatch = {
                type: 'technique',
                name: technique,
                technique: {
                  descripcion: `Técnica de ${category} del nivel ${rank}`,
                  uso: 'Consulta detallada no disponible',
                  cinturon: rank,
                  category: category,
                  keywords: [],
                  incomplete: true
                },
                matchType: similarity === 1.0 ? 'exact' : 'fuzzy',
                searchSource: 'techniquesByRank'
              };
            }
          }
        }
      }
    }

    // Buscar en vocabulario
    for (const [term, definition] of Object.entries(this.knowledgeBase.vocabulary || {})) {
      const similarity = this.fuzzyMatch(normalizedQuery, this.normalizeText(term));
      if (similarity > bestScore && similarity > 0.7) {
        bestScore = similarity;
        bestMatch = {
          type: 'vocabulary',
          term: term,
          definition: definition,
          matchType: similarity === 1.0 ? 'exact' : 'fuzzy',
          searchSource: 'vocabulary'
        };
      }
    }

    return bestMatch;
  }

  formatResponse(result) {
    if (!result) {
      return `❌ No encontré información sobre tu consulta.

🤔 **Análisis de la Búsqueda:**
- Tu consulta fue procesada pero no encontré coincidencias suficientes
- Umbral de similitud actual: 70%
- Búsquedas realizadas: techniqueDetails, techniquesByRank, vocabulary

💡 **Sugerencias:**
- Intenta con términos más específicos: "Oi Zuki", "Mae Geri", "Gedan Barai"
- Revisa la ortografía: "Uchi Uke" (no "Uchiuke")
- Prueba con palabras clave: "bloqueo", "patada", "puño"

📚 **Técnicas Disponibles:**
- **Te Waza** (técnicas de puño): Oi Zuki, Gyaku Zuki, Sanbon Zuki
- **Ashi Waza** (patadas): Mae Geri, Yoko Geri, Mawashi Geri
- **Fusegui Waza** (bloqueos): Uchi Uke, Soto Uke, Gedan Barai`;
    }

    if (result.type === 'technique_with_intent') {
      let response = `🎯 **${result.name}** - Análisis Específico\n\n`;
      
      // 🎯 RESPUESTAS CONTEXTUALIZADAS SEGÚN INTENCIÓN
      switch (result.intent) {
        case 'biomechanics':
          response += `🎯 **Análisis Biomecánico de ${result.name}:**\n\n`;
          if (result.technique.biomechanics) {
            if (result.technique.biomechanics.controlPoints) {
              response += `📍 **Puntos de Control Críticos:**\n`;
              result.technique.biomechanics.controlPoints.forEach((point, index) => {
                response += `   ${index + 1}. ${point}\n`;
              });
            }
            if (result.technique.biomechanics.forceVector) {
              response += `\n⚡ **Vector de Fuerza:** ${result.technique.biomechanics.forceVector}\n`;
            }
            if (result.technique.biomechanics.stance_dependency) {
              response += `🥋 **Postura Requerida:** ${result.technique.biomechanics.stance_dependency}\n`;
            }
          } else {
            response += `📚 Biomecánica detallada no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'breathing':
          response += `🌬️ **Respiración en ${result.name}:**\n\n`;
          if (result.technique.kokyu_and_kime && result.technique.kokyu_and_kime.breathing) {
            response += `💨 **Patrón Respiratorio:** ${result.technique.kokyu_and_kime.breathing}\n`;
          } else {
            response += `📚 Información de respiración no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'kime':
          response += `💥 **Kime (Foco y Potencia) en ${result.name}:**\n\n`;
          if (result.technique.kokyu_and_kime && result.technique.kokyu_and_kime.kime) {
            response += `💥 **Contracción Muscular:** ${result.technique.kokyu_and_kime.kime}\n`;
          } else {
            response += `📚 Información de Kime no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'mistakes':
          response += `⚠️ **Errores Comunes en ${result.name}:**\n\n`;
          if (result.technique.commonMistakes && result.technique.commonMistakes.length > 0) {
            result.technique.commonMistakes.forEach((mistake, index) => {
              response += `   ${index + 1}. ${mistake}\n`;
            });
            response += `\n💡 **Consejo Rápido:** Concéntrate en los primeros 2 errores, corrigen el 80% de los problemas.\n`;
          } else {
            response += `📚 Información de errores comunes no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'katas':
          response += `📜 **${result.name} en Katas:**\n\n`;
          if (result.technique.kata_presence && result.technique.kata_presence.length > 0) {
            response += `📚 **Presente en los siguientes Katas:**\n`;
            result.technique.kata_presence.forEach((kata, index) => {
              response += `   ${index + 1}. ${kata}\n`;
            });
            response += `\n💡 **Recomendación:** Practica primero en Heian Shodan, luego avanza a los demás.\n`;
          } else {
            response += `📚 Información de katas no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'followups':
          response += `⛓️ **Encadenamientos Tácticos después de ${result.name}:**\n\n`;
          if (result.technique.follow_ups && result.technique.follow_ups.length > 0) {
            response += `🔄 **Técnicas que siguen naturalmente:**\n`;
            result.technique.follow_ups.forEach((follow_up, index) => {
              response += `   ${index + 1}. ${follow_up}\n`;
            });
            response += `\n💡 **Estrategia:** Elige el follow-up según la reacción del oponente.\n`;
          } else {
            response += `📚 Información de encadenamientos no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'bunkai':
          response += `🎭 **Aplicación Real (Bunkai) de ${result.name}:**\n\n`;
          if (result.technique.bunkai) {
            response += `🎯 **Uso en Combate:** ${result.technique.bunkai}\n`;
          } else {
            response += `📚 Información de bunkai no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'prerequisites':
          response += `📖 **Requisitos Previos para ${result.name}:**\n\n`;
          if (result.technique.prerequisites && result.technique.prerequisites.length > 0) {
            response += `🎓 **Debes dominar primero:**\n`;
            result.technique.prerequisites.forEach((req, index) => {
              response += `   ${index + 1}. ${req}\n`;
            });
            response += `\n🔥 **Plan de Acción:** Dedica 2-3 semanas a estos prerrequisitos antes de perfeccionar ${result.name}.\n`;
          } else {
            response += `📚 Información de prerrequisitos no disponible para ${result.name}.\n`;
          }
          break;
          
        case 'targets':
          response += `🎯 **Puntos de Impacto (Kyusho) de ${result.name}:**\n\n`;
          if (result.technique.kyusho_targets && result.technique.kyusho_targets.length > 0) {
            response += `📍 **Targets Anatómicos:**\n`;
            result.technique.kyusho_targets.forEach((target, index) => {
              response += `   ${index + 1}. ${target}\n`;
            });
            response += `\n⚠️ **Advertencia:** Estos puntos son vulnerables, úsalos con responsabilidad.\n`;
          } else {
            response += `📚 Información de targets no disponible para ${result.name}.\n`;
          }
          break;
          
        default:
          response += `📚 Información general de ${result.name}:\n\n`;
          response += `📝 ${result.technique.descripcion}\n`;
          response += `🎯 ${result.technique.uso}\n`;
      }
      
      return response;
    }

    if (result.type === 'coaching') {
      let response = `🎓 **COACHING PERSONALIZADO - ${result.name}**\n\n`;
      response += `🥋 **Técnica:** ${result.name}\n`;
      response += `📝 **Descripción:** ${result.technique.descripcion}\n`;
      response += `🎯 **Uso:** ${result.technique.uso}\n`;
      
      // 🚨 ERRORES COMUNES - PRIORIDAD EN COACHING
      if (result.technique.commonMistakes && result.technique.commonMistakes.length > 0) {
        response += `\n\n⚠️ **ERRORES COMUNES - CONCENTRACIÓN ESPECÍFICA:**`;
        result.technique.commonMistakes.forEach((mistake, index) => {
          response += `\n   ${index + 1}. ${mistake}`;
        });
        response += `\n\n💡 **FOCO PRINCIPAL:** Asegúrate de no sobrepasar la línea de tu hombro y mantén el Hikite fuerte. Estos dos puntos corrigen el 80% de los errores en ${result.name}.`;
      }
      
      // 🎯 BIOMECÁNICA PARA CORRECCIÓN
      if (result.technique.biomechanics && result.technique.biomechanics.controlPoints) {
        response += `\n\n🎯 **PUNTOS DE CONTROL BIOMECÁNICO:**`;
        result.technique.biomechanics.controlPoints.forEach((point, index) => {
          response += `\n   ${index + 1}. ${point}`;
        });
      }
      
      // 💡 COACHING TIPS - INTELIGENCIA EXPLICABLE
      if (result.technique.coachingTips && result.technique.coachingTips.length > 0) {
        response += `\n\n💡 **CONSEJOS DE MEJORA INMEDIATA:**`;
        result.technique.coachingTips.forEach((tip, index) => {
          response += `\n   ${index + 1}. ${tip}`;
        });
      }
      
      // 📚 PRERREQUISITOS - SI FALTAN
      if (result.technique.prerequisites && result.technique.prerequisites.length > 0) {
        response += `\n\n📚 **REQUISITOS A DOMINAR PRIMERO:**`;
        result.technique.prerequisites.forEach((req, index) => {
          response += `\n   ${index + 1}. ${req}`;
        });
        response += `\n\n🎯 **PLAN DE ACCIÓN:** Dedica 2 semanas a dominar estos requisitos antes de perfeccionar ${result.name}.`;
      }
      
      response += `\n\n🔥 **MÉTODO DE PRÁCTICA:**\n`;
      response += `1. Realiza 50 repeticiones lentas enfocándote en los errores comunes\n`;
      response += `2. Grábate en video y compárate con los puntos de control\n`;
      response += `3. Pide feedback a tu Sensei sobre los 3 errores principales\n`;
      response += `4. Practica con pareja aplicando el bunkai real`;
      
      return response;
    }

    if (result.type === 'technique') {
      let response = `🥋 **${result.name}** (${result.matchType} match)\n\n`;
      
      // 📊 INFORMACIÓN BÁSICA (SIEMPRE)
      response += `📝 Descripción: ${result.technique.descripcion}\n`;
      response += `🎯 Uso: ${result.technique.uso}\n`;
      response += `🥋 Cinturón: ${result.technique.cinturon}\n`;
      response += `📂 Categoría: ${result.technique.category}`;
      
      // 🔍 INFORMACIÓN DE DEBUGGING XAI
      if (result.searchSource) {
        response += `\n🔍 Fuente: ${result.searchSource}`;
      }
      
      if (result.technique.incomplete) {
        response += `\n⚠️ Información limitada - Técnica encontrada en estructura jerárquica`;
      }
      
      // � RESPUESTA CONTEXTUALIZADA (SI HAY INTENCIÓN)
      if (result.type === 'technique_with_intent' && result.intent) {
        response += this.formatIntentSpecificResponse(result.technique, result.intent);
      } else {
        // 📚 RESPUESTA COMPLETA (SIN INTENCIÓN ESPECÍFICA)
        response += this.formatCompleteAdvancedResponse(result.technique);
      }
      
      // 🎓 SUGERENCIA PEDAGÓGICA TRADICIONAL
      if (result.technique.cinturon && 
          (result.technique.cinturon.includes('Dan') || result.technique.cinturon.includes('5 kyu'))) {
        response += `\n\n🎓 **Sugerencia del Sensei:** Esta es una técnica avanzada. Te recomiendo dominar primero Oi Zuki y Mae Geri (técnicas básicas de 10° Kyu).`;
      }
      
      return response;
    }

    if (result.type === 'vocabulary') {
      return `📚 **${result.term.toUpperCase()}** (${result.matchType} match)\n\n${result.definition}`;
    }

    return result;
  }

  showHelp() {
    console.log(`
🥋 Sensei AI CLI v${this.version} - Asistente de Karate-do

USO:
  sensei-ia <consulta>              Realizar una consulta
  sensei-ia --help               Mostrar esta ayuda
  sensei-ia --version            Mostrar versión
  sensei-ia --interactive          Modo interactivo

EJEMPLOS:
  sensei-ia "¿Qué es Oi Zuki?"
  sensei-ia "significado de dojo"
  sensei-ia "hayán sodan"

MODO INTERACTIVO:
  Escribe 'exit' para salir del modo interactivo

📧 Contacto: gcg13games@gmail.com
🏢 GCG-13 Studio - Ingeniería Elite`);
  }

  showVersion() {
    console.log(`🥋 Sensei AI CLI v${this.version}`);
    console.log(`🏢 GCG-13 Studio - Ingeniería Elite`);
    console.log(`📧 Contacto: gcg13games@gmail.com`);
  }

  interactiveMode() {
    console.log('\n🥋 Modo Interactivo - Sensei AI CLI');
    console.log('💬 Escribe tu consulta (o "exit" para salir)\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = () => {
      rl.question('🤔 Consulta: ', (query) => {
        if (query.toLowerCase() === 'exit') {
          console.log('\n🙏 Osu! El conocimiento es un viaje sin fin.\n');
          rl.close();
          return;
        }

        if (query.trim()) {
          const result = this.search(query);
          const response = this.formatResponse(result);
          console.log('\n' + response + '\n');
        }

        askQuestion();
      });
    };

    askQuestion();
  }

  run() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const command = args[0];
    
    if (command === '--help' || command === '-h') {
      this.showHelp();
    } else if (command === '--version' || command === '-v') {
      this.showVersion();
    } else if (command === '--interactive' || command === '-i') {
      this.interactiveMode();
    } else {
      // Tratar como consulta
      const query = args.join(' ');
      const result = this.search(query);
      const response = this.formatResponse(result);
      console.log(response);
    }
  }
}

// Ejecutar CLI si se llama directamente
if (require.main === module) {
  const cli = new SenseiCLI();
  cli.run();
}

module.exports = SenseiCLI;
