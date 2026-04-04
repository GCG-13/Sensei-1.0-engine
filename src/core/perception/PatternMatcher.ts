/**
 * 🎭 PATTERN MATCHER AVANZADO
 * Sistema de percepción para reconocimiento de intenciones y patrones complejos
 * Implementa coincidencias exactas, difusas y semánticas con contexto
 * 
 * @author Senior Software Engineer
 * @version 2.0.0 - Advanced Pattern Recognition
 */

import type { UserIntent, NLPProcessResult, SearchResult } from '@/types';

// 🎯 INTERFACES PARA PATRONES DE COINCIDENCIA
export interface Pattern {
  id: string;
  name: string;
  type: 'exact' | 'fuzzy' | 'semantic' | 'contextual';
  pattern: RegExp | string | string[];
  intent: UserIntent;
  confidence: number;
  context?: PatternContext;
  metadata: PatternMetadata;
}

export interface PatternContext {
  requiredKeywords: string[];
  excludedKeywords: string[];
  requiredIntent?: UserIntent;
  minConfidence: number;
  maxDistance?: number; // Para fuzzy matching
}

export interface PatternMetadata {
  category: string;
  priority: number;
  description: string;
  examples: string[];
  lastUsed: number;
  successRate: number;
}

export interface PatternMatch {
  pattern: Pattern;
  matchedText: string;
  confidence: number;
  matchType: 'exact' | 'fuzzy' | 'semantic' | 'contextual';
  context: MatchContext;
  score: number;
}

export interface MatchContext {
  currentPosition: number;
  surroundingWords: string[];
  previousIntents: UserIntent[];
  sessionContext: SessionContext;
}

export interface SessionContext {
  sessionId: string;
  conversationHistory: string[];
  userPreferences: Record<string, any>;
  currentTopic?: string;
}

export interface SimilarityThreshold {
  exact: number;
  fuzzy: number;
  semantic: number;
  contextual: number;
  overall: number;
}

/**
 * 🎭 PATTERN MATCHER PRINCIPAL
 * Sistema avanzado de reconocimiento de patrones con múltiples estrategias
 */
export class PatternMatcher {
  // 📚 LIBRERÍA DE PATRONES
  private patternLibrary: Map<string, Pattern> = new Map();
  
  // 🎯 UMBRALES DE SIMILITUD
  private similarityThreshold: SimilarityThreshold;
  
  // 🧠 CONTEXTO ACTUAL
  private currentContext: SessionContext;
  
  // 📊 MÉTRicas DE RENDIMIENTO
  private performanceMetrics: {
    totalMatches: number;
    successfulMatches: number;
    averageConfidence: number;
    patternUsage: Map<string, number>;
  };
  
  // 🔄 CACHE DE COINCIDENCIAS
  private matchCache: Map<string, PatternMatch[]> = new Map();
  private maxCacheSize: number = 1000;
  
  constructor(thresholds?: Partial<SimilarityThreshold>) {
    this.similarityThreshold = {
      exact: 0.95,
      fuzzy: 0.8,
      semantic: 0.7,
      contextual: 0.6,
      overall: 0.75,
      ...thresholds
    };
    
    this.performanceMetrics = {
      totalMatches: 0,
      successfulMatches: 0,
      averageConfidence: 0,
      patternUsage: new Map()
    };
    
    this.currentContext = {
      sessionId: this.generateSessionId(),
      conversationHistory: [],
      userPreferences: {}
    };
    
    this.initializePatternLibrary();
    this.startContextTracking();
  }
  
  /**
   * 🎯 MÉTODO PRINCIPAL - RECONOCIMIENTO DE PATRONES
   * Soporta coincidencias exactas, difusas, semánticas y contextuales
   */
  public async matchPattern(
    input: string, 
    context?: Partial<SessionContext>
  ): Promise<PatternMatch[]> {
    const startTime = Date.now();
    
    try {
      // 🔄 ACTUALIZAR CONTEXTO
      this.updateContext(context);
      
      // 📊 VERIFICAR CACHE
      const cacheKey = this.generateCacheKey(input);
      if (this.matchCache.has(cacheKey)) {
        return this.matchCache.get(cacheKey)!;
      }
      
      // 🧠 PREPROCESAMIENTO DEL INPUT
      const processedInput = this.preprocessInput(input);
      
      // 🎯 EJECUTAR TODAS LAS ESTRATEGIAS DE COINCIDENCIA
      const matches: PatternMatch[] = [];
      
      // 1. 🔍 COINCIDENCIAS EXACTAS
      const exactMatches = this.findExactMatches(processedInput);
      matches.push(...exactMatches);
      
      // 2. 🔍 COINCIDENCIAS DIFUSAS (FUZZY)
      if (matches.length === 0) {
        const fuzzyMatches = this.findFuzzyMatches(processedInput);
        matches.push(...fuzzyMatches);
      }
      
      // 3. 🔍 COINCIDENCIAS SEMÁNTICAS
      if (matches.length === 0) {
        const semanticMatches = this.findSemanticMatches(processedInput);
        matches.push(...semanticMatches);
      }
      
      // 4. 🔍 COINCIDENCIAS CONTEXTUALES
      if (matches.length === 0) {
        const contextualMatches = this.findContextualMatches(processedInput);
        matches.push(...contextualMatches);
      }
      
      // 📊 FILTRAR Y ORDENAR RESULTADOS
      const filteredMatches = this.filterAndSortMatches(matches);
      
      // 🔄 ACTUALIZAR MÉTRICAS
      this.updateMetrics(filteredMatches, Date.now() - startTime);
      
      // 📊 ALMACENAR EN CACHE
      this.storeInCache(cacheKey, filteredMatches);
      
      return filteredMatches;
      
    } catch (error) {
      console.error('❌ Error en PatternMatcher.matchPattern:', error);
      return [];
    }
  }
  
  /**
   * 🔍 COINCIDENCIAS EXACTAS
   */
  private findExactMatches(input: string): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    for (const [patternId, pattern] of this.patternLibrary) {
      if (pattern.type !== 'exact') continue;
      
      let matched = false;
      let matchedText = '';
      
      if (pattern.pattern instanceof RegExp) {
        const regexMatch = input.match(pattern.pattern);
        if (regexMatch) {
          matched = true;
          matchedText = regexMatch[0] || input;
        }
      } else if (typeof pattern.pattern === 'string') {
        if (input.toLowerCase().includes(pattern.pattern.toLowerCase())) {
          matched = true;
          matchedText = pattern.pattern;
        }
      } else if (Array.isArray(pattern.pattern)) {
        for (const patternStr of pattern.pattern) {
          if (input.toLowerCase().includes(patternStr.toLowerCase())) {
            matched = true;
            matchedText = patternStr;
            break;
          }
        }
      }
      
      if (matched && this.validateContext(pattern, input)) {
        const match: PatternMatch = {
          pattern,
          matchedText,
          confidence: pattern.confidence,
          matchType: 'exact',
          context: this.createMatchContext(input, matchedText),
          score: this.calculateMatchScore(pattern, 'exact', matchedText)
        };
        
        matches.push(match);
      }
    }
    
    return matches.filter(match => match.confidence >= this.similarityThreshold.exact);
  }
  
  /**
   * 🔍 COINCIDENCIAS DIFUSAS (FUZZY)
   */
  private findFuzzyMatches(input: string): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    for (const [patternId, pattern] of this.patternLibrary) {
      if (pattern.type !== 'fuzzy') continue;
      
      if (typeof pattern.pattern === 'string') {
        const similarity = this.calculateFuzzySimilarity(input, pattern.pattern);
        
        if (similarity >= this.similarityThreshold.fuzzy && this.validateContext(pattern, input)) {
          const match: PatternMatch = {
            pattern,
            matchedText: pattern.pattern,
            confidence: similarity * pattern.confidence,
            matchType: 'fuzzy',
            context: this.createMatchContext(input, pattern.pattern),
            score: this.calculateMatchScore(pattern, 'fuzzy', pattern.pattern, similarity)
          };
          
          matches.push(match);
        }
      } else if (Array.isArray(pattern.pattern)) {
        for (const patternStr of pattern.pattern) {
          const similarity = this.calculateFuzzySimilarity(input, patternStr);
          
          if (similarity >= this.similarityThreshold.fuzzy && this.validateContext(pattern, input)) {
            const match: PatternMatch = {
              pattern,
              matchedText: patternStr,
              confidence: similarity * pattern.confidence,
              matchType: 'fuzzy',
              context: this.createMatchContext(input, patternStr),
              score: this.calculateMatchScore(pattern, 'fuzzy', patternStr, similarity)
            };
            
            matches.push(match);
            break; // Solo la mejor coincidencia por patrón
          }
        }
      }
    }
    
    return matches.filter(match => match.confidence >= this.similarityThreshold.fuzzy);
  }
  
  /**
   * 🔍 COINCIDENCIAS SEMÁNTICAS
   */
  private findSemanticMatches(input: string): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    for (const [patternId, pattern] of this.patternLibrary) {
      if (pattern.type !== 'semantic') continue;
      
      // 🧠 ANÁLISIS SEMÁNTICO BASADO EN KEYWORDS
      const semanticSimilarity = this.calculateSemanticSimilarity(input, pattern);
      
      if (semanticSimilarity >= this.similarityThreshold.semantic && this.validateContext(pattern, input)) {
        const match: PatternMatch = {
          pattern,
          matchedText: input, // El input completo para coincidencias semánticas
          confidence: semanticSimilarity * pattern.confidence,
          matchType: 'semantic',
          context: this.createMatchContext(input, input),
          score: this.calculateMatchScore(pattern, 'semantic', input, semanticSimilarity)
        };
        
        matches.push(match);
      }
    }
    
    return matches.filter(match => match.confidence >= this.similarityThreshold.semantic);
  }
  
  /**
   * 🔍 COINCIDENCIAS CONTEXTUALES
   */
  private findContextualMatches(input: string): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    for (const [patternId, pattern] of this.patternLibrary) {
      if (pattern.type !== 'contextual') continue;
      
      // 🎯 ANÁLISIS CONTEXTUAL AVANZADO
      const contextualScore = this.calculateContextualScore(input, pattern);
      
      if (contextualScore >= this.similarityThreshold.contextual && this.validateContext(pattern, input)) {
        const match: PatternMatch = {
          pattern,
          matchedText: input,
          confidence: contextualScore * pattern.confidence,
          matchType: 'contextual',
          context: this.createMatchContext(input, input),
          score: this.calculateMatchScore(pattern, 'contextual', input, contextualScore)
        };
        
        matches.push(match);
      }
    }
    
    return matches.filter(match => match.confidence >= this.similarityThreshold.contextual);
  }
  
  /**
   * 🧠 CÁLCULO DE SIMILITUD DIFUSA (LEVENSHTEIN)
   */
  private calculateFuzzySimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  /**
   * 📏 DISTANCIA DE LEVENSHTEIN OPTIMIZADA
   */
  private levenshteinDistance(str1: string, str2: string): number {
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
  
  /**
   * 🧠 CÁLCULO DE SIMILITUD SEMÁNTICA
   */
  private calculateSemanticSimilarity(input: string, pattern: Pattern): number {
    if (!pattern.context?.requiredKeywords) return 0;
    
    const inputWords = input.toLowerCase().split(/\s+/);
    const requiredKeywords = pattern.context.requiredKeywords.map(k => k.toLowerCase());
    
    let matches = 0;
    for (const keyword of requiredKeywords) {
      if (inputWords.some(word => word.includes(keyword) || keyword.includes(word))) {
        matches++;
      }
    }
    
    return matches / requiredKeywords.length;
  }
  
  /**
   * 🎯 CÁLCULO DE PUNTUACIÓN CONTEXTUAL
   */
  private calculateContextualScore(input: string, pattern: Pattern): number {
    let score = 0;
    
    // 📊 KEYWORDS REQUERIDAS
    if (pattern.context?.requiredKeywords) {
      const keywordScore = this.calculateSemanticSimilarity(input, pattern);
      score += keywordScore * 0.4;
    }
    
    // 📊 HISTORIAL DE CONVERSACIÓN
    if (this.currentContext.conversationHistory.length > 0) {
      const conversationScore = this.calculateConversationRelevance(input, pattern);
      score += conversationScore * 0.3;
    }
    
    // 📊 TEMA ACTUAL
    if (this.currentContext.currentTopic) {
      const topicScore = this.calculateTopicRelevance(input, pattern);
      score += topicScore * 0.2;
    }
    
    // 📊 PREFERENCIAS DE USUARIO
    const preferenceScore = this.calculatePreferenceRelevance(input, pattern);
    score += preferenceScore * 0.1;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * 📊 VALIDACIÓN DE CONTEXTO
   */
  private validateContext(pattern: Pattern, input: string): boolean {
    if (!pattern.context) return true;
    
    const inputLower = input.toLowerCase();
    
    // 📊 KEYWORDS REQUERIDAS
    if (pattern.context.requiredKeywords) {
      for (const keyword of pattern.context.requiredKeywords) {
        if (!inputLower.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }
    
    // 📊 KEYWORDS EXCLUIDAS
    if (pattern.context.excludedKeywords) {
      for (const keyword of pattern.context.excludedKeywords) {
        if (inputLower.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }
    
    // 📊 INTENCIÓN REQUERIDA
    if (pattern.context.requiredIntent) {
      // Aquí se podría verificar la intención anterior si está disponible
    }
    
    return true;
  }
  
  /**
   * 🎯 CREACIÓN DE CONTEXTO DE COINCIDENCIA
   */
  private createMatchContext(input: string, matchedText: string): MatchContext {
    const words = input.split(/\s+/);
    const matchedIndex = words.findIndex(word => 
      word.toLowerCase().includes(matchedText.toLowerCase()) ||
      matchedText.toLowerCase().includes(word.toLowerCase())
    );
    
    return {
      currentPosition: matchedIndex >= 0 ? matchedIndex : 0,
      surroundingWords: this.getSurroundingWords(words, matchedIndex, 3),
      previousIntents: [], // Se podría implementar seguimiento de intenciones
      sessionContext: this.currentContext
    };
  }
  
  /**
   * 📊 FILTRADO Y ORDENAMIENTO DE COINCIDENCIAS
   */
  private filterAndSortMatches(matches: PatternMatch[]): PatternMatch[] {
    // 📊 FILTRAR POR UMBRAL MÍNIMO
    const filtered = matches.filter(match => 
      match.score >= this.similarityThreshold.overall
    );
    
    // 📊 ORDENAR POR PUNTUACIÓN Y PRIORIDAD
    return filtered.sort((a, b) => {
      // Primero por puntuación
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      
      // Luego por prioridad del patrón
      return b.pattern.priority - a.pattern.priority;
    });
  }
  
  /**
   * 🧠 CÁLCULO DE PUNTUACIÓN DE COINCIDENCIA
   */
  private calculateMatchScore(
    pattern: Pattern, 
    matchType: string, 
    matchedText: string, 
    similarity?: number
  ): number {
    let baseScore = pattern.confidence;
    
    // 📊 AJUSTE POR TIPO DE COINCIDENCIA
    switch (matchType) {
      case 'exact':
        baseScore *= 1.0;
        break;
      case 'fuzzy':
        baseScore *= (similarity || 0.8);
        break;
      case 'semantic':
        baseScore *= 0.85;
        break;
      case 'contextual':
        baseScore *= 0.75;
        break;
    }
    
    // 📊 AJUSTE POR PRIORIDAD
    baseScore *= (1 + pattern.priority * 0.1);
    
    // 📊 AJUSTE POR ÉXITO HISTÓRICO
    baseScore *= (1 + pattern.metadata.successRate * 0.05);
    
    return Math.min(baseScore, 1.0);
  }
  
  /**
   * 📊 INICIALIZACIÓN DE LIBRERÍA DE PATRONES
   */
  private initializePatternLibrary(): void {
    // 🎯 PATRONES DE SALUDO
    this.addPattern({
      id: 'greeting_1',
      name: 'Saludo básico',
      type: 'exact',
      pattern: /^(hola|buenos días|buenas tardes|buenas noches|hey|hi)/i,
      intent: 'greeting',
      confidence: 0.95,
      metadata: {
        category: 'social',
        priority: 1,
        description: 'Reconoce saludos básicos',
        examples: ['hola', 'buenos días', 'hey'],
        lastUsed: 0,
        successRate: 1.0
      }
    });
    
    // 🎯 PATRONES DE TÉCNICAS
    this.addPattern({
      id: 'technique_1',
      name: 'Consulta de técnica',
      type: 'semantic',
      pattern: ['técnica', 'golpe', 'puño', 'patada', 'bloqueo', 'defensa'],
      intent: 'technique_query',
      confidence: 0.85,
      context: {
        requiredKeywords: ['técnica'],
        excludedKeywords: ['historia', 'filosofía'],
        minConfidence: 0.7
      },
      metadata: {
        category: 'technical',
        priority: 2,
        description: 'Reconoce consultas sobre técnicas',
        examples: ['cómo se hace oi zuki', 'técnica de patada', 'bloqueo básico'],
        lastUsed: 0,
        successRate: 0.9
      }
    });
    
    // 🎯 PATRONES DE HISTORIA
    this.addPattern({
      id: 'history_1',
      name: 'Consulta histórica',
      type: 'semantic',
      pattern: ['historia', 'origen', 'evolución', 'maestros', 'fundador', 'cuándo'],
      intent: 'history_query',
      confidence: 0.8,
      context: {
        requiredKeywords: ['historia'],
        minConfidence: 0.7
      },
      metadata: {
        category: 'historical',
        priority: 2,
        description: 'Reconoce consultas sobre historia del karate',
        examples: ['historia del karate', 'origen de las técnicas', 'maestros famosos'],
        lastUsed: 0,
        successRate: 0.85
      }
    });
    
    // 🎯 PATRONES DE COMPARACIÓN
    this.addPattern({
      id: 'comparison_1',
      name: 'Comparación de técnicas',
      type: 'contextual',
      pattern: ['comparar', 'diferencia', 'vs', 'versus', 'mejor'],
      intent: 'technique_query',
      confidence: 0.75,
      context: {
        requiredKeywords: ['comparar'],
        minConfidence: 0.6
      },
      metadata: {
        category: 'comparison',
        priority: 3,
        description: 'Reconoce solicitudes de comparación',
        examples: ['comparar oi zuki vs gyaku zuki', 'diferencia entre patadas'],
        lastUsed: 0,
        successRate: 0.8
      }
    });
    
    // 🎯 PATRONES DE MOTIVACIÓN
    this.addPattern({
      id: 'motivation_1',
      name: 'Solicitud de motivación',
      type: 'semantic',
      pattern: ['motivación', 'ánimo', 'inspiración', 'frase', 'consejo'],
      intent: 'motivation_request',
      confidence: 0.9,
      context: {
        requiredKeywords: ['motivación'],
        minConfidence: 0.8
      },
      metadata: {
        category: 'motivational',
        priority: 1,
        description: 'Reconoce solicitudes de motivación',
        examples: ['necesito motivación', 'dame una frase inspiradora'],
        lastUsed: 0,
        successRate: 0.95
      }
    });
  }
  
  /**
   * 🎯 AÑADIR PATRÓN A LA LIBRERÍA
   */
  public addPattern(pattern: Pattern): void {
    this.patternLibrary.set(pattern.id, pattern);
  }
  
  /**
   * 📊 OBTENER PATRÓN POR ID
   */
  public getPattern(id: string): Pattern | undefined {
    return this.patternLibrary.get(id);
  }
  
  /**
   * 📊 OBTENER TODOS LOS PATRONES
   */
  public getAllPatterns(): Pattern[] {
    return Array.from(this.patternLibrary.values());
  }
  
  /**
   * 📊 ACTUALIZAR UMBRALES DE SIMILITUD
   */
  public updateThresholds(thresholds: Partial<SimilarityThreshold>): void {
    this.similarityThreshold = { ...this.similarityThreshold, ...thresholds };
  }
  
  /**
   * 📊 OBTENER MÉTRICAS DE RENDIMIENTO
   */
  public getPerformanceMetrics(): any {
    return {
      ...this.performanceMetrics,
      patternLibrarySize: this.patternLibrary.size,
      cacheSize: this.matchCache.size,
      thresholds: this.similarityThreshold
    };
  }
  
  /**
   * 🔄 UTILIDADES PRIVADAS
   */
  private preprocessInput(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ');
  }
  
  private updateContext(context?: Partial<SessionContext>): void {
    if (context) {
      this.currentContext = { ...this.currentContext, ...context };
    }
  }
  
  private generateCacheKey(input: string): string {
    return `${this.currentContext.sessionId}_${input.toLowerCase().substring(0, 50)}`;
  }
  
  private storeInCache(key: string, matches: PatternMatch[]): void {
    if (this.matchCache.size >= this.maxCacheSize) {
      const firstKey = this.matchCache.keys().next().value;
      this.matchCache.delete(firstKey);
    }
    this.matchCache.set(key, matches);
  }
  
  private updateMetrics(matches: PatternMatch[], processingTime: number): void {
    this.performanceMetrics.totalMatches++;
    
    if (matches.length > 0) {
      this.performanceMetrics.successfulMatches++;
      
      // 📊 ACTUALIZAR CONFIDENCIA PROMEDIO
      const totalConfidence = matches.reduce((sum, match) => sum + match.confidence, 0);
      const avgConfidence = totalConfidence / matches.length;
      
      const currentAvg = this.performanceMetrics.averageConfidence;
      const count = this.performanceMetrics.successfulMatches;
      this.performanceMetrics.averageConfidence = 
        (currentAvg * (count - 1) + avgConfidence) / count;
      
      // 📊 ACTUALIZAR USO DE PATRONES
      for (const match of matches) {
        const current = this.performanceMetrics.patternUsage.get(match.pattern.id) || 0;
        this.performanceMetrics.patternUsage.set(match.pattern.id, current + 1);
        
        // 📊 ACTUALIZAR METADATOS DEL PATRÓN
        match.pattern.metadata.lastUsed = Date.now();
        match.pattern.metadata.successRate = 
          (match.pattern.metadata.successRate * 0.9) + (match.confidence * 0.1);
      }
    }
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private startContextTracking(): void {
    // 📊 INICIALIZAR SEGUIMIENTO DE CONTEXTO
    setInterval(() => {
      // Limpieza de cache antigua
      if (this.matchCache.size > this.maxCacheSize * 0.8) {
        const entries = Array.from(this.matchCache.entries());
        entries.sort((a, b) => a[0].localeCompare(b[0]));
        const toDelete = entries.slice(0, Math.floor(this.maxCacheSize * 0.3));
        toDelete.forEach(([key]) => this.matchCache.delete(key));
      }
    }, 60000); // Cada minuto
  }
  
  private getSurroundingWords(words: string[], index: number, radius: number): string[] {
    const start = Math.max(0, index - radius);
    const end = Math.min(words.length, index + radius + 1);
    return words.slice(start, end);
  }
  
  private calculateConversationRelevance(input: string, pattern: Pattern): number {
    // 📊 IMPLEMENTACIÓN SIMPLE - podría ser más sofisticada
    if (this.currentContext.conversationHistory.length === 0) return 0.5;
    
    const recentTopics = this.currentContext.conversationHistory.slice(-3);
    let relevance = 0;
    
    for (const topic of recentTopics) {
      if (topic.toLowerCase().includes(pattern.name.toLowerCase()) ||
          pattern.name.toLowerCase().includes(topic.toLowerCase())) {
        relevance += 0.3;
      }
    }
    
    return Math.min(relevance, 1.0);
  }
  
  private calculateTopicRelevance(input: string, pattern: Pattern): number {
    if (!this.currentContext.currentTopic) return 0.5;
    
    return input.toLowerCase().includes(this.currentContext.currentTopic.toLowerCase()) ? 0.8 : 0.3;
  }
  
  private calculatePreferenceRelevance(input: string, pattern: Pattern): number {
    // 📊 IMPLEMENTACIÓN BASADA EN PREFERENCIAS DE USUARIO
    return 0.5; // Valor por defecto
  }
}
