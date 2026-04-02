#!/usr/bin/env node

/**
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
    const normalizedQuery = this.normalizeText(query);
    let bestMatch = null;
    let bestScore = 0;

    // Buscar en técnicas
    for (const [name, technique] of Object.entries(this.knowledgeBase.techniqueDetails || {})) {
      const similarity = this.fuzzyMatch(normalizedQuery, this.normalizeText(name));
      if (similarity > bestScore && similarity > 0.7) {
        bestScore = similarity;
        bestMatch = {
          type: 'technique',
          name: name,
          technique: technique,
          matchType: similarity === 1.0 ? 'exact' : 'fuzzy'
        };
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
          matchType: similarity === 1.0 ? 'exact' : 'fuzzy'
        };
      }
    }

    return bestMatch;
  }

  formatResponse(result) {
    if (!result) {
      return `❌ No encontré información sobre tu consulta.
      
💡 Intenta preguntar sobre:
   • Técnicas: Oi Zuki, Mae Geri, Gedan Barai
   • Vocabulario: dojo, sensei, oss
   • Historia: Shindo Jinen Ryu, origen del karate`;
    }

    if (result.type === 'technique') {
      let response = `🥋 **${result.name}** (${result.matchType} match)\n\n`;
      response += `📝 Descripción: ${result.technique.descripcion}\n`;
      response += `🎯 Uso: ${result.technique.uso}\n`;
      response += `🥋 Cinturón: ${result.technique.cinturon}\n`;
      response += `📂 Categoría: ${result.technique.category}`;
      
      // Sugerencia pedagógica
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
  sensei-ia "hayán shodan"

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
