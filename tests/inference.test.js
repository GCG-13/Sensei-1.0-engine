/**
 * Sensei AI - Tests Unitarios de Inferencia
 * 
 * Verifica la robustez del motor de búsqueda y algoritmos de NLP
 * Tests diseñados para demostrar fiabilidad y precisión
 * 
 * @author GCG-13 Studio
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Importar el motor CLI para testing
const SenseiCLI = require('../src/cli.js');

describe('Sensei AI - Motor de Inferencia', () => {
  let sensei;

  beforeEach(() => {
    sensei = new SenseiCLI();
  });

  describe('🎯 Búsqueda Exacta', () => {
    test('debe encontrar Oi Zuki con consulta exacta', () => {
      const result = sensei.search('Oi Zuki');
      
      expect(result).not.toBeNull();
      expect(result.type).toBe('technique');
      expect(result.name).toBe('Oi Zuki');
      expect(result.matchType).toBe('exact');
      expect(result.technique.descripcion).toContain('puño directo');
    });

    test('debe encontrar vocabulario dojo con consulta exacta', () => {
      const result = sensei.search('dojo');
      
      expect(result).not.toBeNull();
      expect(result.type).toBe('vocabulary');
      expect(result.term).toBe('dojo');
      expect(result.matchType).toBe('exact');
      expect(result.definition).toContain('lugar de entrenamiento');
    });
  });

  describe('🔍 Búsqueda con Errores Tipográficos', () => {
    test('debe corregir "hayan sodan" → "Heian Shodan"', () => {
      const result = sensei.search('hayan sodan');
      
      expect(result).not.toBeNull();
      expect(result.matchType).toBe('fuzzy');
      expect(result.name).toBe('Heian Shodan');
    });

    test('debe corregir "oi zuk" → "Oi Zuki"', () => {
      const result = sensei.search('oi zuk');
      
      expect(result).not.toBeNull();
      expect(result.matchType).toBe('fuzzy');
      expect(result.name).toBe('Oi Zuki');
    });

    test('debe corregir "maye geri" → "Mae Geri"', () => {
      const result = sensei.search('maye geri');
      
      expect(result).not.toBeNull();
      expect(result.matchType).toBe('fuzzy');
      expect(result.name).toBe('Mae Geri');
    });
  });

  describe('🧮 Algoritmo Levenshtein', () => {
    test('debe calcular distancia correcta para strings idénticos', () => {
      const distance = sensei.levenshteinDistance('test', 'test');
      expect(distance).toBe(0);
    });

    test('debe calcular distancia correcta para strings diferentes', () => {
      const distance = sensei.levenshteinDistance('kitten', 'sitting');
      expect(distance).toBe(3);
    });

    test('debe calcular distancia correcta para errores tipográficos', () => {
      const distance = sensei.levenshteinDistance('oi zuk', 'oi zuki');
      expect(distance).toBe(1);
    });
  });

  describe('🎓 Sugerencias Pedagógicas', () => {
    test('debe sugerir técnica básica para consulta avanzada', () => {
      const result = sensei.search('Sanbon Zuki');
      const response = sensei.formatResponse(result);
      
      expect(response).toContain('Sugerencia del Sensei');
      expect(response).toContain('técnica avanzada');
      expect(response).toContain('Oi Zuki');
      expect(response).toContain('Mae Geri');
    });

    test('debe sugerir básicas para técnica de 1 Dan', () => {
      const result = sensei.search('Mawashi Geri');
      const response = sensei.formatResponse(result);
      
      expect(response).toContain('Sugerencia del Sensei');
      expect(response).toContain('técnica avanzada');
    });

    test('no debe sugerir para técnicas básicas', () => {
      const result = sensei.search('Oi Zuki');
      const response = sensei.formatResponse(result);
      
      expect(response).not.toContain('Sugerencia del Sensei');
      expect(response).not.toContain('técnica avanzada');
    });
  });

  describe('🛡️ Robustez y Manejo de Errores', () => {
    test('debe manejar consulta vacía', () => {
      const result = sensei.search('');
      expect(result).toBeNull();
    });

    test('debe manejar consulta nula', () => {
      const result = sensei.search(null);
      expect(result).toBeNull();
    });

    test('debe manejar consulta con caracteres especiales', () => {
      const result = sensei.search('¿Qué es Oi Zuki?');
      expect(result).not.toBeNull();
      expect(result.name).toBe('Oi Zuki');
    });

    test('debe manejar consulta con mayúsculas y minúsculas', () => {
      const result1 = sensei.search('OI ZUKI');
      const result2 = sensei.search('oi zuki');
      const result3 = sensei.search('Oi Zuki');
      
      expect(result1.name).toBe(result2.name);
      expect(result2.name).toBe(result3.name);
    });
  });

  describe('📊 Performance y Límites', () => {
    test('debe rechazar coincidencias con baja similitud', () => {
      const result = sensei.search('xyz123');
      expect(result).toBeNull();
    });

    test('debe normalizar texto correctamente', () => {
      const normalized1 = sensei.normalizeText('  OI ZUKI  ');
      const normalized2 = sensei.normalizeText('oi zuki');
      
      expect(normalized1).toBe(normalized2);
    });

    test('debe manejar acentos y caracteres especiales', () => {
      const normalized1 = sensei.normalizeText('mae geri');
      const normalized2 = sensei.normalizeText('maé géri');
      
      expect(normalized1).toBe(normalized2);
    });
  });

  describe('🎯 Fuzzy Matching', () => {
    test('debe dar similitud 1.0 para strings idénticos', () => {
      const similarity = sensei.fuzzyMatch('test', 'test');
      expect(similarity).toBe(1.0);
    });

    test('debe dar alta similitud para substrings', () => {
      const similarity = sensei.fuzzyMatch('oi zuki', 'oi');
      expect(similarity).toBeGreaterThan(0.7);
    });

    test('debe dar baja similitud para strings diferentes', () => {
      const similarity = sensei.fuzzyMatch('karate', 'programming');
      expect(similarity).toBeLessThan(0.5);
    });
  });
});

// Tests de Integración CLI
describe('Sensei AI - CLI Integration', () => {
  let sensei;

  beforeEach(() => {
    sensei = new SenseiCLI();
  });

  test('debe formatear respuesta de técnica correctamente', () => {
    const mockResult = {
      type: 'technique',
      name: 'Oi Zuki',
      technique: {
        descripcion: 'Golpe de puño directo',
        uso: 'Ataque frontal',
        cinturon: '10° Kyu',
        category: 'teWaza'
      },
      matchType: 'exact'
    };

    const response = sensei.formatResponse(mockResult);
    
    expect(response).toContain('🥋 **Oi Zuki**');
    expect(response).toContain('Golpe de puño directo');
    expect(response).toContain('Ataque frontal');
    expect(response).toContain('10° Kyu');
    expect(response).toContain('teWaza');
  });

  test('debe formatear respuesta de vocabulario correctamente', () => {
    const mockResult = {
      type: 'vocabulary',
      term: 'dojo',
      definition: 'Lugar de entrenamiento de artes marciales',
      matchType: 'exact'
    };

    const response = sensei.formatResponse(mockResult);
    
    expect(response).toContain('📚 **DOJO**');
    expect(response).toContain('Lugar de entrenamiento de artes marciales');
  });

  test('debe formatear respuesta de no encontrado correctamente', () => {
    const response = sensei.formatResponse(null);
    
    expect(response).toContain('❌ No encontré información');
    expect(response).toContain('💡 Intenta preguntar sobre:');
    expect(response).toContain('Oi Zuki');
    expect(response).toContain('dojo');
  });
});

// Tests de Carga y Configuración
describe('Sensei AI - Configuración', () => {
  test('debe cargar knowledge base correctamente', () => {
    const sensei = new SenseiCLI();
    expect(sensei.knowledgeBase).toBeDefined();
    expect(sensei.knowledgeBase.techniqueDetails).toBeDefined();
    expect(sensei.knowledgeBase.vocabulary).toBeDefined();
  });

  test('debe tener versión correcta', () => {
    const sensei = new SenseiCLI();
    expect(sensei.version).toBe('1.0.0');
  });
});

console.log('✅ Tests cargados - Ejecutar con: npm test');
