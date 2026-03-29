import type { 
  SearchResult, 
  InferenceEngineConfig,
  KnowledgeBase,
  NLPProcessResult,
  UserIntent
} from '@/types';
import { NLPProcessor } from './NLPProcessor';
import { 
  SearchStrategy, 
  TechniqueSearchStrategy, 
  GenericSearchStrategy, 
  BodyPartsSearchStrategy 
} from './search/SearchStrategy';
import { 
  InferenceRule, 
  InferenceRuleFactory 
} from './inference/InferenceRule';

/**
 * Motor de Inferencia Refactorizado - Arquitectura limpia y escalable
 * 
 * Principios aplicados:
 * - Single Responsibility: Cada clase tiene una única responsabilidad
 * - Open/Closed: Extensible sin modificar código existente
 * - Strategy Pattern: Estrategias de búsqueda intercambiables
 * - Chain of Responsibility: Reglas de inferencia encadenadas
 * - Dependency Injection: Inyección de dependencias para testabilidad
 */
export class InferenceEngineRefactored {
  private knowledgeBase: KnowledgeBase;
  private config: InferenceEngineConfig;
  private searchStrategies: Map<UserIntent, SearchStrategy>;
  private inferenceRuleChain: InferenceRule;

  constructor(knowledgeBase: KnowledgeBase, config?: Partial<InferenceEngineConfig>) {
    this.knowledgeBase = knowledgeBase;
    this.config = this.initializeConfig(config);
    this.searchStrategies = this.initializeSearchStrategies();
    this.inferenceRuleChain = InferenceRuleFactory.createDefaultChain(knowledgeBase);
  }

  /**
   * Método principal de búsqueda - Punto de entrada único
   * Complejidad: O(1) para dispatch + O(n*m) para búsqueda donde n=estrategias, m=resultados
   */
  public search(nlpResult: NLPProcessResult): SearchResult | null {
    const startTime = performance.now();
    
    try {
      // 1. Obtener estrategia de búsqueda (O(1))
      const strategy = this.getSearchStrategy(nlpResult.intent);
      
      // 2. Ejecutar búsqueda (O(n*m) donde n=items en KB, m=keywords)
      const results = strategy.search(
        nlpResult.normalizedText,
        nlpResult.keywords,
        nlpResult.entities,
        this.knowledgeBase
      );

      // 3. Aplicar reglas de inferencia (O(k) donde k=reglas)
      const enhancedResults = this.inferenceRuleChain.apply(results, nlpResult);

      // 4. Ordenar y retornar mejor resultado (O(n log n))
      if (enhancedResults.length === 0) return null;
      
      enhancedResults.sort((a, b) => b.score - a.score);
      
      // Log de rendimiento para monitoreo
      const processingTime = performance.now() - startTime;
      if (processingTime > 100) { // Alerta si toma más de 100ms
        console.warn(`InferenceEngine search took ${processingTime.toFixed(2)}ms`);
      }
      
      return enhancedResults[0];
      
    } catch (error) {
      console.error('Error en InferenceEngine.search:', error);
      return null;
    }
  }

  /**
   * Inicializa configuración con valores por defecto
   */
  private initializeConfig(config?: Partial<InferenceEngineConfig>): InferenceEngineConfig {
    return {
      weights: {
        exact_match: 1.0,
        keyword_match: 0.8,
        fuzzy_match: 0.6,
        partial_match: 0.4,
        category_boost: 0.3
      },
      fuzzyThreshold: 0.7,
      maxResults: 10,
      ...config
    };
  }

  /**
   * Inicializa estrategias de búsqueda usando Factory Pattern
   */
  private initializeSearchStrategies(): Map<UserIntent, SearchStrategy> {
    const strategies = new Map<UserIntent, SearchStrategy>();
    
    // Estrategia especializada para técnicas (más compleja)
    strategies.set('technique_query', new TechniqueSearchStrategy(
      this.config.weights, 
      this.config.fuzzyThreshold
    ));
    
    // Estrategia para partes del cuerpo
    strategies.set('body_part_query', new BodyPartsSearchStrategy(
      this.config.weights, 
      this.config.fuzzyThreshold
    ));
    
    // Estrategia genérica reutilizable
    const genericStrategy = new GenericSearchStrategy(
      this.config.weights, 
      this.config.fuzzyThreshold
    );
    
    strategies.set('vocabulary_query', genericStrategy);
    strategies.set('history_query', genericStrategy);
    strategies.set('faq_query', genericStrategy);
    
    return strategies;
  }

  /**
   * Obtiene estrategia de búsqueda según intención
   * O(1) - HashMap lookup
   */
  private getSearchStrategy(intent: UserIntent): SearchStrategy {
    const strategy = this.searchStrategies.get(intent);
    return strategy || this.searchStrategies.get('faq_query')!; // Fallback
  }

  /**
   * Permite actualizar configuración en runtime
   */
  public updateConfig(newConfig: Partial<InferenceEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recrear estrategias con nueva configuración
    this.searchStrategies = this.initializeSearchStrategies();
  }

  /**
   * Permite añadir estrategias de búsqueda personalizadas
   * Open/Closed Principle: Extensible sin modificar
   */
  public addSearchStrategy(intent: UserIntent, strategy: SearchStrategy): void {
    this.searchStrategies.set(intent, strategy);
  }

  /**
   * Permite personalizar la cadena de reglas de inferencia
   */
  public setInferenceRuleChain(ruleChain: InferenceRule): void {
    this.inferenceRuleChain = ruleChain;
  }

  /**
   * Obtiene estadísticas de rendimiento para monitoreo
   */
  public getPerformanceStats(): {
    totalStrategies: number;
    supportedIntents: UserIntent[];
    config: InferenceEngineConfig;
  } {
    return {
      totalStrategies: this.searchStrategies.size,
      supportedIntents: Array.from(this.searchStrategies.keys()),
      config: { ...this.config }
    };
  }

  /**
   * Método de utilidad para testing - permite inyectar mock data
   */
  public static createForTesting(
    knowledgeBase: KnowledgeBase, 
    config?: Partial<InferenceEngineConfig>
  ): InferenceEngineRefactored {
    const engine = new InferenceEngineRefactored(knowledgeBase, config);
    
    // En modo testing, podríamos añadir estrategias mock
    if (process.env.NODE_ENV === 'test') {
      // Configuración específica para testing
      engine.updateConfig({
        fuzzyThreshold: 0.5, // Más permisivo para tests
        maxResults: 5 // Reducido para tests más rápidos
      });
    }
    
    return engine;
  }
}

/**
 * Factory para crear instancias del motor con diferentes configuraciones
 */
export class InferenceEngineFactory {
  /**
   * Crea motor para producción
   */
  static createProduction(knowledgeBase: KnowledgeBase): InferenceEngineRefactored {
    return new InferenceEngineRefactored(knowledgeBase, {
      fuzzyThreshold: 0.7, // Estándar para producción
      maxResults: 10
    });
  }

  /**
   * Crea motor optimizado para rendimiento
   */
  static createOptimized(knowledgeBase: KnowledgeBase): InferenceEngineRefactored {
    return new InferenceEngineRefactored(knowledgeBase, {
      fuzzyThreshold: 0.8, // Más estricto para menos falsos positivos
      maxResults: 5, // Menos resultados para mejor rendimiento
      weights: {
        exact_match: 1.2, // Más peso a exactas
        keyword_match: 0.9,
        fuzzy_match: 0.5, // Menos peso a fuzzy
        partial_match: 0.3,
        category_boost: 0.4
      }
    });
  }

  /**
   * Crea motor para desarrollo con logging extendido
   */
  static createDevelopment(knowledgeBase: KnowledgeBase): InferenceEngineRefactored {
    const engine = new InferenceEngineRefactored(knowledgeBase);
    
    // Añadir logging en desarrollo
    const originalSearch = engine.search.bind(engine);
    engine.search = function(nlpResult: NLPProcessResult): SearchResult | null {
      console.log(`🔍 Searching for: "${nlpResult.normalizedText}" (${nlpResult.intent})`);
      console.log(`📝 Keywords: [${nlpResult.keywords.join(', ')}]`);
      
      const result = originalSearch(nlpResult);
      
      console.log(`✅ Found result: ${result ? result.key : 'null'} (score: ${result?.score.toFixed(2)})`);
      
      return result;
    };
    
    return engine;
  }
}

/**
 * Exportar el motor refactorizado como InferenceEngine para compatibilidad
 */
export const InferenceEngine = InferenceEngineRefactored;
