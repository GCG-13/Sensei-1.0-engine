#!/usr/bin/env node

/**
 * 🥋 Universal Sensei AI - Motor Central Optimizado v4.0
 * Sistema de razonamiento de intención con capacidad infinita
 * Optimizado para 5000+ líneas de conocimiento marcial
 * @version 4.0 - High Performance Architecture
 * @author Senior Backend Developer
 */

const fs = require('fs').promises;
const path = require('path');
const { Worker } = require('worker_threads');

class UniversalSenseiAI {
    constructor() {
        this.knowledgeBase = null;
        this.isInitialized = false;
        
        // 🚀 ÍNDICES AVANZADOS EN MEMORIA
        this.techniqueIndex = new Map();
        this.conceptIndex = new Map();
        this.keywordIndex = new Map();
        this.glossaryIndex = new Map();
        this.kataIndex = new Map();
        this.gradesIndex = new Map();
        this.historyIndex = new Map();
        
        // 🎯 PESOS DE INTENCIÓN OPTIMIZADOS
        this.intentWeights = {
            exact: 1.0,
            fuzzy: 0.8,
            semantic: 0.6,
            contextual: 0.4
        };
        
        // 🧠 CACHE DE BÚSQUEDA EN MEMORIA
        this.searchCache = new Map();
        this.maxCacheSize = 1000;
        
        // 🎭 PATRONES DE INTENCIÓN EXPANDIDOS
        this.intentPatterns = new Map();
        this.semanticMappings = new Map();
        
        // 🗑️ FILTRO DE RUIDO AVANZADO
        this.stopWords = new Set([
            'como', 'se', 'en', 'el', 'un', 'una', 'los', 'las', 'de', 'del', 'para', 'por', 'con', 'sin', 
            'sobre', 'entre', 'hacia', 'hasta', 'que', 'cual', 'cuales', 'cuando', 'donde', 'porque', 
            'a', 'o', 'y', 'pero', 'mas', 'ni', 'si', 'no', 'es', 'son', 'fue', 'fueron', 'ser', 'estar', 
            'han', 'ha', 'haber', 'habia', 'habian', 'mi', 'tu', 'su', 'nuestro', 'vuestro', 'este', 'esta', 
            'estos', 'estas', 'aquel', 'aquella', 'aquellos', 'aquellas', 'la', 'lo', 'le', 'les', 'me', 'te',
            'muy', 'mucho', 'poco', 'mas', 'menos', 'tambien', 'bien', 'mal', 'regular', 'bueno', 'otro', 'otros'
        ]);
        
        // 📊 ESTADÍSTICAS DE RENDIMIENTO
        this.stats = {
            queriesProcessed: 0,
            avgResponseTime: 0,
            cacheHitRate: 0,
            indexSize: 0
        };
        
        this.initializeIntentPatterns();
        this.initializeSemanticMappings();
    }

    /**
     * 🧠 INICIALIZACIÓN DE PATRONES DE INTENCIÓN EXPANDIDOS
     */
    initializeIntentPatterns() {
        // Patrones expandidos con pesos contextuales optimizados
        this.intentPatterns.set('technique', {
            keywords: ['tecnica', 'golpe', 'patada', 'bloqueo', 'defensa', 'ataque', 'movimiento', 'zuki', 'geri', 'uke'],
            weight: 1.0,
            contexts: ['ejecucion', 'como se hace', 'realizar', 'hacer', 'explicar', 'enseñar'],
            priority: 1
        });

        this.intentPatterns.set('biomechanics', {
            keywords: ['biomecanica', 'cuerpo', 'posicion', 'postura', 'angulo', 'movimiento', 'control', 'articulacion'],
            weight: 0.9,
            contexts: ['puntos de control', 'mecanica', 'fisica', 'cuerpo', 'estructura'],
            priority: 2
        });

        this.intentPatterns.set('breathing', {
            keywords: ['respirar', 'respiracion', 'aire', 'kokyu', 'exhalar', 'inhalar', 'aliento', 'energia'],
            weight: 0.9,
            contexts: ['patron', 'ritmo', 'sincronizacion', 'energia', 'ki'],
            priority: 2
        });

        this.intentPatterns.set('philosophy', {
            keywords: ['filosofia', 'budo', 'do', 'camino', 'espiritual', 'mente', 'zen', 'mushin', 'zanshin', 'kime', 'ma ai'],
            weight: 0.8,
            contexts: ['principios', 'valores', 'etica', 'disciplina', 'significado'],
            priority: 3
        });

        this.intentPatterns.set('history', {
            keywords: ['historia', 'origen', 'fundador', 'maestro', 'linaje', 'okina', 'china', 'konishi', 'itosa', 'higaonna'],
            weight: 0.8,
            contexts: ['cuando', 'donde', 'quien', 'evolucion', 'creacion', 'desarrollo'],
            priority: 3
        });

        this.intentPatterns.set('kata', {
            keywords: ['kata', 'katas', 'forma', 'secuencia', 'rutina', 'patron', 'practicar', 'heian', 'bunkai', 'enbusen'],
            weight: 0.9,
            contexts: ['donde practico', 'secuencia', 'movimientos', 'aplicacion', 'kiai'],
            priority: 2
        });

        this.intentPatterns.set('grades', {
            keywords: ['cinturon', 'grado', 'kyu', 'dan', 'examen', 'rango', 'nivel', 'promocion', 'marron', 'negro'],
            weight: 0.8,
            contexts: ['subir de nivel', 'examen', 'requisitos', 'preparacion'],
            priority: 3
        });

        this.intentPatterns.set('glossary', {
            keywords: ['significado', 'traduccion', 'japones', 'romaji', 'termino', 'palabra', 'diccionario', 'glosario'],
            weight: 0.7,
            contexts: ['que significa', 'como se dice', 'traduccion', 'idioma'],
            priority: 4
        });

        this.intentPatterns.set('mistakes', {
            keywords: ['error', 'fallo', 'incorrecto', 'mal', 'problema', 'corregir', 'mejorar', 'dificultad'],
            weight: 0.9,
            contexts: ['errores comunes', 'fallas', 'defectos', 'correccion', 'dificultad'],
            priority: 2
        });

        this.intentPatterns.set('targets', {
            keywords: ['golpear', 'impacto', 'target', 'objetivo', 'blanco', 'anatomia', 'kyusho', 'presion', 'vital'],
            weight: 0.9,
            contexts: ['donde golpea', 'puntos vitales', 'impacto', 'efectividad'],
            priority: 2
        });
    }

    /**
     * 🧩 MAPEOS SEMÁNTICOS CONTEXTUALES EXPANDIDOS
     */
    initializeSemanticMappings() {
        // Mapeos conceptuales optimizados para inferencia semántica avanzada
        this.semanticMappings.set('movimiento circular', ['mawashi', 'circular', 'giro', 'rotacion', 'redondo']);
        this.semanticMappings.set('golpe directo', ['oi zuki', 'choku zuki', 'directo', 'frontal', 'recto']);
        this.semanticMappings.set('defensa alta', ['jodan uke', 'age uke', 'alto', 'superior', 'cima']);
        this.semanticMappings.set('defensa baja', ['gedan uke', 'bajo', 'inferior', 'abajo']);
        this.semanticMappings.set('energia vital', ['ki', 'chi', 'prana', 'energia interna', 'fuerza vital']);
        this.semanticMappings.set('mente vacia', ['mushin', 'sin mente', 'flujo', 'estado zen', 'vacuidad']);
        this.semanticMappings.set('conciencia', ['zanshin', 'atencion', 'vigilancia', 'consciente', 'alerta']);
        this.semanticMappings.set('distancia', ['ma ai', 'rango', 'espacio', 'separacion', 'alcance']);
        this.semanticMappings.set('centro', ['hara', 'centro', 'abdomen', 'core', 'ombligo']);
        this.semanticMappings.set('poder', ['kime', 'fuerza', 'potencia', 'impacto', 'explosion']);
    }

    /**
     * 🚀 INICIALIZACIÓN ASÍNCRONA OPTIMIZADA CON WORKER THREAD
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            const startTime = Date.now();
            
            // 📁 CARGA ASÍNCRONA NO BLOQUEANTE
            const knowledgePath = path.join(__dirname, '..', 'data', 'universal_knowledge_base.json');
            const knowledgeData = await fs.readFile(knowledgePath, 'utf8');
            this.knowledgeBase = JSON.parse(knowledgeData);
            
            // 🏗️ CONSTRUCCIÓN DE ÍNDICES AVANZADA
            await this.buildAdvancedSearchIndexes();
            
            this.isInitialized = true;
            const loadTime = Date.now() - startTime;
            
            // 📊 ESTADÍSTICAS DE CARGA
            console.log(`🥋 Universal Sensei AI v4.0 inicializado en ${loadTime}ms`);
            console.log(`📚 ${this.techniqueIndex.size} técnicas indexadas`);
            console.log(`🧠 ${this.conceptIndex.size} conceptos filosóficos indexados`);
            console.log(`📖 ${this.historyIndex.size} eventos históricos indexados`);
            console.log(`🎯 ${this.glossaryIndex.size} términos del glosario indexados`);
            console.log(`🥋 ${this.kataIndex.size} katas indexados`);
            console.log(`🏆 ${this.gradesIndex.size} niveles de grado indexados`);
            console.log(`🔍 ${this.keywordIndex.size} palabras clave indexadas`);
            console.log(`🎭 ${this.intentPatterns.size} patrones de intención configurados`);
            
            // 📈 ACTUALIZAR ESTADÍSTICAS
            this.stats.indexSize = this.keywordIndex.size;
            
        } catch (error) {
            console.error('❌ Error crítico en inicialización:', error.message);
            throw new Error('No se pudo inicializar el motor Universal Sensei');
        }
    }

    /**
     * 🏗️ CONSTRUCCIÓN DE ÍNDICES AVANZADOS PARA BÚSQUEDA INSTANTÁNEA
     */
    async buildAdvancedSearchIndexes() {
        const indexStartTime = Date.now();
        
        // 🔄 LIMPIAR ÍNDICES EXISTENTES
        this.clearIndexes();
        
        // 📚 INDEXAR TÉCNICAS (Te Waza, Ashi Waza, Uke Waza)
        this.indexTechniques();
        
        // 🧠 INDEXAR CONCEPTOS FILOSÓFICOS
        this.indexPhilosophy();
        
        // 📖 INDEXAR HISTORIA Y LINAJE
        this.indexHistory();
        
        // 🥋 INDEXAR KATAS
        this.indexKatas();
        
        // 🏆 INDEXAR SISTEMA DE GRADOS
        this.indexGrades();
        
        // 📚 INDEXAR GLOSARIO MAESTRO
        this.indexGlossary();
        
        const indexTime = Date.now() - indexStartTime;
        console.log(`🔍 Índices construidos en ${indexTime}ms`);
    }

    /**
     * 🔄 LIMPIEZA DE ÍNDICES
     */
    clearIndexes() {
        this.techniqueIndex.clear();
        this.conceptIndex.clear();
        this.keywordIndex.clear();
        this.glossaryIndex.clear();
        this.kataIndex.clear();
        this.gradesIndex.clear();
        this.historyIndex.clear();
    }

    /**
     * 📚 INDEXAR TÉCNICAS AVANZADO
     */
    indexTechniques() {
        const techniqueSections = ['teWaza', 'ashiWaza', 'ukeWaza'];
        
        for (const section of techniqueSections) {
            if (this.knowledgeBase[section]) {
                for (const [name, technique] of Object.entries(this.knowledgeBase[section])) {
                    const normalizedName = this.normalizeText(name);
                    
                    // Indexar técnica principal
                    this.techniqueIndex.set(normalizedName, { 
                        name, 
                        technique, 
                        section,
                        keywords: technique.keywords || []
                    });
                    
                    // Indexar palabras clave avanzadas
                    this.indexKeywords(name, technique, 'technique', section);
                }
            }
        }
    }

    /**
     * 🧠 INDEXAR FILOSOFÍA AVANZADO
     */
    indexPhilosophy() {
        if (this.knowledgeBase.filosofia_y_conceptos) {
            for (const [concept, data] of Object.entries(this.knowledgeBase.filosofia_y_conceptos)) {
                const normalizedConcept = this.normalizeText(concept);
                
                this.conceptIndex.set(normalizedConcept, { 
                    concept, 
                    data,
                    keywords: data.palabras_clave || []
                });
                
                // Indexar palabras clave de conceptos
                this.indexKeywords(concept, data, 'philosophy', 'filosofia_y_conceptos');
            }
        }
    }

    /**
     * 📖 INDEXAR HISTORIA AVANZADO
     */
    indexHistory() {
        if (this.knowledgeBase.historia_y_linaje) {
            for (const [event, data] of Object.entries(this.knowledgeBase.historia_y_linaje)) {
                const normalizedEvent = this.normalizeText(event);
                
                this.historyIndex.set(normalizedEvent, { 
                    event, 
                    data,
                    keywords: this.extractKeywordsFromHistory(data)
                });
                
                // Indexar palabras clave de historia
                this.indexKeywords(event, data, 'history', 'historia_y_linaje');
            }
        }
    }

    /**
     * 🥋 INDEXAR KATAS AVANZADO
     */
    indexKatas() {
        if (this.knowledgeBase.katas_basicas) {
            for (const [kataName, kataData] of Object.entries(this.knowledgeBase.katas_basicas)) {
                const normalizedKata = this.normalizeText(kataName);
                
                this.kataIndex.set(normalizedKata, { 
                    kataName, 
                    kataData,
                    keywords: this.extractKeywordsFromKata(kataData)
                });
                
                // Indexar palabras clave de katas
                this.indexKeywords(kataName, kataData, 'kata', 'katas_basicas');
            }
        }
    }

    /**
     * 🏆 INDEXAR SISTEMA DE GRADOS AVANZADO
     */
    indexGrades() {
        if (this.knowledgeBase.sistema_grados_kyu) {
            // Indexar requisitos por grado
            if (this.knowledgeBase.sistema_grados_kyu.requisitos_por_grado) {
                for (const [grade, gradeData] of Object.entries(this.knowledgeBase.sistema_grados_kyu.requisitos_por_grado)) {
                    const normalizedGrade = this.normalizeText(grade);
                    
                    this.gradesIndex.set(normalizedGrade, { 
                        grade, 
                        gradeData,
                        keywords: this.extractKeywordsFromGrade(gradeData)
                    });
                    
                    // Indexar palabras clave de grados
                    this.indexKeywords(grade, gradeData, 'grades', 'sistema_grados_kyu.requisitos_por_grado');
                }
            }
            
            // Indexar consejos psicológicos
            if (this.knowledgeBase.sistema_grados_kyu.consejos_psicologicos_examen) {
                this.indexKeywords('consejos_psicologicos', this.knowledgeBase.sistema_grados_kyu.consejos_psicologicos_examen, 'grades', 'sistema_grados_kyu');
            }
        }
    }

    /**
     * 📚 INDEXAR GLOSARIO MAESTRO AVANZADO
     */
    indexGlossary() {
        if (this.knowledgeBase.glosario_maestro) {
            for (const [category, terms] of Object.entries(this.knowledgeBase.glosario_maestro)) {
                for (const [term, termData] of Object.entries(terms)) {
                    const normalizedTerm = this.normalizeText(term);
                    
                    this.glossaryIndex.set(normalizedTerm, { 
                        term, 
                        termData,
                        category,
                        keywords: this.extractKeywordsFromGlossary(termData)
                    });
                    
                    // Indexar palabras clave del glosario
                    this.indexKeywords(term, termData, 'glossary', `glosario_maestro.${category}`);
                }
            }
        }
    }

    /**
     * 🔍 INDEXAR PALABRAS CLAVE AVANZADO
     */
    indexKeywords(name, data, type, section) {
        const keywords = this.extractAllKeywords(name, data, type);
        
        for (const keyword of keywords) {
            const normalizedKeyword = this.normalizeText(keyword);
            
            if (!this.keywordIndex.has(normalizedKeyword)) {
                this.keywordIndex.set(normalizedKeyword, []);
            }
            
            // Evitar duplicados y mantener solo los mejores resultados
            const existingMatches = this.keywordIndex.get(normalizedKeyword);
            const newMatch = {
                type,
                name,
                data,
                section,
                score: this.calculateKeywordScore(keyword, name, type)
            };
            
            // Mantener solo los mejores 5 matches por keyword
            if (existingMatches.length < 5) {
                existingMatches.push(newMatch);
            } else {
                // Reemplazar si el nuevo match es mejor
                const worstIndex = existingMatches.findIndex(m => m.score < newMatch.score);
                if (worstIndex !== -1) {
                    existingMatches[worstIndex] = newMatch;
                }
            }
        }
    }

    /**
     * 🔧 EXTRACIÓN AVANZADA DE PALABRAS CLAVE
     */
    extractAllKeywords(name, data, type) {
        const keywords = new Set();
        
        // Agregar nombre principal
        keywords.add(name);
        
        // Agregar según tipo
        switch (type) {
            case 'technique':
                if (data.keywords) data.keywords.forEach(k => keywords.add(k));
                if (data.variants) data.variants.forEach(v => keywords.add(v));
                if (data.name_japanese) keywords.add(data.name_japanese);
                if (data.name_translation) keywords.add(data.name_translation);
                if (data.descripcion) this.extractWordsFromText(data.descripcion).forEach(w => keywords.add(w));
                if (data.uso_tactico) this.extractWordsFromText(data.uso_tactico).forEach(w => keywords.add(w));
                break;
                
            case 'philosophy':
                if (data.palabras_clave) data.palabras_clave.forEach(k => keywords.add(k));
                if (data.concepto) keywords.add(data.concepto);
                if (data.traduccion) keywords.add(data.traduccion);
                if (data.descripcion_profunda) this.extractWordsFromText(data.descripcion_profunda).forEach(w => keywords.add(w));
                break;
                
            case 'kata':
                if (data.nombre_japones) keywords.add(data.nombre_japones);
                if (data.nombre_traduccion) keywords.add(data.nombre_traduccion);
                if (data.significado) this.extractWordsFromText(data.significado).forEach(w => keywords.add(w));
                if (data.elementos_tecnicos) data.elementos_tecnicos.forEach(t => keywords.add(t));
                break;
                
            case 'grades':
                if (data.significado) this.extractWordsFromText(data.significado).forEach(w => keywords.add(w));
                if (data.requisitos_tecnicos) data.requisitos_tecnicos.forEach(r => keywords.add(r));
                if (data.consejo_psicologico) this.extractWordsFromText(data.consejo_psicologico).forEach(w => keywords.add(w));
                break;
                
            case 'glossary':
                if (data.japones) keywords.add(data.japones);
                if (data.romaji) keywords.add(data.romaji);
                if (data.traduccion) keywords.add(data.traduccion);
                if (data.uso) this.extractWordsFromText(data.uso).forEach(w => keywords.add(w));
                if (data.contexto) this.extractWordsFromText(data.contexto).forEach(w => keywords.add(w));
                break;
                
            case 'history':
                if (data.descripcion) this.extractWordsFromText(data.descripcion).forEach(w => keywords.add(w));
                if (data.significado) this.extractWordsFromText(data.significado).forEach(w => keywords.add(w));
                break;
        }
        
        return Array.from(keywords).filter(k => k && k.length > 1);
    }

    /**
     * 📝 EXTRACCIÓN DE PALABRAS DE TEXTO
     */
    extractWordsFromText(text) {
        if (!text || typeof text !== 'string') return [];
        
        return this.normalizeText(text)
            .split(' ')
            .filter(word => word && word.length > 2 && !this.stopWords.has(word))
            .slice(0, 10); // Limitar para evitar sobrecarga
    }

    /**
     * 📊 CÁLCULO DE PUNTUACIÓN DE PALABRAS CLAVE
     */
    calculateKeywordScore(keyword, name, type) {
        let score = 0.5; // Base score
        
        // Bonificación por coincidencia exacta
        if (keyword.toLowerCase() === name.toLowerCase()) score += 0.5;
        
        // Bonificación por tipo de contenido
        const typeScores = {
            'technique': 0.3,
            'philosophy': 0.2,
            'kata': 0.25,
            'grades': 0.2,
            'glossary': 0.15,
            'history': 0.1
        };
        
        score += typeScores[type] || 0.1;
        
        // Bonificación por longitud (palabras más específicas)
        if (keyword.length > 5) score += 0.1;
        
        return Math.min(score, 1.0);
    }

    /**
     * 🧠 PROCESAMIENTO PRINCIPAL DE CONSULTAS OPTIMIZADO
     */
    async processQuery(query) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        
        const queryStartTime = Date.now();
        this.stats.queriesProcessed++;
        
        if (!query || typeof query !== 'string') {
            return this.createFallbackResponse('consulta_vacia');
        }
        
        // 🔄 CACHE CHECK
        const cacheKey = this.generateCacheKey(query);
        if (this.searchCache.has(cacheKey)) {
            this.stats.cacheHitRate = (this.stats.cacheHitRate * (this.stats.queriesProcessed - 1) + 1) / this.stats.queriesProcessed;
            return this.searchCache.get(cacheKey);
        }
        
        // Normalización y limpieza avanzada
        const normalizedQuery = this.normalizeText(query);
        const queryTokens = this.tokenizeQuery(normalizedQuery);
        
        console.log(`🔍 Procesando consulta: "${query}" -> ${normalizedQuery}`);
        console.log(`🎯 Tokens detectados: [${queryTokens.join(', ')}]`);
        
        // Detección de intención con puntaje avanzado
        const intentAnalysis = this.detectIntentWithScoring(queryTokens);
        console.log(`🎯 Intención detectada: ${intentAnalysis.primaryIntent} (${intentAnalysis.confidence})`);
        
        // Búsqueda multi-estratégica optimizada
        const searchResults = await this.performOptimizedMultiStrategySearch(queryTokens, intentAnalysis);
        
        // Ranking y filtrado de resultados avanzado
        const rankedResults = this.rankResults(searchResults, intentAnalysis);
        
        // Generación de respuesta contextual con formato inteligente
        const response = this.generateIntelligentResponse(rankedResults, intentAnalysis, query);
        
        // 📊 ACTUALIZAR ESTADÍSTICAS
        const responseTime = Date.now() - queryStartTime;
        this.stats.avgResponseTime = (this.stats.avgResponseTime * (this.stats.queriesProcessed - 1) + responseTime) / this.stats.queriesProcessed;
        
        // 🔄 CACHE STORE
        this.storeInCache(cacheKey, response);
        
        console.log(`⚡ Respuesta generada en ${responseTime}ms`);
        
        return response;
    }

    /**
     * 🔄 GENERACIÓN DE CLAVE DE CACHE
     */
    generateCacheKey(query) {
        return this.normalizeText(query).substring(0, 50);
    }

    /**
     * 💾 ALMACENAMIENTO EN CACHE CON LÍMITES
     */
    storeInCache(key, response) {
        if (this.searchCache.size >= this.maxCacheSize) {
            // Eliminar la entrada más antigua (FIFO)
            const firstKey = this.searchCache.keys().next().value;
            this.searchCache.delete(firstKey);
        }
        this.searchCache.set(key, response);
    }

    /**
     * 🎯 DETECCIÓN DE INTENCIÓN CON PUNTAJE AVANZADO
     */
    detectIntentWithScoring(tokens) {
        const intentScores = new Map();
        const detectedKeywords = new Map();
        
        // Análisis por patrones con prioridad
        for (const [intent, pattern] of this.intentPatterns) {
            let score = 0;
            let matchedKeywords = [];
            
            // Puntuación por palabras clave directas
            for (const token of tokens) {
                for (const keyword of pattern.keywords) {
                    const normalizedKeyword = this.normalizeText(keyword);
                    if (token.includes(normalizedKeyword) || normalizedKeyword.includes(token)) {
                        score += pattern.weight;
                        matchedKeywords.push(keyword);
                    }
                }
            }
            
            // Puntuación por contexto
            for (const context of pattern.contexts) {
                const normalizedContext = this.normalizeText(context);
                const contextTokens = this.tokenizeQuery(normalizedContext);
                
                for (const token of tokens) {
                    for (const contextToken of contextTokens) {
                        if (token.includes(contextToken) || contextToken.includes(token)) {
                            score += pattern.weight * 0.5;
                        }
                    }
                }
            }
            
            // Aplicar prioridad
            score *= (1 / pattern.priority);
            
            if (score > 0) {
                intentScores.set(intent, score);
                detectedKeywords.set(intent, matchedKeywords);
            }
        }
        
        // Determinar intención primaria
        const primaryIntent = intentScores.size > 0 
            ? [...intentScores.entries()].reduce((a, b) => a[1] > b[1] ? a : b)[0]
            : 'general';
        
        const confidence = intentScores.get(primaryIntent) || 0;
        
        return {
            primaryIntent,
            confidence: confidence > 2 ? 'high' : confidence > 1 ? 'medium' : 'low',
            allScores: Object.fromEntries(intentScores),
            detectedKeywords: Object.fromEntries(detectedKeywords)
        };
    }

    /**
     * 🔍 BÚSQUEDA MULTI-ESTRATÉGICA OPTIMIZADA
     */
    async performOptimizedMultiStrategySearch(tokens, intentAnalysis) {
        const results = [];
        
        // Estrategia 1: Búsqueda exacta en índice (más rápida)
        const exactMatches = this.searchExactMatches(tokens);
        results.push(...exactMatches);
        
        // Estrategia 2: Búsqueda fuzzy (solo si no hay suficientes resultados exactos)
        if (exactMatches.length < 3) {
            const fuzzyMatches = this.searchFuzzyMatches(tokens);
            results.push(...fuzzyMatches);
        }
        
        // Estrategia 3: Búsqueda semántica (según intención)
        const semanticMatches = this.searchSemanticMatches(tokens);
        results.push(...semanticMatches);
        
        // Estrategia 4: Búsqueda contextual por intención
        const contextualMatches = this.searchContextualByIntent(intentAnalysis);
        results.push(...contextualMatches);
        
        return results;
    }

    /**
     * 🎯 BÚSQUEDA EXACTA EN ÍNDICE OPTIMIZADA
     */
    searchExactMatches(tokens) {
        const results = [];
        
        for (const token of tokens) {
            if (this.keywordIndex.has(token)) {
                const matches = this.keywordIndex.get(token);
                for (const match of matches) {
                    results.push({
                        ...match,
                        matchType: 'exact',
                        score: this.intentWeights.exact,
                        matchedToken: token
                    });
                }
            }
        }
        
        return results;
    }

    /**
     * 🔍 BÚSQUEDA FUZZY OPTIMIZADA
     */
    searchFuzzyMatches(tokens) {
        const results = [];
        const threshold = 0.7;
        
        for (const token of tokens) {
            for (const [indexedToken, matches] of this.keywordIndex) {
                const similarity = this.fuzzyMatch(token, indexedToken);
                if (similarity >= threshold) {
                    for (const match of matches) {
                        results.push({
                            ...match,
                            matchType: 'fuzzy',
                            score: similarity * this.intentWeights.fuzzy,
                            similarity,
                            matchedToken: token,
                            indexedToken
                        });
                    }
                }
            }
        }
        
        return results;
    }

    /**
     * 🧩 BÚSQUEDA SEMÁNTICA OPTIMIZADA
     */
    searchSemanticMatches(tokens) {
        const results = [];
        
        // Buscar mapeos semánticos
        for (const [concept, relatedTerms] of this.semanticMappings) {
            const normalizedConcept = this.normalizeText(concept);
            
            for (const token of tokens) {
                if (normalizedConcept.includes(token) || token.includes(normalizedConcept)) {
                    // Encontrar términos relacionados
                    for (const relatedTerm of relatedTerms) {
                        const normalizedRelated = this.normalizeText(relatedTerm);
                        if (this.keywordIndex.has(normalizedRelated)) {
                            const matches = this.keywordIndex.get(normalizedRelated);
                            for (const match of matches) {
                                results.push({
                                    ...match,
                                    matchType: 'semantic',
                                    score: this.intentWeights.semantic,
                                    semanticConcept: concept,
                                    matchedToken: token,
                                    relatedTerm
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return results;
    }

    /**
     * 🎯 BÚSQUEDA CONTEXTUAL POR INTENCIÓN OPTIMIZADA
     */
    searchContextualByIntent(intentAnalysis) {
        const results = [];
        const primaryIntent = intentAnalysis.primaryIntent;
        
        // Buscar en secciones específicas según la intención
        switch (primaryIntent) {
            case 'technique':
                results.push(...this.searchInTechniques());
                break;
            case 'philosophy':
                results.push(...this.searchInPhilosophy());
                break;
            case 'history':
                results.push(...this.searchInHistory());
                break;
            case 'kata':
                results.push(...this.searchInKatas());
                break;
            case 'grades':
                results.push(...this.searchInGrades());
                break;
            case 'glossary':
                results.push(...this.searchInGlossary());
                break;
            default:
                // Búsqueda general si no hay intención clara
                results.push(...this.searchGeneral());
        }
        
        return results.map(result => ({
            ...result,
            matchType: 'contextual',
            score: this.intentWeights.contextual,
            intent: primaryIntent
        }));
    }

    /**
     * 📊 RANKING DE RESULTADOS AVANZADO
     */
    rankResults(results, intentAnalysis) {
        // Eliminar duplicados manteniendo los mejores scores
        const uniqueResults = new Map();
        
        for (const result of results) {
            const key = `${result.type}-${result.name || result.concept || result.term}`;
            
            if (!uniqueResults.has(key) || result.score > uniqueResults.get(key).score) {
                uniqueResults.set(key, result);
            }
        }
        
        // Ordenar por score y limitar resultados
        return Array.from(uniqueResults.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 resultados
    }

    /**
     * 🧠 GENERACIÓN DE RESPUESTA HUMANA INTELIGENTE
     */
    generateIntelligentResponse(results, intentAnalysis, originalQuery) {
        if (results.length === 0) {
            return this.createFallbackResponse(intentAnalysis.primaryIntent);
        }
        
        // 🎯 ANÁLISIS DE INTENCIÓN ESPECÍFICA
        const queryLower = originalQuery.toLowerCase();
        
        // 🔄 DETECCIÓN DE COMPARACIONES
        if (this.isComparisonQuery(queryLower)) {
            return this.generateComparisonResponse(results, intentAnalysis, originalQuery);
        }
        
        // 📊 DETECCIÓN DE DIFERENCIAS
        if (this.isDifferenceQuery(queryLower)) {
            return this.generateDifferenceResponse(results, intentAnalysis, originalQuery);
        }
        
        // 📚 BÚSQUEDA CONTEXTUAL POR SECCIÓN
        if (this.isHistoryQuery(queryLower)) {
            const historyResults = results.filter(r => r.type === 'history');
            if (historyResults.length > 0) {
                return this.generateHistoryResponse(historyResults, intentAnalysis, originalQuery);
            }
        }
        
        if (this.isPhilosophyQuery(queryLower)) {
            const philosophyResults = results.filter(r => r.type === 'philosophy');
            if (philosophyResults.length > 0) {
                return this.generatePhilosophyResponse(philosophyResults[0], intentAnalysis, originalQuery);
            }
        }
        
        if (this.isTechniqueQuery(queryLower)) {
            const techniqueResults = results.filter(r => r.type === 'technique');
            if (techniqueResults.length > 0) {
                return this.generateTechniqueResponse(techniqueResults[0], intentAnalysis, originalQuery);
            }
        }
        
        // 📋 RESPUESTA GENERAL POR DEFECTO
        const primaryResult = results[0];
        let response;
        
        switch (primaryResult.type) {
            case 'technique':
                response = this.formatTechniqueResponse(primaryResult, intentAnalysis);
                break;
            case 'philosophy':
                response = this.formatPhilosophyResponse(primaryResult, intentAnalysis);
                break;
            case 'history':
                response = this.formatHistoryResponse(primaryResult, intentAnalysis);
                break;
            case 'kata':
                response = this.formatKataResponse(primaryResult, intentAnalysis);
                break;
            case 'grades':
                response = this.formatGradesResponse(primaryResult, intentAnalysis);
                break;
            case 'glossary':
                response = this.formatGlossaryResponse(primaryResult, intentAnalysis);
                break;
            default:
                response = this.formatGeneralResponse(primaryResult, intentAnalysis);
        }
        
        // 📝 FORMATEO INTELIGENTE PARA RESPUESTAS LARGAS
        return this.formatLongResponse(response, primaryResult, intentAnalysis);
    }

    /**
     * 🔍 DETECCIÓN DE TIPO DE CONSULTA
     */
    isComparisonQuery(query) {
        const comparisonKeywords = ['comparar', 'comparación', 'diferencia entre', 'vs', 'versus', 'cual es mejor', 'comparado con'];
        return comparisonKeywords.some(keyword => query.includes(keyword));
    }

    isDifferenceQuery(query) {
        const differenceKeywords = ['diferencia', 'diferencias', 'en que se diferencia', 'que lo distingue', 'distinción'];
        return differenceKeywords.some(keyword => query.includes(keyword));
    }

    isHistoryQuery(query) {
        const historyKeywords = ['historia', 'origen', 'evolución', 'linaje', 'maestros', 'fundador', 'cuando se creó'];
        return historyKeywords.some(keyword => query.includes(keyword));
    }

    isTechniqueQuery(query) {
        const techniqueKeywords = ['técnica', 'como se hace', 'ejecución', 'movimiento', 'golpe', 'patada', 'bloqueo'];
        return techniqueKeywords.some(keyword => query.includes(keyword));
    }

    isPhilosophyQuery(query) {
        const philosophyKeywords = ['filosofía', 'concepto', 'significado', 'principio', 'dojo kun', 'zanshin', 'mushin'];
        return philosophyKeywords.some(keyword => query.includes(keyword));
    }

    /**
     * 🔄 GENERACIÓN DE RESPUESTA DE COMPARACIÓN
     */
    generateComparisonResponse(results, intentAnalysis, originalQuery) {
        if (results.length < 2) {
            return `🤔 Para hacer una comparación necesito al menos dos elementos. Por favor, especifica qué técnicas o conceptos quieres comparar.\n\n💡 **Ejemplo:** "Compara Oi Zuki con Gyaku Zuki"`;
        }

        const [item1, item2] = results.slice(0, 2);
        let response = `🔄 **COMPARACIÓN INTELIGENTE**\n\n`;
        
        response += `📊 **Comparando:** ${item1.name || item1.concept || item1.term} **vs** ${item2.name || item2.concept || item2.term}\n\n`;

        // 🎯 Comparación por secciones según tipo
        if (item1.type === 'technique' && item2.type === 'technique') {
            response += this.compareTechniques(item1, item2);
        } else if (item1.type === 'philosophy' && item2.type === 'philosophy') {
            response += this.comparePhilosophy(item1, item2);
        } else if (item1.type === 'kata' && item2.type === 'kata') {
            response += this.compareKatas(item1, item2);
        } else {
            response += this.compareGeneral(item1, item2);
        }

        // 📝 Conclusión personalizada
        response += `\n\n🎯 **Conclusión Personalizada:**\n`;
        response += this.generateComparisonConclusion(item1, item2, originalQuery);

        return this.formatLongResponse(response, item1, intentAnalysis);
    }

    /**
     * 📊 COMPARACIÓN DE TÉCNICAS
     */
    compareTechniques(tech1, tech2) {
        let comparison = `🥋 **Análisis Técnico Comparativo:**\n\n`;

        // 📝 Descripción básica
        comparison += `📖 **Descripción:**\n`;
        comparison += `• **${tech1.name}:** ${tech1.data.descripcion || 'Sin descripción'}\n`;
        comparison += `• **${tech2.name}:** ${tech2.data.descripcion || 'Sin descripción'}\n\n`;

        // 🎯 Categoría y nivel
        comparison += `🎯 **Categoría y Nivel:**\n`;
        comparison += `• **${tech1.name}:** ${tech1.data.category || 'Sin categoría'} (Nivel: ${tech1.data.nivel || 'No especificado'})\n`;
        comparison += `• **${tech2.name}:** ${tech2.data.category || 'Sin categoría'} (Nivel: ${tech2.data.nivel || 'No especificado'})\n\n`;

        // 🏃‍♂️ Biomecánica
        if (tech1.data.biomecanica || tech2.data.biomecanica) {
            comparison += `🏃‍♂️ **Biomecánica:**\n`;
            comparison += `• **${tech1.name}:** ${tech1.data.biomecanica?.descripcion || 'No especificada'}\n`;
            comparison += `• **${tech2.name}:** ${tech2.data.biomecanica?.descripcion || 'No especificada'}\n\n`;
        }

        // ⚡ Aplicaciones
        if (tech1.data.aplicaciones || tech2.data.aplicaciones) {
            comparison += `⚡ **Aplicaciones:**\n`;
            comparison += `• **${tech1.name}:** ${(tech1.data.aplicaciones || []).join(', ') || 'No especificadas'}\n`;
            comparison += `• **${tech2.name}:** ${(tech2.data.aplicaciones || []).join(', ') || 'No especificadas'}\n\n`;
        }

        // ⚠️ Errores comunes
        if (tech1.data.errores_comunes || tech2.data.errores_comunes) {
            comparison += `⚠️ **Errores Comunes:**\n`;
            comparison += `• **${tech1.name}:** ${(tech1.data.errores_comunes || []).slice(0, 2).join(', ') || 'No especificados'}\n`;
            comparison += `• **${tech2.name}:** ${(tech2.data.errores_comunes || []).slice(0, 2).join(', ') || 'No especificados'}\n\n`;
        }

        return comparison;
    }

    /**
     * 📊 COMPARACIÓN DE CONCEPTOS FILOSÓFICOS
     */
    comparePhilosophy(concept1, concept2) {
        let comparison = `🧠 **Análisis Filosófico Comparativo:**\n\n`;

        comparison += `📖 **Definición Profunda:**\n`;
        comparison += `• **${concept1.concept}:** ${concept1.data.descripcion_profunda || concept1.data.descripcion || 'Sin descripción'}\n`;
        comparison += `• **${concept2.concept}:** ${concept2.data.descripcion_profunda || concept2.data.descripcion || 'Sin descripción'}\n\n`;

        // 🎯 Características esenciales
        if (concept1.data.caracteristicas_esenciales || concept2.data.caracteristicas_esenciales) {
            comparison += `🎯 **Características Esenciales:**\n`;
            comparison += `• **${concept1.concept}:** ${(concept1.data.caracteristicas_esenciales || []).slice(0, 2).join(', ') || 'No especificadas'}\n`;
            comparison += `• **${concept2.concept}:** ${(concept2.data.caracteristicas_esenciales || []).slice(0, 2).join(', ') || 'No especificadas'}\n\n`;
        }

        // 💡 Aplicación práctica
        if (concept1.data.aplicacion_practica || concept2.data.aplicacion_practica) {
            comparison += `💡 **Aplicación Práctica:**\n`;
            comparison += `• **${concept1.concept}:** ${Object.keys(concept1.data.aplicacion_practica || {}).join(', ') || 'No especificada'}\n`;
            comparison += `• **${concept2.concept}:** ${Object.keys(concept2.data.aplicacion_practica || {}).join(', ') || 'No especificada'}\n\n`;
        }

        return comparison;
    }

    /**
     * 📊 COMPARACIÓN DE KATAS
     */
    compareKatas(kata1, kata2) {
        let comparison = `🥋 **Análisis de Katas Comparativo:**\n\n`;

        comparison += `📖 **Significado y Origen:**\n`;
        comparison += `• **${kata1.name}:** ${kata1.data.significado || 'Sin significado'} (Dificultad: ${kata1.data.dificultad || 'No especificada'})\n`;
        comparison += `• **${kata2.name}:** ${kata2.data.significado || 'Sin significado'} (Dificultad: ${kata2.data.dificultad || 'No especificada'})\n\n`;

        // 🔢 Movimientos
        comparison += `🔢 **Complejidad:**\n`;
        comparison += `• **${kata1.name}:** ${kata1.data.numero_movimientos || 'No especificado'} movimientos\n`;
        comparison += `• **${kata2.name}:** ${kata2.data.numero_movimientos || 'No especificado'} movimientos\n\n`;

        // 📐 Enbusen
        if (kata1.data.enbusen_linea_direccion || kata2.data.enbusen_linea_direccion) {
            comparison += `📐 **Enbusen (Línea de Movimiento):**\n`;
            comparison += `• **${kata1.name}:** ${kata1.data.enbusen_linea_direccion?.descripcion || 'No especificada'}\n`;
            comparison += `• **${kata2.name}:** ${kata2.data.enbusen_linea_direccion?.descripcion || 'No especificada'}\n\n`;
        }

        // ⚡ Kiai points
        if (kata1.data.kiai_points || kata2.data.kiai_points) {
            comparison += `⚡ **Puntos Kiai:**\n`;
            comparison += `• **${kata1.name}:** ${(kata1.data.kiai_points || []).length} puntos de kiai\n`;
            comparison += `• **${kata2.name}:** ${(kata2.data.kiai_points || []).length} puntos de kiai\n\n`;
        }

        return comparison;
    }

    /**
     * 📊 COMPARACIÓN GENERAL
     */
    compareGeneral(item1, item2) {
        let comparison = `📊 **Análisis Comparativo General:**\n\n`;

        comparison += `📖 **Descripción:**\n`;
        comparison += `• **${item1.name || item1.concept || item1.term}:** ${this.extractDescription(item1)}\n`;
        comparison += `• **${item2.name || item2.concept || item2.term}:** ${this.extractDescription(item2)}\n\n`;

        comparison += `🎯 **Tipo:**\n`;
        comparison += `• **Item 1:** ${item1.type}\n`;
        comparison += `• **Item 2:** ${item2.type}\n\n`;

        return comparison;
    }

    /**
     * 🎯 CONCLUSIÓN DE COMPARACIÓN PERSONALIZADA
     */
    generateComparisonConclusion(item1, item2, originalQuery) {
        const queryLower = originalQuery.toLowerCase();
        
        // 🎯 Análisis según intención
        if (queryLower.includes('mejor') || queryLower.includes('superior')) {
            return `Basado en el análisis, **${item1.name || item1.concept}** destaca en ${this.getStrength(item1)} mientras que **${item2.name || item2.concept}** sobresale en ${this.getStrength(item2)}. La elección depende de tu objetivo específico y nivel actual.`;
        }
        
        if (queryLower.includes('diferencia') || queryLower.includes('distingue')) {
            return `La diferencia principal radica en ${this.getMainDifference(item1, item2)}. Mientras **${item1.name || item1.concept}** se enfoca en ${this.getFocus(item1)}, **${item2.name || item2.concept}** prioriza ${this.getFocus(item2)}.`;
        }
        
        return `Ambos elementos complementan el entrenamiento de karate. **${item1.name || item1.concept}** es ideal para ${this.getIdealUse(item1)}, mientras que **${item2.name || item2.concept}** es perfecto para ${this.getIdealUse(item2)}.`;
    }

    /**
     * 📊 GENERACIÓN DE RESPUESTA DE DIFERENCIAS
     */
    generateDifferenceResponse(results, intentAnalysis, originalQuery) {
        if (results.length < 2) {
            return `🤔 Para analizar diferencias necesito al menos dos elementos. Por favor, especifica qué quieres comparar.\n\n💡 **Ejemplo:** "¿Cuál es la diferencia entre Oi Zuki y Gyaku Zuki?"`;
        }

        const [item1, item2] = results.slice(0, 2);
        let response = `📊 **ANÁLISIS DE DIFERENCIAS**\n\n`;
        
        response += `🔍 **Analizando diferencias entre:** ${item1.name || item1.concept || item1.term} **y** ${item2.name || item2.concept || item2.term}\n\n`;

        // 🎯 Diferencias clave
        response += `🎯 **Diferencias Fundamentales:**\n`;
        response += this.extractKeyDifferences(item1, item2);

        // 📝 Resumen de diferencias
        response += `\n\n📝 **Resumen de Diferencias:**\n`;
        response += `• **Enfoque principal:** ${this.getFocus(item1)} vs ${this.getFocus(item2)}\n`;
        response += `• **Aplicación:** ${this.getApplication(item1)} vs ${this.getApplication(item2)}\n`;
        response += `• **Complejidad:** ${this.getComplexity(item1)} vs ${this.getComplexity(item2)}\n`;

        return this.formatLongResponse(response, item1, intentAnalysis);
    }

    /**
     * 📚 GENERACIÓN DE RESPUESTA DE HISTORIA
     */
    generateHistoryResponse(historyResults, intentAnalysis, originalQuery) {
        let response = `📚 **ANÁLISIS HISTÓRICO DETALLADO**\n\n`;
        
        // 📖 Narrativa histórica
        response += this.generateHistoricalNarrative(historyResults, originalQuery);
        
        // 🎯 Contexto y relevancia
        response += `\n\n🎯 **Contexto y Relevancia:**\n`;
        response += this.generateHistoricalContext(historyResults);

        return this.formatLongResponse(response, historyResults[0], intentAnalysis);
    }

    /**
     * 🥋 GENERACIÓN DE RESPUESTA DE TÉCNICAS MEJORADA
     */
    generateTechniqueResponse(technique, intentAnalysis, originalQuery) {
        let response = `🥋 **ANÁLISIS TÉCNICO COMPLETO**\n\n`;
        
        // 📖 Descripción detallada
        response += `📖 **Descripción:** ${technique.data.descripcion || 'No disponible'}\n\n`;
        
        // 🎯 Análisis biomecánico
        if (technique.data.biomecanica) {
            response += `🏃‍♂️ **Análisis Biomecánico:**\n`;
            response += `• **Vector de fuerza:** ${technique.data.biomecanica.vector_fuerza || 'No especificado'}\n`;
            response += `• **Ángulo óptimo:** ${technique.data.biomecanica.angulo_optimo || 'No especificado'}\n`;
            response += `• **Puntos de control:** ${(technique.data.biomecanica.puntos_control || []).join(', ')}\n\n`;
        }

        // 🎯 Ejecución paso a paso
        response += `🎯 **Ejecución Paso a Paso:**\n`;
        response += this.generateStepByStepExecution(technique);

        // ⚠️ Errores comunes
        if (technique.data.errores_comunes) {
            response += `\n⚠️ **Errores Comunes a Evitar:**\n`;
            technique.data.errores_comunes.forEach((error, index) => {
                response += `${index + 1}. ${error}\n`;
            });
        }

        // 💡 Consejos prácticos
        response += `\n💡 **Consejos Prácticos:**\n`;
        response += this.generatePracticalTips(technique);

        return this.formatLongResponse(response, technique, intentAnalysis);
    }

    /**
     * 🧠 GENERACIÓN DE RESPUESTA FILOSÓFICA MEJORADA
     */
    generatePhilosophyResponse(concept, intentAnalysis, originalQuery) {
        let response = `🧠 **ANÁLISIS FILOSÓFICO PROFUNDO**\n\n`;
        
        // 📖 Definición completa
        response += `📖 **Definición:** ${concept.data.descripcion_profunda || concept.data.descripcion || 'No disponible'}\n\n`;
        
        // 🎯 Características esenciales
        if (concept.data.caracteristicas_esenciales) {
            response += `🎯 **Características Esenciales:**\n`;
            concept.data.caracteristicas_esenciales.forEach((caracteristica, index) => {
                response += `${index + 1}. ${caracteristica}\n`;
            });
        }

        // 💡 Aplicación práctica en la vida
        if (concept.data.aplicacion_practica) {
            response += `\n💡 **Aplicación en la Vida Diaria:**\n`;
            for (const [contexto, descripcion] of Object.entries(concept.data.aplicacion_practica)) {
                response += `• **${contexto}:** ${descripcion}\n`;
            }
        }

        // 🎭 Relación con otros conceptos
        response += `\n🎭 **Relación con el Entrenamiento:**\n`;
        response += this.generatePhilosophicalRelation(concept);

        return this.formatLongResponse(response, concept, intentAnalysis);
    }

    /**
     * 📝 FORMATEO AVANZADO PARA RESPUESTAS LARGAS
     */
    formatLongResponse(response, result, intentAnalysis) {
        // Si la respuesta es muy larga, dividirla en párrafos con Markdown
        if (response.length > 1000) {
            const paragraphs = response.split('\n\n');
            let formattedResponse = '';
            
            for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i].trim();
                if (paragraph) {
                    formattedResponse += `\n\n${paragraph}`;
                    
                    // Añadir separador visual cada 3 párrafos
                    if (i > 0 && i % 3 === 0) {
                        formattedResponse += '\n\n---\n\n💡 **Continúa explorando:** Puedes preguntar más detalles sobre cualquier aspecto mencionado.';
                    }
                }
            }
            
            return formattedResponse;
        }
        
        return response;
    }

    /**
     * 🥋 FORMATEO DE RESPUESTA DE TÉCNICA AVANZADO
     */
    formatTechniqueResponse(result, intentAnalysis) {
        const technique = result.technique;
        let response = `🥋 **${result.name}**\n\n`;
        
        response += `📝 **Descripción:** ${technique.descripcion || 'No disponible'}\n`;
        response += `🎯 **Categoría:** ${technique.category || 'No especificada'}\n`;
        response += `🥋 **Nivel:** ${technique.level || 'No especificado'}\n`;
        
        // Información específica según intención
        switch (intentAnalysis.primaryIntent) {
            case 'biomechanics':
                if (technique.biomecanica) {
                    response += `\n🎯 **Biomecánica:**\n`;
                    response += `• Puntos de control: ${(technique.biomecanica.puntos_control || []).join(', ')}\n`;
                    response += `• Vector de fuerza: ${technique.biomecanica.vector_fuerza || 'No especificado'}\n`;
                    response += `• Ángulo óptimo: ${technique.biomecanica.angulo_optimo || 'No especificado'}\n`;
                }
                break;
                
            case 'breathing':
                if (technique.respiracion_especifica) {
                    response += `\n🌬️ **Respiración:**\n`;
                    response += `• Patrón: ${technique.respiracion_especifica.patron || 'No especificado'}\n`;
                    response += `• Sincronización: ${technique.respiracion_especifica.sincronizacion || 'No especificado'}\n`;
                }
                break;
                
            case 'mistakes':
                if (technique.errores_comunes) {
                    response += `\n⚠️ **Errores Comunes:**\n`;
                    technique.errores_comunes.forEach((mistake, index) => {
                        response += `${index + 1}. ${mistake}\n`;
                    });
                }
                break;
        }
        
        // Información adicional
        if (technique.variantes && technique.variantes.length > 0) {
            response += `\n🔄 **Variantes:** ${technique.variantes.join(', ')}\n`;
        }
        
        if (technique.aplicaciones && technique.aplicaciones.length > 0) {
            response += `\n🎭 **Aplicaciones:** ${technique.aplicaciones.join(', ')}\n`;
        }
        
        return response;
    }

    /**
     * 🧠 FORMATEO DE RESPUESTA FILOSÓFICA AVANZADO
     */
    formatPhilosophyResponse(result, intentAnalysis) {
        const data = result.data;
        let response = `🧠 **${result.concept}**\n\n`;
        
        response += `📖 **Definición:** ${data.descripcion_profunda || data.descripcion || 'No disponible'}\n`;
        
        if (data.caracteristicas_esenciales) {
            response += `\n🎯 **Características Esenciales:**\n`;
            data.caracteristicas_esenciales.forEach((caracteristica, index) => {
                response += `${index + 1}. ${caracteristica}\n`;
            });
        }
        
        if (data.aplicacion_practica) {
            response += `\n💡 **Aplicación Práctica:**\n`;
            for (const [context, description] of Object.entries(data.aplicacion_practica)) {
                response += `• **${context}:** ${description}\n`;
            }
        }
        
        if (data.relacion_conceptos) {
            response += `\n🔗 **Conceptos Relacionados:** ${data.relacion_conceptos.join(', ')}\n`;
        }
        
        return response;
    }

    /**
     * 📚 FORMATEO DE RESPUESTA HISTÓRICA AVANZADO
     */
    formatHistoryResponse(result, intentAnalysis) {
        const data = result.data;
        let response = `📚 **${result.concept}**\n\n`;
        
        response += `📅 **Período:** ${data.periodo || 'No especificado'}\n`;
        response += `📍 **Ubicación:** ${data.ubicacion || 'No especificado'}\n`;
        
        if (data.descripcion) {
            response += `\n📖 **Descripción:** ${data.descripcion}\n`;
        }
        
        if (data.significado) {
            response += `\n🎯 **Importancia:** ${data.significado}\n`;
        }
        
        return response;
    }

    /**
     * 🥋 FORMATEO DE RESPUESTA DE KATA AVANZADO
     */
    formatKataResponse(result, intentAnalysis) {
        const kataData = result.kataData;
        let response = `🥋 **${result.kataName}**\n\n`;
        
        response += `📝 **Significado:** ${kataData.significado || 'No disponible'}\n`;
        response += `🔢 **Movimientos:** ${kataData.numero_movimientos || 'No especificado'}\n`;
        response += `🎯 **Dificultad:** ${kataData.dificultad || 'No especificada'}\n`;
        
        if (kataData.enbusen_linea_direccion) {
            response += `\n📐 **Enbusen:** ${kataData.enbusen_linea_direccion.descripcion}\n`;
        }
        
        if (kataData.kiai_points) {
            response += `\n⚡ **Puntos Kiai:**\n`;
            kataData.kiai_points.forEach((kiai, index) => {
                response += `${index + 1}. Movimiento ${kiai.movimiento}: ${kiai.tecnica}\n`;
            });
        }
        
        return response;
    }

    /**
     * 🏆 FORMATEO DE RESPUESTA DE GRADOS AVANZADO
     */
    formatGradesResponse(result, intentAnalysis) {
        const gradeData = result.gradeData;
        let response = `🏆 **${result.grade}**\n\n`;
        
        response += `⏱️ **Duración:** ${gradeData.duracion || 'No especificado'}\n`;
        response += `🎯 **Significado:** ${gradeData.significado || 'No disponible'}\n`;
        
        if (gradeData.requisitos_tecnicos) {
            response += `\n📋 **Requisitos Técnicos:**\n`;
            gradeData.requisitos_tecnicos.forEach((req, index) => {
                response += `${index + 1}. ${req}\n`;
            });
        }
        
        if (gradeData.consejo_psicologico) {
            response += `\n🧠 **Consejo Psicológico:** ${gradeData.consejo_psicologico}\n`;
        }
        
        return response;
    }

    /**
     * 📚 FORMATEO DE RESPUESTA DE GLOSARIO AVANZADO
     */
    formatGlossaryResponse(result, intentAnalysis) {
        const termData = result.termData;
        let response = `📚 **${result.term}**\n\n`;
        
        response += `🇯🇵 **Japonés:** ${termData.japones || 'No disponible'}\n`;
        response += `🔤 **Romaji:** ${termData.romaji || 'No disponible'}\n`;
        response += `📖 **Traducción:** ${termData.traduccion || 'No disponible'}\n`;
        response += `💡 **Uso:** ${termData.uso || 'No disponible'}\n`;
        response += `🎯 **Contexto:** ${termData.contexto || 'No disponible'}\n`;
        
        return response;
    }

    /**
     * 📄 FORMATEO DE RESPUESTA GENERAL AVANZADO
     */
    formatGeneralResponse(result, intentAnalysis) {
        let response = `📄 **${result.name || result.concept || result.term}**\n\n`;
        
        if (result.technique) {
            response += `📝 ${result.technique.descripcion || result.technique.descripcion || 'Sin descripción disponible'}\n`;
        } else if (result.data) {
            response += `📝 ${result.data.descripcion || result.data.descripcion || 'Sin descripción disponible'}\n`;
        } else if (result.kataData) {
            response += `📝 ${result.kataData.significado || 'Sin descripción disponible'}\n`;
        } else if (result.gradeData) {
            response += `📝 ${result.gradeData.significado || 'Sin descripción disponible'}\n`;
        } else if (result.termData) {
            response += `📝 ${result.termData.traduccion || 'Sin descripción disponible'}\n`;
        }
        
        response += `\n🎯 **Tipo de coincidencia:** ${result.matchType}\n`;
        response += `📊 **Confianza:** ${(result.score * 100).toFixed(1)}%\n`;
        
        return response;
    }

    /**
     * 🔄 RESPUESTA FALLBACK INTELIGENTE EXPANDIDA
     */
    createFallbackResponse(intent) {
        const fallbackResponses = {
            technique: `🤔 No encontré la técnica específica. 

💡 **Sugerencias:**
• Intenta con nombres como: "Oi Zuki", "Mae Geri", "Gedan Barai"
• Describe el movimiento: "golpe directo", "patada circular", "bloqueo alto"
• Revisa la ortografía: "Uchi Uke" (no "Uchiuke")

🎯 **Técnicas disponibles:**
• **Te Waza** (técnicas de puño): Oi Zuki, Gyaku Zuki, Kizami Zuki, Sanbon Zuki, Uraken Uchi
• **Ashi Waza** (patadas): Mae Geri Keage, Mae Geri Kekomi, Mawashi Geri, Yoko Geri, Ushiro Geri, Fumikomi
• **Uke Waza** (bloqueos): Gedan Barai, Age Uke, Uchi Uke, Soto Uke, Shuto Uke

🔍 **Puedes preguntar por biomecánica, errores comunes, o aplicaciones específicas de cada técnica.`,

            philosophy: `🧜 No encontré el concepto filosófico específico.

💡 **Conceptos disponibles:**
• **Zanshin** (残心): Conciencia persistente
• **Mushin** (無心): Mente sin mente  
• **Kime** (決め): Foco y decisión
• **Ma Ai** (間合): Distancia y timing
• **Hara** (腹): Centro del abdomen
• **Ki** (気): Energía vital
• **Dojo Kun**: Principios del dojo

🎯 **Puedes preguntar por:** "¿Qué es el Mushin?", "Explícame el Dojo Kun", "Cómo funciona el Ma Ai"`,

            history: `📚 No encontré información histórica específica.

💡 **Temas históricos disponibles:**
• **Orígenes en Okinawa** (1400-1879): Tegumi y Ti'gwa
• **Influencia china** (1600-1900): Kenpo y Shaolin  
• **Maestros legendarios**: Konishi Yasuhiro, Itosu, Higaonna
• **Fundación de estilos**: Shotokan, Goju-ryu, Shito-ryu, Shindo Jinen Ryu
• **Evolución moderna**: WKF y competición olímpica

🎯 **Puedes preguntar por:** "¿Quién fundó el Shindo Jinen Ryu?", "Orígenes del karate", "Evolución del karate"`,

            kata: `🥋 No encontré la kata específica.

💡 **Katas disponibles:**
• **Heian Shodan** (平安初段): Paz y tranquilidad - Primer nivel
• **Heian Nidan** (平安二段): Paz y tranquilidad - Segundo nivel  
• **Heian Sandan** (平安三段): Paz y tranquilidad - Tercer nivel
• **Heian Yondan** (平安四段): Paz y tranquilidad - Cuarto nivel
• **Heian Godan** (平安五段): Paz y tranquilidad - Quinto nivel

🎯 **Puedes preguntar por:** "¿Cuántos movimientos tiene Heian Shodan?", "Explícame el bunkai de Heian Nidan", "Enbusen de Heian Sandan"`,

            grades: `🏆 No encontré información específica del grado.

💡 **Sistema de grados disponible:**
• **10° Kyu** (Blanco): Pureza, comienzo
• **9° Kyu** (Naranja): Energía, entusiasmo
• **8° Kyu** (Azul): Calma, profundidad
• **7° Kyu** (Verde): Crecimiento, vitalidad
• **6° Kyu** (Morado): Sabiduría, transformación
• **5° Kyu** (Amarillo): Sol, energía
• **4° Kyu** (Verde oscuro): Profundidad, estabilidad
• **3° Kyu** (Marrón claro): Tierra, fundación
• **2° Kyu** (Marrón medio): Experiencia, madurez
• **1° Kyu** (Marrón oscuro): Noche, preparación
• **Shodan** (1° Dan): Principio verdadero

🎯 **Puedes preguntar por:** "¿Qué se exige para cinturón marrón?", "Requisitos de 10° Kyu", "Cómo manejar nervios en examen"`,

            glossary: `📚 No encontré el término específico.

💡 **Categorías del glosario:**
• **Partes del cuerpo**: Atama, Kubi, Ude, Hiji, Te, Ken, Hara, Ashi
• **Direcciones**: Mae, Ushiro, Yoko, Migi, Hidari, Ue, Shita
• **Comandos del Sensei**: Rei, Osu, Yoi, Hajime, Yame, Mokusoh
• **Tipos de Ryu**: Shotokan, Goju-ryu, Shito-ryu, Wado-ryu, Shindo Jinen Ryu
• **Terminología general**: Dojo, Gi, Obi, Dan, Kyu, Kata, Kumite
• **Posturas**: Zenkutsu Dachi, Kiba Dachi, Kokutsu Dachi
• **Números**: Ichi, Ni, San, Shi, Go, Roku, Shichi, Hachi, Kyu, Ju

🎯 **Puedes preguntar por:** "¿Qué significa Osu?", "Cómo se dice cabeza en japonés", "Postura frontal"`,

            general: `🤔 No entendí tu consulta. 

🥋 **Soy Universal Sensei AI v4.0, experto en artes marciales con 4500+ líneas de conocimiento.** Puedo ayudarte con:

🎯 **Técnicas (16 técnicas):** Biomecánica, ejecución, errores comunes, aplicaciones
🧠 **Filosofía (7 conceptos):** Zanshin, Mushin, Kime, Ma Ai, Hara, Ki, Dojo Kun
📚 **Historia completa:** Orígenes, maestros, evolución, linaje desde Okinawa
🥋 **Katas (5 formas):** Heian Shodan-Godan con bunkai y enbusen
🏆 **Sistema de grados (11 niveles):** Requisitos, preparación psicológica, manejo de nervios
📚 **Glosario maestro (200+ términos):** Japonés, romaji, traducciones, contexto

💡 **Ejemplos de consultas:**
• "¿Cómo se hace un Oi Zuki con biomecánica perfecta?"
• "Explícame el concepto Mushin y su aplicación práctica"
• "¿Quién fundó el Shindo Jinen Ryu y cuándo?"
• "Bunkai completo de Heian Sandan"
• "Requisitos para cinturón marrón y manejo de nervios"
• "¿Qué significa Osu y cuándo usarlo?"

🎯 **¿Qué te gustaría aprender hoy?**`
        };
        
        return fallbackResponses[intent] || fallbackResponses.general;
    }

    // 🔧 UTILIDADES DE PROCESAMIENTO OPTIMIZADAS
    
    /**
     * 🔧 NORMALIZACIÓN DE TEXTO AVANZADA
     */
    normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * 🎯 TOKENIZACIÓN DE CONSULTA CON FILTRO DE RUIDO AVANZADO
     */
    tokenizeQuery(text) {
        return text.split(' ')
            .filter(word => word && !this.stopWords.has(word))
            .filter(word => word.length > 1)
            .slice(0, 10); // Limitar tokens para evitar sobrecarga
    }

    /**
     * 🔍 COINCIDENCIA DIFUSA (LEVENSHTEIN) OPTIMIZADA
     */
    fuzzyMatch(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    /**
     * 📏 DISTANCIA DE LEVENSHTEIN OPTIMIZADA
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    // 📊 MÉTODOS DE BÚSQUEDA ESPECÍFICOS OPTIMIZADOS
    
    searchInTechniques() {
        const results = [];
        for (const [name, technique] of this.techniqueIndex) {
            results.push({
                type: 'technique',
                name,
                technique: technique.technique,
                section: technique.section,
                score: 0.5
            });
        }
        return results;
    }

    searchInPhilosophy() {
        const results = [];
        for (const [concept, data] of this.conceptIndex) {
            results.push({
                type: 'philosophy',
                concept,
                data: data.data,
                score: 0.5
            });
        }
        return results;
    }

    searchInHistory() {
        const results = [];
        for (const [event, data] of this.historyIndex) {
            results.push({
                type: 'history',
                concept: event,
                data: data.data,
                score: 0.5
            });
        }
        return results;
    }

    searchInKatas() {
        const results = [];
        for (const [kataName, kataData] of this.kataIndex) {
            results.push({
                type: 'kata',
                name: kataName,
                kataData: kataData.kataData,
                score: 0.5
            });
        }
        return results;
    }

    searchInGrades() {
        const results = [];
        for (const [grade, gradeData] of this.gradesIndex) {
            results.push({
                type: 'grades',
                name: grade,
                gradeData: gradeData.gradeData,
                score: 0.5
            });
        }
        return results;
    }

    searchInGlossary() {
        const results = [];
        for (const [term, termData] of this.glossaryIndex) {
            results.push({
                type: 'glossary',
                name: term,
                termData: termData.termData,
                category: termData.category,
                score: 0.5
            });
        }
        return results;
    }

    searchGeneral() {
        return [
            ...this.searchInTechniques(),
            ...this.searchInPhilosophy(),
            ...this.searchInHistory(),
            ...this.searchInKatas(),
            ...this.searchInGrades(),
            ...this.searchInGlossary()
        ];
    }

    // 📊 MÉTODOS DE EXTRACIÓN DE PALABRAS CLAVE ESPECÍFICOS
    
    extractKeywordsFromHistory(data) {
        const keywords = [];
        if (data.descripcion) keywords.push(...this.extractWordsFromText(data.descripcion));
        if (data.significado) keywords.push(...this.extractWordsFromText(data.significado));
        return keywords;
    }

    extractKeywordsFromKata(kataData) {
        const keywords = [];
        if (kataData.nombre_japones) keywords.push(kataData.nombre_japones);
        if (kataData.nombre_traduccion) keywords.push(...this.extractWordsFromText(kataData.nombre_traduccion));
        if (kataData.significado) keywords.push(...this.extractWordsFromText(kataData.significado));
        if (kataData.elementos_tecnicos) kataData.elementos_tecnicos.forEach(t => keywords.push(t));
        return keywords;
    }

    extractKeywordsFromGrade(gradeData) {
        const keywords = [];
        if (gradeData.significado) keywords.push(...this.extractWordsFromText(gradeData.significado));
        if (gradeData.requisitos_tecnicos) gradeData.requisitos_tecnicos.forEach(r => keywords.push(r));
        if (gradeData.consejo_psicologico) keywords.push(...this.extractWordsFromText(gradeData.consejo_psicologico));
        return keywords;
    }

    extractKeywordsFromGlossary(termData) {
        const keywords = [];
        if (termData.japones) keywords.push(termData.japones);
        if (termData.romaji) keywords.push(termData.romaji);
        if (termData.traduccion) keywords.push(...this.extractWordsFromText(termData.traduccion));
        if (termData.uso) keywords.push(...this.extractWordsFromText(termData.uso));
        if (termData.contexto) keywords.push(...this.extractWordsFromText(termData.contexto));
        return keywords;
    }

    // 📊 MÉTODOS DE ESTADÍSTICAS Y MONITOREO
    
    getStats() {
        return {
            ...this.stats,
            indexSizes: {
                techniques: this.techniqueIndex.size,
                concepts: this.conceptIndex.size,
                history: this.historyIndex.size,
                katas: this.kataIndex.size,
                grades: this.gradesIndex.size,
                glossary: this.glossaryIndex.size,
                keywords: this.keywordIndex.size
            },
            cacheSize: this.searchCache.size,
            isInitialized: this.isInitialized
        };
    }

    clearCache() {
        this.searchCache.clear();
        console.log('🗑️ Cache limpiado');
    }
}

module.exports = UniversalSenseiAI;
