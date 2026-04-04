#!/usr/bin/env node

/**
 * 🥋 Universal Sensei AI - Motor Central de Conocimiento Marcial
 * Sistema de razonamiento de intención con capacidad infinita
 * @version 3.0 - Universal Architecture
 * @author Knowledge Engineer
 */

const fs = require('fs').promises;
const path = require('path');

class UniversalSenseiAI {
    constructor() {
        this.knowledgeBase = null;
        this.isInitialized = false;
        this.intentWeights = {
            exact: 1.0,
            fuzzy: 0.8,
            semantic: 0.6,
            contextual: 0.4
        };
        this.searchCache = new Map();
        this.intentPatterns = new Map();
        this.semanticMappings = new Map();
        
        this.initializeIntentPatterns();
        this.initializeSemanticMappings();
    }

    /**
     * 🧠 INICIALIZACIÓN DE PATRONES DE INTENCIÓN
     */
    initializeIntentPatterns() {
        // Patrones expandidos con pesos contextuales
        this.intentPatterns.set('technique', {
            keywords: ['tecnica', 'golpe', 'patada', 'bloqueo', 'defensa', 'ataque', 'movimiento'],
            weight: 1.0,
            contexts: ['ejecucion', 'como se hace', 'realizar', 'hacer']
        });

        this.intentPatterns.set('biomechanics', {
            keywords: ['biomecanica', 'cuerpo', 'posicion', 'postura', 'angulo', 'movimiento', 'control'],
            weight: 0.9,
            contexts: ['puntos de control', 'articulacion', 'mecanica', 'fisica']
        });

        this.intentPatterns.set('breathing', {
            keywords: ['respirar', 'respiracion', 'aire', 'kokyu', 'exhalar', 'inhalar', 'aliento'],
            weight: 0.9,
            contexts: ['patron', 'ritmo', 'sincronizacion', 'energia']
        });

        this.intentPatterns.set('philosophy', {
            keywords: ['filosofia', 'budo', 'do', 'camino', 'espiritual', 'mente', 'zen', 'mushin'],
            weight: 0.8,
            contexts: ['principios', 'valores', 'etica', 'disciplina']
        });

        this.intentPatterns.set('history', {
            keywords: ['historia', 'origen', 'fundador', 'maestro', 'linaje', 'okina', 'china'],
            weight: 0.8,
            contexts: ['cuando', 'donde', 'quien', 'evolucion', 'creacion']
        });

        this.intentPatterns.set('mistakes', {
            keywords: ['error', 'fallo', 'incorrecto', 'mal', 'problema', 'corregir', 'mejorar'],
            weight: 0.9,
            contexts: ['errores comunes', 'fallas', 'defectos', 'correccion']
        });

        this.intentPatterns.set('katas', {
            keywords: ['kata', 'katas', 'forma', 'secuencia', 'rutina', 'patron', 'practicar'],
            weight: 0.9,
            contexts: ['donde practico', 'secuencia', 'movimientos', 'aplicacion']
        });

        this.intentPatterns.set('targets', {
            keywords: ['golpear', 'impacto', 'target', 'objetivo', 'blanco', 'anatomia', 'kyusho'],
            weight: 0.9,
            contexts: ['donde golpea', 'puntos vitales', 'impacto', 'efectividad']
        });

        this.intentPatterns.set('pedagogy', {
            keywords: ['enseñar', 'aprender', 'metodo', 'pedagogia', 'educacion', 'nivel', 'cinturon'],
            weight: 0.8,
            contexts: ['como enseñar', 'metodologia', 'progresion', 'curriculum']
        });

        this.intentPatterns.set('competition', {
            keywords: ['competencia', 'torneo', 'reglas', 'arbitraje', 'kumite', 'puntuacion'],
            weight: 0.7,
            contexts: ['reglamento', 'competencia', 'campeonato', 'juez']
        });

        this.intentPatterns.set('preparation', {
            keywords: ['preparacion', 'entrenamiento', 'fisico', 'condicion', 'calentamiento'],
            weight: 0.8,
            contexts: ['preparacion fisica', 'acondicionamiento', 'ejercicios']
        });

        this.intentPatterns.set('nutrition', {
            keywords: ['nutricion', 'dieta', 'alimentacion', 'suplementos', 'energia', 'recuperacion'],
            weight: 0.6,
            contexts: ['comida', 'dieta', 'suplementos', 'nutrientes']
        });
    }

    /**
     * 🧩 MAPEOS SEMÁNTICOS CONTEXTUALES
     */
    initializeSemanticMappings() {
        // Mapeos conceptuales para inferencia semántica
        this.semanticMappings.set('movimiento circular', ['mawashi', 'circular', 'giro', 'rotacion']);
        this.semanticMappings.set('golpe directo', ['oi zuki', 'choku zuki', 'directo', 'frontal']);
        this.semanticMappings.set('defensa alta', ['jodan uke', 'age uke', 'alto', 'superior']);
        this.semanticMappings.set('defensa baja', ['gedan uke', 'bajo', 'inferior']);
        this.semanticMappings.set('energia vital', ['ki', 'chi', 'prana', 'energia interna']);
        this.semanticMappings.set('mente vacia', ['mushin', 'sin mente', 'flujo', 'estado zen']);
        this.semanticMappings.set('conciencia', ['zanshin', 'atencion', 'vigilancia', 'consciente']);
    }

    /**
     * 🚀 INICIALIZACIÓN ASÍNCRONA DEL SISTEMA
     */
    async initialize() {
        try {
            const startTime = Date.now();
            
            // Cargar base de conocimiento principal
            const knowledgePath = path.join(__dirname, '..', 'data', 'universal_knowledge_base.json');
            const knowledgeData = await fs.readFile(knowledgePath, 'utf8');
            this.knowledgeBase = JSON.parse(knowledgeData);
            
            // Indexación para búsqueda instantánea
            await this.buildSearchIndexes();
            
            this.isInitialized = true;
            const loadTime = Date.now() - startTime;
            
            console.log(`🥋 Universal Sensei AI inicializado en ${loadTime}ms`);
            console.log(`📚 ${Object.keys(this.knowledgeBase.techniques || {}).length} técnicas cargadas`);
            console.log(`🧠 ${Object.keys(this.knowledgeBase.philosophy || {}).length} conceptos filosóficos`);
            console.log(`📖 ${Object.keys(this.knowledgeBase.history || {}).length} eventos históricos`);
            console.log(`🎯 ${this.intentPatterns.size} patrones de intención configurados`);
            
        } catch (error) {
            console.error('❌ Error crítico en inicialización:', error.message);
            throw new Error('No se pudo inicializar el motor Universal Sensei');
        }
    }

    /**
     * 🏗️ CONSTRUCCIÓN DE ÍNDICES DE BÚSQUEDA
     */
    async buildSearchIndexes() {
        this.techniqueIndex = new Map();
        this.conceptIndex = new Map();
        this.keywordIndex = new Map();
        
        // Indexar técnicas
        if (this.knowledgeBase.techniques) {
            for (const [name, technique] of Object.entries(this.knowledgeBase.techniques)) {
                const normalizedName = this.normalizeText(name);
                this.techniqueIndex.set(normalizedName, { name, technique });
                
                // Indexar palabras clave
                const keywords = [
                    name,
                    ...(technique.keywords || []),
                    ...(technique.variants || []),
                    technique.category,
                    technique.description
                ].filter(Boolean);
                
                for (const keyword of keywords) {
                    const normalizedKeyword = this.normalizeText(keyword);
                    if (!this.keywordIndex.has(normalizedKeyword)) {
                        this.keywordIndex.set(normalizedKeyword, []);
                    }
                    this.keywordIndex.get(normalizedKeyword).push({
                        type: 'technique',
                        name,
                        technique
                    });
                }
            }
        }
        
        // Indexar conceptos filosóficos
        if (this.knowledgeBase.philosophy) {
            for (const [concept, data] of Object.entries(this.knowledgeBase.philosophy)) {
                const normalizedConcept = this.normalizeText(concept);
                this.conceptIndex.set(normalizedConcept, { concept, data });
                
                // Indexar palabras clave de conceptos
                const keywords = [
                    concept,
                    ...(data.keywords || []),
                    ...(data.related_concepts || []),
                    data.description
                ].filter(Boolean);
                
                for (const keyword of keywords) {
                    const normalizedKeyword = this.normalizeText(keyword);
                    if (!this.keywordIndex.has(normalizedKeyword)) {
                        this.keywordIndex.set(normalizedKeyword, []);
                    }
                    this.keywordIndex.get(normalizedKeyword).push({
                        type: 'philosophy',
                        concept,
                        data
                    });
                }
            }
        }
        
        console.log(`🔍 Índices construidos: ${this.techniqueIndex.size} técnicas, ${this.conceptIndex.size} conceptos, ${this.keywordIndex.size} palabras clave`);
    }

    /**
     * 🧠 PROCESAMIENTO PRINCIPAL DE CONSULTAS
     */
    async processQuery(query) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        
        if (!query || typeof query !== 'string') {
            return this.createFallbackResponse('consulta_vacia');
        }
        
        // Normalización y limpieza
        const normalizedQuery = this.normalizeText(query);
        const queryTokens = this.tokenizeQuery(normalizedQuery);
        
        console.log(`🔍 Procesando consulta: "${query}" -> ${normalizedQuery}`);
        console.log(`🎯 Tokens detectados: [${queryTokens.join(', ')}]`);
        
        // Detección de intención con puntaje
        const intentAnalysis = this.detectIntentWithScoring(queryTokens);
        console.log(`🎯 Intención detectada: ${intentAnalysis.primaryIntent} (${intentAnalysis.confidence})`);
        
        // Búsqueda multi-estratégica
        const searchResults = await this.performMultiStrategySearch(queryTokens, intentAnalysis);
        
        // Ranking y filtrado de resultados
        const rankedResults = this.rankResults(searchResults, intentAnalysis);
        
        // Generación de respuesta contextual
        return this.generateContextualResponse(rankedResults, intentAnalysis, query);
    }

    /**
     * 🎯 DETECCIÓN DE INTENCIÓN CON PUNTAJE AVANZADO
     */
    detectIntentWithScoring(tokens) {
        const intentScores = new Map();
        const detectedKeywords = new Map();
        
        // Análisis por patrones
        for (const [intent, pattern] of this.intentPatterns) {
            let score = 0;
            let matchedKeywords = [];
            
            // Puntuación por palabras clave directas
            for (const token of tokens) {
                for (const keyword of pattern.keywords) {
                    if (token.includes(keyword) || keyword.includes(token)) {
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
     * 🔍 BÚSQUEDA MULTI-ESTRATÉGICA
     */
    async performMultiStrategySearch(tokens, intentAnalysis) {
        const results = [];
        
        // Estrategia 1: Búsqueda exacta en índice
        const exactMatches = this.searchExactMatches(tokens);
        results.push(...exactMatches);
        
        // Estrategia 2: Búsqueda fuzzy
        const fuzzyMatches = this.searchFuzzyMatches(tokens);
        results.push(...fuzzyMatches);
        
        // Estrategia 3: Búsqueda semántica
        const semanticMatches = this.searchSemanticMatches(tokens);
        results.push(...semanticMatches);
        
        // Estrategia 4: Búsqueda contextual por intención
        const contextualMatches = this.searchContextualByIntent(intentAnalysis);
        results.push(...contextualMatches);
        
        return results;
    }

    /**
     * 🎯 BÚSQUEDA EXACTA EN ÍNDICE
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
     * 🔍 BÚSQUEDA FUZZY
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
     * 🧩 BÚSQUEDA SEMÁNTICA
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
     * 🎯 BÚSQUEDA CONTEXTUAL POR INTENCIÓN
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
            case 'biomechanics':
                results.push(...this.searchInBiomechanics());
                break;
            case 'breathing':
                results.push(...this.searchInBreathing());
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
     * 📊 RANKING DE RESULTADOS
     */
    rankResults(results, intentAnalysis) {
        // Eliminar duplicados
        const uniqueResults = new Map();
        
        for (const result of results) {
            const key = `${result.type}-${result.name || result.concept}`;
            
            if (!uniqueResults.has(key) || result.score > uniqueResults.get(key).score) {
                uniqueResults.set(key, result);
            }
        }
        
        // Ordenar por score
        return Array.from(uniqueResults.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 resultados
    }

    /**
     * 💬 GENERACIÓN DE RESPUESTA CONTEXTUAL
     */
    generateContextualResponse(results, intentAnalysis, originalQuery) {
        if (results.length === 0) {
            return this.createFallbackResponse(intentAnalysis.primaryIntent);
        }
        
        const primaryResult = results[0];
        
        // Construir respuesta según tipo y intención
        switch (primaryResult.type) {
            case 'technique':
                return this.formatTechniqueResponse(primaryResult, intentAnalysis);
            case 'philosophy':
                return this.formatPhilosophyResponse(primaryResult, intentAnalysis);
            case 'history':
                return this.formatHistoryResponse(primaryResult, intentAnalysis);
            default:
                return this.formatGeneralResponse(primaryResult, intentAnalysis);
        }
    }

    /**
     * 🥋 FORMATEO DE RESPUESTA DE TÉCNICA
     */
    formatTechniqueResponse(result, intentAnalysis) {
        const technique = result.technique;
        let response = `🥋 **${result.name}**\n\n`;
        
        response += `📝 **Descripción:** ${technique.description || 'No disponible'}\n`;
        response += `🎯 **Categoría:** ${technique.category || 'No especificada'}\n`;
        response += `🥋 **Nivel:** ${technique.level || 'No especificado'}\n`;
        
        // Información específica según intención
        switch (intentAnalysis.primaryIntent) {
            case 'biomechanics':
                if (technique.biomechanics) {
                    response += `\n🎯 **Biomecánica:**\n`;
                    response += `• Puntos de control: ${(technique.biomechanics.controlPoints || []).join(', ')}\n`;
                    response += `• Vector de fuerza: ${technique.biomechanics.forceVector || 'No especificado'}\n`;
                    response += `• Ángulo óptimo: ${technique.biomechanics.angle || 'No especificado'}\n`;
                }
                break;
                
            case 'breathing':
                if (technique.breathing) {
                    response += `\n🌬️ **Respiración:**\n`;
                    response += `• Patrón: ${technique.breathing.pattern || 'No especificado'}\n`;
                    response += `• Sincronización: ${technique.breathing.timing || 'No especificado'}\n`;
                }
                break;
                
            case 'mistakes':
                if (technique.commonMistakes) {
                    response += `\n⚠️ **Errores Comunes:**\n`;
                    technique.commonMistakes.forEach((mistake, index) => {
                        response += `${index + 1}. ${mistake}\n`;
                    });
                }
                break;
        }
        
        // Información adicional
        if (technique.variants && technique.variants.length > 0) {
            response += `\n🔄 **Variantes:** ${technique.variants.join(', ')}\n`;
        }
        
        if (technique.applications && technique.applications.length > 0) {
            response += `\n🎭 **Aplicaciones:** ${technique.applications.join(', ')}\n`;
        }
        
        return response;
    }

    /**
     * 🧠 FORMATEO DE RESPUESTA FILOSÓFICA
     */
    formatPhilosophyResponse(result, intentAnalysis) {
        const data = result.data;
        let response = `🧠 **${result.concept}**\n\n`;
        
        response += `📖 **Definición:** ${data.description || 'No disponible'}\n`;
        
        if (data.principles && data.principles.length > 0) {
            response += `\n🎯 **Principios:**\n`;
            data.principles.forEach((principle, index) => {
                response += `${index + 1}. ${principle}\n`;
            });
        }
        
        if (data.applications) {
            response += `\n💡 **Aplicación práctica:** ${data.applications}\n`;
        }
        
        if (data.relatedConcepts && data.relatedConcepts.length > 0) {
            response += `\n🔗 **Conceptos relacionados:** ${data.relatedConcepts.join(', ')}\n`;
        }
        
        return response;
    }

    /**
     * 📚 FORMATEO DE RESPUESTA HISTÓRICA
     */
    formatHistoryResponse(result, intentAnalysis) {
        const data = result.data;
        let response = `📚 **${result.concept}**\n\n`;
        
        response += `📅 **Período:** ${data.period || 'No especificado'}\n`;
        response += `📍 **Ubicación:** ${data.location || 'No especificado'}\n`;
        response += `👤 **Figuras clave:** ${(data.keyFigures || []).join(', ')}\n\n`;
        
        response += `📖 **Descripción:** ${data.description || 'No disponible'}\n`;
        
        if (data.significance) {
            response += `\n🎯 **Importancia:** ${data.significance}\n`;
        }
        
        if (data.legacy) {
            response += `\n🏛️ **Legado:** ${data.legacy}\n`;
        }
        
        return response;
    }

    /**
     * 📄 FORMATEO DE RESPUESTA GENERAL
     */
    formatGeneralResponse(result, intentAnalysis) {
        let response = `📄 **${result.name || result.concept}**\n\n`;
        
        if (result.technique) {
            response += `📝 ${result.technique.description || 'Sin descripción disponible'}\n`;
        } else if (result.data) {
            response += `📝 ${result.data.description || 'Sin descripción disponible'}\n`;
        }
        
        response += `\n🎯 **Tipo de coincidencia:** ${result.matchType}\n`;
        response += `📊 **Confianza:** ${(result.score * 100).toFixed(1)}%\n`;
        
        return response;
    }

    /**
     * 🔄 RESPUESTA FALLBACK INTELIGENTE
     */
    createFallbackResponse(intent) {
        const fallbackResponses = {
            technique: `🤔 No encontré la técnica específica. 

💡 **Sugerencias:**
• Intenta con nombres como: "Oi Zuki", "Mae Geri", "Gedan Barai"
• Describe el movimiento: "golpe directo", "patada circular", "bloqueo alto"
• Revisa la ortografía: "Uchi Uke" (no "Uchiuke")

🎯 **Técnicas disponibles:**
• **Te Waza** (técnicas de puño): Oi Zuki, Gyaku Zuki, Sanbon Zuki
• **Ashi Waza** (patadas): Mae Geri, Yoko Geri, Mawashi Geri
• **Fusegui Waza** (bloqueos): Uchi Uke, Soto Uke, Gedan Barai`,

            philosophy: `🧜 No encontré el concepto filosófico específico.

💡 **Conceptos disponibles:**
• **Budo**: El camino del guerrero
• **Dojo Kun**: Principios del dojo
• **Mushin**: Mente sin mente
• **Zanshin**: Conciencia persistente
• **Shugyo**: Entrenamiento ascético
• **Reishiki**: Etiqueta y protocolo

🎯 **Puedes preguntar por:** "¿Qué es el Budo?", "Explícame el Dojo Kun"`,

            history: `📚 No encontré información histórica específica.

💡 **Temas históricos disponibles:**
• **Orígenes en Okinawa**: Tegumi y Ti'gwa
• **Influencia china**: Kenpo y Shaolin
• **Maestros legendarios**: Funakoshi, Miyagi, Mabuni
• **Fundación de estilos**: Shotokan, Goju-ryu, Shito-ryu
• **Evolución moderna**: WKF y competición

🎯 **Puedes preguntar por:** "¿Quién fundó el Shotokan?", "Orígenes del karate"`,

            general: `🤔 No entendí tu consulta. 

🥋 **Soy Sensei AI, experto en artes marciales.** Puedo ayudarte con:

🎯 **Técnicas**: Biomecánica, ejecución, errores comunes
🧠 **Filosofía**: Principios del Budo, valores marciales
📚 **Historia**: Orígenes, maestros, evolución
🌬️ **Respiración**: Kokyu, kime, energía vital
📖 **Terminología**: Diccionario completo de karate
🏆 **Competencia**: Reglas, kumite, kata

💡 **Ejemplos:**
• "¿Cómo se hace un Oi Zuki?"
• "Explícame el concepto Mushin"
• "¿Cuál es el origen del Shotokan?"

🎯 **¿Qué te gustaría aprender hoy?**`
        };
        
        return fallbackResponses[intent] || fallbackResponses.general;
    }

    /**
     * 🔧 UTILIDADES DE PROCESAMIENTO
     */
    normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    tokenizeQuery(text) {
        const stopWords = ['como', 'se', 'en', 'el', 'un', 'una', 'los', 'las', 'de', 'del', 'para', 'por', 'con', 'sin', 'sobre', 'entre', 'hacia', 'hasta', 'que', 'cual', 'cuales', 'cuando', 'donde', 'porque', 'a', 'o', 'y', 'pero', 'mas', 'ni', 'si', 'no', 'es', 'son', 'fue', 'fueron', 'ser', 'estar', 'han', 'ha', 'haber', 'habia', 'habian', 'mi', 'tu', 'su', 'nuestro', 'vuestro', 'este', 'esta', 'estos', 'estas', 'aquel', 'aquella', 'aquellos', 'aquellas', 'la', 'lo', 'le', 'les', 'me', 'te'];
        
        return text.split(' ')
            .filter(word => word && !stopWords.includes(word))
            .filter(word => word.length > 1);
    }

    fuzzyMatch(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

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

    // Métodos de búsqueda específicos
    searchInTechniques() {
        const results = [];
        if (this.knowledgeBase.techniques) {
            for (const [name, technique] of Object.entries(this.knowledgeBase.techniques)) {
                results.push({
                    type: 'technique',
                    name,
                    technique,
                    score: 0.5
                });
            }
        }
        return results;
    }

    searchInPhilosophy() {
        const results = [];
        if (this.knowledgeBase.philosophy) {
            for (const [concept, data] of Object.entries(this.knowledgeBase.philosophy)) {
                results.push({
                    type: 'philosophy',
                    concept,
                    data,
                    score: 0.5
                });
            }
        }
        return results;
    }

    searchInHistory() {
        const results = [];
        if (this.knowledgeBase.history) {
            for (const [event, data] of Object.entries(this.knowledgeBase.history)) {
                results.push({
                    type: 'history',
                    concept: event,
                    data,
                    score: 0.5
                });
            }
        }
        return results;
    }

    searchInBiomechanics() {
        const results = [];
        if (this.knowledgeBase.techniques) {
            for (const [name, technique] of Object.entries(this.knowledgeBase.techniques)) {
                if (technique.biomechanics) {
                    results.push({
                        type: 'technique',
                        name,
                        technique,
                        score: 0.7,
                        specialty: 'biomechanics'
                    });
                }
            }
        }
        return results;
    }

    searchInBreathing() {
        const results = [];
        if (this.knowledgeBase.techniques) {
            for (const [name, technique] of Object.entries(this.knowledgeBase.techniques)) {
                if (technique.breathing) {
                    results.push({
                        type: 'technique',
                        name,
                        technique,
                        score: 0.7,
                        specialty: 'breathing'
                    });
                }
            }
        }
        return results;
    }

    searchGeneral() {
        return [
            ...this.searchInTechniques(),
            ...this.searchInPhilosophy(),
            ...this.searchInHistory()
        ];
    }
}

module.exports = UniversalSenseiAI;
