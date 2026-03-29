import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { 
  SearchResult, 
  InferenceEngineConfig,
  KnowledgeBase,
  NLPProcessResult
} from '@/types';
import { InferenceEngine } from '../InferenceEngine';

// Mock de NLPProcessor
const mockNLPProcessor = {
  normalizeText: vi.fn((text: string) => text.toLowerCase().trim()),
  fuzzyMatch: vi.fn().mockImplementation((str1: string, str2: string) => {
    // Simulación simple de fuzzy match para testing
    if (str1 === str2) return 1.0;
    if (str1.includes(str2) || str2.includes(str1)) return 0.8;
    if (Math.abs(str1.length - str2.length) <= 2) return 0.7;
    return 0.3;
  })
};

vi.mock('../NLPProcessor', () => ({
  NLPProcessor: mockNLPProcessor
}));

// Knowledge Base mock para testing
const mockKnowledgeBase: KnowledgeBase = {
  general: {
    greeting: "¡Osu! Soy un Sensei de Shindo Jinen Ryu.",
    farewell: "¡Osu! El conocimiento es un viaje sin fin.",
    error: "¡Osu! Mi conocimiento es vasto, pero necesito más claridad.",
    apology: "Disculpe, Sensei no entendió su pregunta, intente de nuevo."
  },
  faq: {
    que_es_karate: "El Karate-do es un arte marcial que nos enseña a defendernos usando nuestro cuerpo como arma de combate.",
    origen: "El karate do moderno proviene de Japón, pero sus orígenes se encuentran en Okinawa."
  },
  bodyParts: {
    general: {
      jyo_dan: "Jyo Dan se refiere a la zona del cuerpo del cuello para arriba (la cabeza).",
      chu_dan: "Chu Dan es la zona del torso, del cuello hasta el cinturón.",
      ge_dan: "Ge Dan es la zona de las piernas, del cinturón hacia abajo."
    },
    hand: {
      seiken: "Seiken: Parte delantera del puño, nudillo de los dedos medio e índice.",
      shuto: "Shuto: Borde exterior de la mano."
    },
    foot: {
      koshi: "Koshi: Bola del pie.",
      kakato: "Kakato: Talón."
    }
  },
  organization: {
    name: "Shindo Jinen Ryu",
    founder: "Yasuhiro Konishi",
    founded: "1933"
  },
  dojoKun: [
    "Esforzarse por el perfeccionamiento del carácter",
    "Ser fiel y sincero",
    "Poner máximo esfuerzo en todo"
  ],
  vocabulary: {
    oss: "Expresión de respeto y afirmación en karate",
    dojo: "Lugar de entrenamiento de artes marciales",
    sensei: "Maestro o instructor"
  },
  history: {
    founder: "Yasuhiro Konishi fundó el Shindo Jinen Ryu en 1933",
    origin: "El estilo combina elementos de Shotokan y otras artes marciales"
  },
  logica_creativa: {
    poema_karate_romance: "El camino del karate es un viaje interior...",
    metafora_progreso: "Como el bambú, flexible pero fuerte..."
  },
  techniquesByRank: {
    "10 kyu": {
      teWaza: ["Oi Zuki", "Gyaku Zuki", "Tate Zuki"],
      fuseguiWaza: ["Gedan Barai", "Jodan Uke", "Chudan Uke"],
      ashiWaza: ["Mae Geri"]
    },
    "5 kyu": {
      teWaza: ["Haito Uchi", "Age Zuki"],
      fuseguiWaza: ["Nagashi Uke", "Haito Uke"],
      ashiWaza: ["Mawashi Geri"]
    },
    "1 dan": {
      teWaza: ["Sanbon Zuki"],
      fuseguiWaza: ["Mawashi Uke"],
      ashiWaza: ["Kake Geri"]
    }
  },
  techniqueDetails: {
    "Oi Zuki": {
      descripcion: "Golpe de puño directo con la mano adelantada. Es el ataque más fundamental en karate.",
      uso: "Ataque frontal directo al pecho o abdomen del oponente.",
      cinturon: "10° Kyu",
      category: "teWaza",
      keywords: ["puño", "directo", "adelantado", "frontal", "básico"],
      itemSpanishName: "Oi Zuki"
    },
    "Gyaku Zuki": {
      descripcion: "Golpe de puño con la mano trasera. Genera gran potencia mediante la rotación de cadera.",
      uso: "Contraataque potente aprovechando la rotación del cuerpo.",
      cinturon: "10° Kyu",
      category: "teWaza",
      keywords: ["puño", "trasero", "contraataque", "potencia", "rotación"],
      itemSpanishName: "Gyaku Zuki"
    },
    "Sanbon Zuki": {
      descripcion: "Combinación de tres puñetazos consecutivos: Oi Zuki (Jodan), Gyaku Zuki (Chudan), Gyaku Zuki (Chudan).",
      uso: "Técnica avanzada de combinación para kumite y katas.",
      cinturon: "1° Dan",
      category: "teWaza",
      keywords: ["combinación", "tres puñetazos", "consecutivos", "avanzada", "kata"],
      itemSpanishName: "Sanbon Zuki"
    },
    "Mawashi Geri": {
      descripcion: "Patada circular semicircular con el empeine del pie. Es una de las patadas más efectivas en combate.",
      uso: "Ataque circular a la cabeza, torso o piernas del oponente.",
      cinturon: "5° Kyu",
      category: "ashiWaza",
      keywords: ["patada", "circular", "empeine", "combate", "efectiva"],
      itemSpanishName: "Mawashi Geri"
    }
  }
};

describe('InferenceEngine - Happy Path', () => {
  let engine: InferenceEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new InferenceEngine(mockKnowledgeBase);
  });

  it('debería_encontrar_técnica_por_coincidencia_exacta_y_devolver_score_1_0', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'Oi Zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi', 'zuki'],
      intent: 'technique_query',
      entities: { rank: '10 kyu', category: 'teWaza' }
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.type).toBe('technique');
    expect(result!.score).toBe(1.0); // exact_match weight
    expect(result!.matchType).toBe('exact');
    expect(result!.key).toBe('Oi Zuki');
    expect(result!.item).toHaveProperty('descripcion');
    expect(result!.item).toHaveProperty('uso');
  });

  it('debería_encontrar_técnica_por_keywords_en_descripción', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'ataque directo',
      sanitizedText: 'ataque directo',
      normalizedText: 'ataque directo',
      keywords: ['directo', 'ataque'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.type).toBe('technique');
    expect(result!.key).toBe('Oi Zuki');
    expect(result!.score).toBeGreaterThan(0.8); // keyword_match weight
  });

  it('debería_encontrar_partes_del_cuerpo_por_categoría', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'partes del pie',
      sanitizedText: 'partes del pie',
      normalizedText: 'partes del pie',
      keywords: ['pie'],
      intent: 'body_part_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.type).toBe('body_parts_category');
    expect(result!.key).toBe('foot');
    expect(result!.score).toBe(1.0);
  });

  it('debería_encontrar_vocabulario_por_coincidencia_parcial', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'dojo',
      sanitizedText: 'dojo',
      normalizedText: 'dojo',
      keywords: ['dojo'],
      intent: 'vocabulary_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.type).toBe('general');
    expect(result!.key).toBe('dojo');
    expect(result!.item).toBe('Expresión de respeto y afirmación en karate');
  });

  it('debería_aplicar_boost_por_rango_especificado', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: { rank: '10 kyu', category: 'teWaza' }
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.score).toBeGreaterThan(1.0); // exact_match + category_boost
  });

  it('debería_devolver_sugerencia_pedagógica_correcta_si_consulta_es_avanzada', () => {
    // Arrange - Usuario de 5 kyu pregunta por técnica de 1 dan
    const nlpResult: NLPProcessResult = {
      originalText: 'sanbon zuki',
      sanitizedText: 'sanbon zuki',
      normalizedText: 'sanbon zuki',
      keywords: ['sanbon', 'zuki'],
      intent: 'technique_query',
      entities: { rank: '5 kyu', category: 'teWaza' }
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.type).toBe('technique');
    expect(result!.key).toBe('Sanbon Zuki');
    expect(result!.suggestion).toContain('técnica avanzada');
    expect(result!.suggestion).toContain('Oi Zuki'); // Técnica básica recomendada
  });

  it('debería_usar_fuzzy_match_para_errores_tipográficos', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki', // con error tipográfico
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Mock fuzzy match para simular coincidencia
    mockNLPProcessor.fuzzyMatch.mockReturnValue(0.85);

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.matchType).toBe('fuzzy');
    expect(result!.score).toBeGreaterThan(0.6); // fuzzy_match * score
  });
});

describe('InferenceEngine - Edge Cases', () => {
  let engine: InferenceEngine;

  beforeEach(() => {
    engine = new InferenceEngine(mockKnowledgeBase);
  });

  it('debería_manjar_keywords_vacíos', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: [], // array vacío
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.key).toBe('Oi Zuki');
    expect(result!.matchType).toBe('exact');
  });

  it('debería_manjar_normalizedText_vacío', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: '',
      sanitizedText: '',
      normalizedText: '', // string vacío
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).toBeNull(); // No debería encontrar nada sin texto normalizado
  });

  it('debería_devolver_null_para_término_inexistente', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'técnica inexistente',
      sanitizedText: 'técnica inexistente',
      normalizedText: 'técnica inexistente',
      keywords: ['inexistente', 'técnica'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).toBeNull();
  });

  it('debería_manjar_fuzzyThreshold_en_límite_exacto', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuk', // casi coincidencia
      sanitizedText: 'oi zuk',
      normalizedText: 'oi zuk',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Mock fuzzy match para devolver exactamente el threshold
    mockNLPProcessor.fuzzyMatch.mockReturnValue(0.7);

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).toBeNull(); // No debería coincidir si está exactamente en el límite
  });

  it('debería_manjar_intención_no_soportada', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'algo',
      sanitizedText: 'algo',
      normalizedText: 'algo',
      keywords: ['algo'],
      intent: 'unknown_intent' as any, // intención no soportada
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).toBeNull(); // Debería fallback a búsqueda general y no encontrar nada
  });

  it('debería_manjar_entities_vacíos', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {} // entities vacío
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.key).toBe('Oi Zuki');
    expect(result!.score).toBe(1.0); // Sin boosts pero coincidencia exacta
  });
});

describe('InferenceEngine - Gestión de Errores', () => {
  it('debería_lanzar_error_si_knowledgeBase_es_null', () => {
    // Act & Assert
    expect(() => {
      new InferenceEngine(null as any);
    }).toThrow('KnowledgeBase is required');
  });

  it('debería_lanzar_error_si_knowledgeBase_no_tiene_techniquesByRank', () => {
    // Arrange
    const invalidKB = {
      general: { greeting: 'hola' }
      // Sin techniquesByRank
    };

    // Act & Assert
    expect(() => {
      new InferenceEngine(invalidKB as any);
    }).toThrow('KnowledgeBase must contain techniquesByRank');
  });

  it('debería_devolver_null_si_nlpResult_es_null', () => {
    // Arrange
    const engine = new InferenceEngine(mockKnowledgeBase);

    // Act
    const result = engine.search(null as any);

    // Assert
    expect(result).toBeNull();
  });

  it('debería_devolver_null_si_nlpResult_es_undefined', () => {
    // Arrange
    const engine = new InferenceEngine(mockKnowledgeBase);

    // Act
    const result = engine.search(undefined as any);

    // Assert
    expect(result).toBeNull();
  });

  it('debería_devolver_null_si_nlpResult_no_tiene_estructura_válida', () => {
    // Arrange
    const engine = new InferenceEngine(mockKnowledgeBase);
    const invalidNLPResult = {
      // Sin normalizedText o keywords
      keywords: ['test'],
      intent: 'technique_query',
      entities: {}
    } as any;

    // Act
    const result = engine.search(invalidNLPResult);

    // Assert
    expect(result).toBeNull();
  });

  it('debería_manjar_knowledgeBase_mal_formado', () => {
    // Arrange
    const malformedKB = {
      general: null, // malformed
      techniquesByRank: {
        "10 kyu": {
          teWaza: ["Oi Zuki"]
        }
      },
      techniqueDetails: {}
    };

    const engine = new InferenceEngine(malformedKB as any);
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull(); // Debería funcionar con techniquesByRank válido
  });

  it('debería_manjar_knowledgeBase_vacíopero_válido', () => {
    // Arrange
    const emptyKB = {
      general: {
        greeting: "hola",
        farewell: "adios",
        error: "error",
        apology: "perdón"
      },
      techniquesByRank: {
        "10 kyu": {
          teWaza: [],
          fuseguiWaza: [],
          ashiWaza: []
        }
      },
      techniqueDetails: {},
      // Otras propiedades vacías o ausentes
      faq: {},
      bodyParts: {
        general: {},
        hand: {},
        foot: {}
      },
      organization: {},
      dojoKun: [],
      vocabulary: {},
      history: {},
      logica_creativa: {
        poema_karate_romance: "",
        metafora_progreso: ""
      }
    };

    const engine = new InferenceEngine(emptyKB);
    const nlpResult: NLPProcessResult = {
      originalText: 'técnica no existente',
      sanitizedText: 'técnica no existente',
      normalizedText: 'técnica no existente',
      keywords: ['no', 'existente'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).toBeNull(); // No debería encontrar nada en KB vacío
  });
});

describe('InferenceEngine - Integraciones', () => {
  let engine: InferenceEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new InferenceEngine(mockKnowledgeBase);
  });

  it('debería_llamar_normalizeText_con_parámetros_correctos', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'OI ZUKI',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['OI', 'ZUKI'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    engine.search(nlpResult);

    // Assert
    expect(mockNLPProcessor.normalizeText).toHaveBeenCalledWith('OI ZUKI');
    expect(mockNLPProcessor.normalizeText).toHaveBeenCalledWith('oi zuki');
  });

  it('debería_llamar_fuzzyMatch_con_parámetros_correctos', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuk', // casi coincidencia
      sanitizedText: 'oi zuk',
      normalizedText: 'oi zuk',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    engine.search(nlpResult);

    // Assert
    expect(mockNLPProcessor.fuzzyMatch).toHaveBeenCalled();
    
    // Verificar que se llama con los parámetros correctos
    const calls = mockNLPProcessor.fuzzyMatch.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    
    // La primera llamada debería ser con la query y una técnica
    expect(calls[0][0]).toBe('oi zuk');
    expect(calls[0][1]).toBe('oi zuki'); // Normalizado
  });

  it('debería_usar_configuración_personalizada', () => {
    // Arrange
    const customConfig: Partial<InferenceEngineConfig> = {
      fuzzyThreshold: 0.9,
      maxResults: 5,
      weights: {
        exact_match: 2.0,
        keyword_match: 1.0,
        fuzzy_match: 0.8,
        partial_match: 0.6,
        category_boost: 0.5
      }
    };

    const customEngine = new InferenceEngine(mockKnowledgeBase, customConfig);
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = customEngine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.score).toBe(2.0); // exact_match con peso personalizado
  });

  it('debería_actualizar_configuración_en_runtime', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Act - Primera búsqueda con config default
    const result1 = engine.search(nlpResult);
    expect(result1!.score).toBe(1.0);

    // Actualizar configuración
    engine.updateConfig({
      weights: {
        exact_match: 3.0,
        keyword_match: 0.8,
        fuzzy_match: 0.6,
        partial_match: 0.4,
        category_boost: 0.3
      }
    });

    // Segunda búsqueda con nueva config
    const result2 = engine.search(nlpResult);

    // Assert
    expect(result2!.score).toBe(3.0); // Nuevo peso exact_match
  });

  it('debería_construir_índice_en_constructor', () => {
    // Arrange - El índice se construye en el constructor
    const nlpResult: NLPProcessResult = {
      originalText: 'directo',
      sanitizedText: 'directo',
      normalizedText: 'directo',
      keywords: ['directo'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.key).toBe('Oi Zuki'); // Encontrado por keyword en descripción
  });

  it('debería_obtener_configuración_actual', () => {
    // Act
    const config = engine.getConfig();

    // Assert
    expect(config).toHaveProperty('weights');
    expect(config).toHaveProperty('fuzzyThreshold');
    expect(config).toHaveProperty('maxResults');
    expect(config.weights.exact_match).toBe(1.0);
  });
});

describe('InferenceEngine - Contextual Suggestions', () => {
  let engine: InferenceEngine;

  beforeEach(() => {
    engine = new InferenceEngine(mockKnowledgeBase);
  });

  it('debería_obtener_sugerencias_contextuales_para_técnica', () => {
    // Arrange
    const mockResult: SearchResult = {
      type: 'technique',
      score: 1.0,
      matchType: 'exact',
      section: 'techniqueDetails',
      key: 'Oi Zuki',
      item: {
        descripcion: 'Golpe de puño directo',
        uso: 'Ataque frontal',
        cinturon: '10° Kyu',
        itemSpanishName: 'Oi Zuki'
      },
      data: {
        rank: '10° Kyu',
        category: 'teWaza',
        techniqueName: 'Oi Zuki'
      }
    };

    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const suggestions = engine.getContextualSuggestions(nlpResult, mockResult);

    // Assert
    expect(suggestions).toHaveLength(3);
    expect(suggestions[0]).toContain('¿Qué otras técnicas son para mi nivel?');
    expect(suggestions[1]).toContain('¿Cómo practicar esta técnica correctamente?');
  });

  it('debería_obtener_sugerencias_generales_sin_resultado', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'hola',
      sanitizedText: 'hola',
      normalizedText: 'hola',
      keywords: ['hola'],
      intent: 'greeting',
      entities: {}
    };

    // Act
    const suggestions = engine.getContextualSuggestions(nlpResult);

    // Assert
    expect(suggestions).toHaveLength(3);
    expect(suggestions[0]).toContain('¿Qué técnicas debo practicar para empezar?');
    expect(suggestions[1]).toContain('¿Cuál es el significado de "Oss"?');
  });
});

describe('InferenceEngine - Reglas de Inferencia', () => {
  let engine: InferenceEngine;

  beforeEach(() => {
    engine = new InferenceEngine(mockKnowledgeBase);
  });

  it('debería_aplicar_regla_de_boost_por_rango', () => {
    // Arrange
    const nlpResult: NLPProcessResult = {
      originalText: 'oi zuki',
      sanitizedText: 'oi zuki',
      normalizedText: 'oi zuki',
      keywords: ['oi'],
      intent: 'technique_query',
      entities: { rank: '10 kyu' } // Mismo rango que la técnica
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.score).toBeGreaterThan(1.0); // Debe tener boost
  });

  it('debería_aplicar_regla_de_penalización_por_score_bajo', () => {
    // Arrange - Crear múltiples resultados con scores bajos
    const nlpResult: NLPProcessResult = {
      originalText: 'técnica muy específica que no existe',
      sanitizedText: 'técnica muy específica que no existe',
      normalizedText: 'técnica muy específica que no existe',
      keywords: ['específica', 'no', 'existe'],
      intent: 'technique_query',
      entities: {}
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).toBeNull(); // Debería ser filtrado por score bajo
  });

  it('debería_aplicar_regla_de_prerrequisitos_para_técnicas_avanzadas', () => {
    // Arrange - Usuario de bajo nivel pregunta técnica avanzada
    const nlpResult: NLPProcessResult = {
      originalText: 'sanbon zuki',
      sanitizedText: 'sanbon zuki',
      normalizedText: 'sanbon zuki',
      keywords: ['sanbon'],
      intent: 'technique_query',
      entities: { rank: '5 kyu' } // Usuario de nivel más bajo
    };

    // Act
    const result = engine.search(nlpResult);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.suggestion).toContain('técnica avanzada');
    expect(result!.suggestion).toContain('dominar primero');
  });
});
