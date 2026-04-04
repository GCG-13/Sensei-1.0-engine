/**
 * 🔄 WORKING MEMORY MANAGER - RAM DE LA IA
 * Sistema de memoria de trabajo para procesamiento cognitivo inmediato
 * Gestiona conceptos activos, buffer de pensamientos y ventana de contexto
 * 
 * @author Senior Software Engineer
 * @version 2.0.0 - Advanced Cognitive Memory Management
 */

import { EventEmitter } from 'events';

// 🧠 INTERFACES PARA MEMORIA DE TRABAJO
export interface WorkingMemory {
  id: string;
  activeConcepts: Map<string, ActiveConcept>;
  thoughtBuffer: Thought[];
  contextWindow: ContextWindow;
  capacity: number;
  currentLoad: number;
  lastUpdated: number;
  metadata: WorkingMemoryMetadata;
}

export interface ActiveConcept {
  id: string;
  content: string;
  type: ConceptType;
  activation: number;
  frequency: number;
  recency: number;
  decayRate: number;
  lastAccessed: number;
  connections: ConceptConnection[];
  emotionalWeight: number;
  importance: number;
  metadata: ConceptMetadata;
}

export interface ConceptConnection {
  targetConceptId: string;
  type: ConnectionType;
  strength: number;
  lastActivated: number;
  bidirectional: boolean;
}

export interface Thought {
  id: string;
  content: string;
  type: ThoughtType;
  timestamp: number;
  priority: ThoughtPriority;
  concepts: string[];
  emotionalState: EmotionalState;
  cognitiveLoad: number;
  processingTime: number;
  metadata: ThoughtMetadata;
}

export interface ContextWindow {
  id: string;
  size: number;
  position: number;
  items: ContextItem[];
  maxAge: number;
  autoCleanup: boolean;
  compressionEnabled: boolean;
}

export interface ContextItem {
  id: string;
  type: ContextItemType;
  content: string;
  relevance: number;
  timestamp: number;
  age: number;
  accessCount: number;
  lastAccessed: number;
  connections: string[];
  compressed: boolean;
  metadata: ContextItemMetadata;
}

export interface WorkingMemoryMetadata {
  sessionId: string;
  userId?: string;
  totalConceptsProcessed: number;
  totalThoughtsProcessed: number;
  averageActivationLevel: number;
  memoryEfficiency: number;
  compressionRatio: number;
  lastCleanup: number;
}

export interface ConceptMetadata {
  source: 'user_input' | 'inference' | 'pattern_match' | 'memory_recall';
  confidence: number;
  verification: VerificationStatus;
  tags: string[];
  extractionTime: number;
}

export interface ThoughtMetadata {
  processingStage: ProcessingStage;
  success: boolean;
  error?: string;
  resourcesUsed: ResourceUsage;
  selfAssessment: SelfAssessment;
}

export interface ContextItemMetadata {
  category: string;
  priority: number;
  persistent: boolean;
  encrypted: boolean;
  version: number;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  cognitive: number;
}

export interface SelfAssessment {
  clarity: number;
  relevance: number;
  completeness: number;
  confidence: number;
}

// 🧠 TIPOS ENUMERADOS
export type ConceptType = 
  | 'entity' 
  | 'relation' 
  | 'attribute' 
  | 'action' 
  | 'state' 
  | 'temporal' 
  | 'spatial' 
  | 'abstract';

export type ConnectionType = 
  | 'is_a' 
  | 'has_a' 
  | 'part_of' 
  | 'related_to' 
  | 'causes' 
  | 'enables' 
  | 'requires' 
  | 'similar_to';

export type ThoughtType = 
  | 'query' 
  | 'analysis' 
  | 'comprehension' 
  | 'reasoning' 
  | 'synthesis' 
  | 'response' 
  | 'metacognition' 
  | 'memory_recall';

export type ThoughtPriority = 
  | 'critical' 
  | 'high' 
  | 'medium' 
  | 'low' 
  | 'background';

export type EmotionalState = 
  | 'neutral' 
  | 'curious' 
  | 'confident' 
  | 'uncertain' 
  | 'focused' 
  | 'creative' 
  | 'confused' 
  | 'excited';

export type ContextItemType = 
  | 'thought' 
  | 'concept' 
  | 'pattern' 
  | 'inference' 
  | 'emotion' 
  | 'context' 
  | 'metadata';

export type VerificationStatus = 
  | 'verified' 
  | 'pending' 
  | 'unverified' 
  | 'rejected';

export type ProcessingStage = 
  | 'initialization' 
  | 'analysis' 
  | 'comprehension' 
  | 'reasoning' 
  | 'synthesis' 
  | 'validation' 
  | 'completed';

/**
 * 🔄 WORKING MEMORY MANAGER PRINCIPAL
 * Gestor avanzado de memoria de trabajo cognitiva
 */
export class WorkingMemoryManager extends EventEmitter {
  // 🧠 MEMORIA DE TRABAJO ACTUAL
  private workingMemory: WorkingMemory;
  
  // 📊 CONFIGURACIÓN Y PARÁMETROS
  private config: WorkingMemoryConfig;
  
  // 🔄 PROCESAMIENTO AUTOMÁTICO
  private decayTimer: NodeJS.Timeout;
  private cleanupTimer: NodeJS.Timeout;
  private compressionTimer: NodeJS.Timeout;
  
  // 📊 MÉTRICAS Y ESTADÍSTICAS
  private metrics: MemoryMetrics;
  
  // 🔐 CONTROL DE CONCURRENCIA
  private memoryLock: boolean;
  private operationQueue: MemoryOperation[];
  
  constructor(config?: Partial<WorkingMemoryConfig>) {
    super();
    
    // 📊 CONFIGURACIÓN POR DEFECTO
    this.config = {
      maxConcepts: 100,
      maxThoughts: 50,
      maxContextItems: 20,
      conceptDecayRate: 0.1,
      thoughtDecayRate: 0.05,
      contextItemDecayRate: 0.2,
      activationThreshold: 0.1,
      compressionThreshold: 0.8,
      cleanupInterval: 30000, // 30 segundos
      decayInterval: 10000,    // 10 segundos
      compressionInterval: 60000, // 1 minuto
      enableAutoCleanup: true,
      enableCompression: true,
      enablePersistence: false,
      ...config
    };
    
    // 🧠 INICIALIZAR MEMORIA DE TRABAJO
    this.workingMemory = this.initializeWorkingMemory();
    
    // 📊 INICIALIZAR MÉTRICAS
    this.metrics = this.initializeMetrics();
    
    // 🔐 CONTROL DE CONCURRENCIA
    this.memoryLock = false;
    this.operationQueue = [];
    
    // 🔄 INICIAR PROCESAMIENTO AUTOMÁTICO
    this.startAutomaticProcessing();
    
    console.log('🔄 WorkingMemoryManager inicializado');
  }
  
  /**
   * 🧠 ACTUALIZAR CONTEXTO - MÉTODO PRINCIPAL
   * Mantiene información relevante accesible para razonamiento inmediato
   */
  public async updateContext(newInformation: ContextUpdate): Promise<void> {
    try {
      // 🔐 ADQUIRIR LOCK DE MEMORIA
      await this.acquireMemoryLock();
      
      const startTime = Date.now();
      
      // 📊 PROCESAR NUEVA INFORMACIÓN
      const processedItems = await this.processNewInformation(newInformation);
      
      // 🧠 ACTUALIZAR CONCEPTOS ACTIVOS
      await this.updateActiveConcepts(processedItems);
      
      // 🔄 ACTUALIZAR BUFFER DE PENSAMIENTOS
      await this.updateThoughtBuffer(processedItems);
      
      // 📊 ACTUALIZAR VENTANA DE CONTEXTO
      await this.updateContextWindow(processedItems);
      
      // 📊 ACTUALIZAR METADATOS
      this.updateMemoryMetadata(processedItems);
      
      // 📊 ACTUALIZAR MÉTRICAS
      this.updateMetrics('context_update', Date.now() - startTime);
      
      // 🎯 EMITIR EVENTOS
      this.emit('contextUpdated', {
        workingMemory: this.workingMemory,
        processedItems,
        processingTime: Date.now() - startTime
      });
      
      console.log(`🔄 Contexto actualizado en ${Date.now() - startTime}ms`);
      
    } catch (error) {
      console.error('❌ Error actualizando contexto:', error);
      this.emit('contextUpdateError', error);
      throw error;
    } finally {
      // 🔐 LIBERAR LOCK DE MEMORIA
      this.releaseMemoryLock();
    }
  }
  
  /**
   * 🧠 AÑADIR CONCEPTO ACTIVO
   */
  public async addActiveConcept(concept: Omit<ActiveConcept, 'id' | 'lastAccessed' | 'frequency' | 'recency'>): Promise<string> {
    try {
      await this.acquireMemoryLock();
      
      const conceptId = this.generateConceptId();
      const now = Date.now();
      
      const activeConcept: ActiveConcept = {
        ...concept,
        id: conceptId,
        lastAccessed: now,
        frequency: 1,
        recency: now,
        connections: []
      };
      
      // 📊 VERIFICAR CAPACIDAD
      if (this.workingMemory.activeConcepts.size >= this.config.maxConcepts) {
        await this.evictLeastRelevantConcept();
      }
      
      // 🧠 AÑADIR CONCEPTO
      this.workingMemory.activeConcepts.set(conceptId, activeConcept);
      
      // 🔄 ACTUALIZAR CONEXIONES
      await this.updateConceptConnections(activeConcept);
      
      // 📊 ACTUALIZAR CARGA
      this.updateMemoryLoad();
      
      this.emit('conceptAdded', activeConcept);
      
      return conceptId;
      
    } finally {
      this.releaseMemoryLock();
    }
  }
  
  /**
   * 🔄 AÑADIR PENSAMIENTO AL BUFFER
   */
  public async addThought(thought: Omit<Thought, 'id' | 'timestamp'>): Promise<string> {
    try {
      await this.acquireMemoryLock();
      
      const thoughtId = this.generateThoughtId();
      const now = Date.now();
      
      const fullThought: Thought = {
        ...thought,
        id: thoughtId,
        timestamp: now
      };
      
      // 📊 VERIFICAR CAPACIDAD
      if (this.workingMemory.thoughtBuffer.length >= this.config.maxThoughts) {
        await this.evictOldestThought();
      }
      
      // 🔄 AÑADIR PENSAMIENTO
      this.workingMemory.thoughtBuffer.push(fullThought);
      
      // 📊 ORDENAR POR PRIORIDAD Y TIMESTAMP
      this.workingMemory.thoughtBuffer.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1, background: 0 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        
        if (priorityDiff !== 0) return priorityDiff;
        return b.timestamp - a.timestamp;
      });
      
      // 🧠 EXTRAER CONCEPTOS DEL PENSAMIENTO
      await this.extractConceptsFromThought(fullThought);
      
      this.emit('thoughtAdded', fullThought);
      
      return thoughtId;
      
    } finally {
      this.releaseMemoryLock();
    }
  }
  
  /**
   * 📊 OBTENER CONCEPTOS ACTIVOS
   */
  public getActiveConcepts(filter?: ConceptFilter): ActiveConcept[] {
    let concepts = Array.from(this.workingMemory.activeConcepts.values());
    
    if (filter) {
      concepts = concepts.filter(concept => {
        if (filter.type && concept.type !== filter.type) return false;
        if (filter.minActivation && concept.activation < filter.minActivation) return false;
        if (filter.minImportance && concept.importance < filter.minImportance) return false;
        if (filter.source && concept.metadata.source !== filter.source) return false;
        return true;
      });
    }
    
    // 📊 ORDENAR POR ACTIVACIÓN
    return concepts.sort((a, b) => b.activation - a.activation);
  }
  
  /**
   * 🔄 OBTENER BUFFER DE PENSAMIENTOS
   */
  public getThoughtBuffer(filter?: ThoughtFilter): Thought[] {
    let thoughts = [...this.workingMemory.thoughtBuffer];
    
    if (filter) {
      thoughts = thoughts.filter(thought => {
        if (filter.type && thought.type !== filter.type) return false;
        if (filter.priority && thought.priority !== filter.priority) return false;
        if (filter.minTimestamp && thought.timestamp < filter.minTimestamp) return false;
        if (filter.maxTimestamp && thought.timestamp > filter.maxTimestamp) return false;
        return true;
      });
    }
    
    return thoughts;
  }
  
  /**
   * 📊 OBTENER VENTANA DE CONTEXTO
   */
  public getContextWindow(filter?: ContextFilter): ContextItem[] {
    let items = [...this.workingMemory.contextWindow.items];
    
    if (filter) {
      items = items.filter(item => {
        if (filter.type && item.type !== filter.type) return false;
        if (filter.minRelevance && item.relevance < filter.minRelevance) return false;
        if (filter.maxAge && item.age > filter.maxAge) return false;
        return true;
      });
    }
    
    // 📊 ORDENAR POR RELEVANCIA Y ACCESO RECIENTE
    return items.sort((a, b) => {
      const relevanceDiff = b.relevance - a.relevance;
      if (relevanceDiff !== 0) return relevanceDiff;
      return b.lastAccessed - a.lastAccessed;
    });
  }
  
  /**
   * 🧠 RECUPERAR CONCEPTO POR ID
   */
  public getConcept(conceptId: string): ActiveConcept | undefined {
    return this.workingMemory.activeConcepts.get(conceptId);
  }
  
  /**
   * 🔄 RECUPERAR PENSAMIENTO POR ID
   */
  public getThought(thoughtId: string): Thought | undefined {
    return this.workingMemory.thoughtBuffer.find(t => t.id === thoughtId);
  }
  
  /**
   * 📊 BUSCAR CONCEPTOS SIMILARES
   */
  public findSimilarConcepts(conceptId: string, threshold: number = 0.7): ActiveConcept[] {
    const concept = this.workingMemory.activeConcepts.get(conceptId);
    if (!concept) return [];
    
    const similar: ActiveConcept[] = [];
    
    for (const [id, otherConcept] of this.workingMemory.activeConcepts) {
      if (id === conceptId) continue;
      
      const similarity = this.calculateConceptSimilarity(concept, otherConcept);
      if (similarity >= threshold) {
        similar.push(otherConcept);
      }
    }
    
    return similar.sort((a, b) => b.activation - a.activation);
  }
  
  /**
   * 🧠 REFRESCAR ACTIVACIÓN DE CONCEPTOS
   */
  public async refreshConceptActivation(conceptId: string): Promise<void> {
    try {
      await this.acquireMemoryLock();
      
      const concept = this.workingMemory.activeConcepts.get(conceptId);
      if (!concept) return;
      
      const now = Date.now();
      
      // 📊 ACTUALIZAR ACTIVACIÓN
      concept.activation = Math.min(1.0, concept.activation + 0.1);
      concept.lastAccessed = now;
      concept.frequency++;
      concept.recency = now;
      
      // 🔄 ACTUALIZAR CONEXIONES
      await this.updateConceptConnections(concept);
      
      // 📊 ACTUALIZAR CARGA
      this.updateMemoryLoad();
      
      this.emit('conceptRefreshed', concept);
      
    } finally {
      this.releaseMemoryLock();
    }
  }
  
  /**
   * 📊 OBTENER ESTADO DE LA MEMORIA
   */
  public getMemoryState(): MemoryState {
    return {
      workingMemory: this.workingMemory,
      metrics: this.metrics,
      config: this.config,
      isLocked: this.memoryLock,
      queueSize: this.operationQueue.length
    };
  }
  
  /**
   * 🧠 LIMPIEZA MANUAL DE MEMORIA
   */
  public async performCleanup(options?: CleanupOptions): Promise<CleanupResult> {
    try {
      await this.acquireMemoryLock();
      
      const startTime = Date.now();
      const result: CleanupResult = {
        conceptsRemoved: 0,
        thoughtsRemoved: 0,
        contextItemsRemoved: 0,
        memoryFreed: 0,
        processingTime: 0
      };
      
      // 🧠 LIMPIEZA DE CONCEPTOS
      if (options?.concepts !== false) {
        const conceptsToRemove = this.getConceptsForCleanup();
        for (const conceptId of conceptsToRemove) {
          this.workingMemory.activeConcepts.delete(conceptId);
          result.conceptsRemoved++;
        }
      }
      
      // 🔄 LIMPIEZA DE PENSAMIENTOS
      if (options?.thoughts !== false) {
        const thoughtsToRemove = this.getThoughtsForCleanup();
        this.workingMemory.thoughtBuffer = this.workingMemory.thoughtBuffer.filter(
          thought => !thoughtsToRemove.includes(thought.id)
        );
        result.thoughtsRemoved = thoughtsToRemove.length;
      }
      
      // 📊 LIMPIEZA DE CONTEXTO
      if (options?.context !== false) {
        const contextItemsToRemove = this.getContextItemsForCleanup();
        this.workingMemory.contextWindow.items = this.workingMemory.contextWindow.items.filter(
          item => !contextItemsToRemove.includes(item.id)
        );
        result.contextItemsRemoved = contextItemsToRemove.length;
      }
      
      // 📊 ACTUALIZAR CARGA Y MÉTRICAS
      this.updateMemoryLoad();
      result.processingTime = Date.now() - startTime;
      
      this.emit('cleanupPerformed', result);
      
      return result;
      
    } finally {
      this.releaseMemoryLock();
    }
  }
  
  /**
   * 🔄 COMPRESIÓN DE MEMORIA
   */
  public async compressMemory(): Promise<CompressionResult> {
    try {
      await this.acquireMemoryLock();
      
      const startTime = Date.now();
      const result: CompressionResult = {
        itemsCompressed: 0,
        spaceSaved: 0,
        compressionRatio: 0,
        processingTime: 0
      };
      
      // 📊 COMPRESIÓN DE ÍTEMS DE CONTEXTO
      for (const item of this.workingMemory.contextWindow.items) {
        if (!item.compressed && item.relevance < this.config.compressionThreshold) {
          item.compressed = true;
          item.content = this.compressContent(item.content);
          result.itemsCompressed++;
          result.spaceSaved += item.content.length * 0.6; // Estimación
        }
      }
      
      // 📊 CALCULAR RELACIÓN DE COMPRESIÓN
      const originalSize = this.calculateMemorySize();
      const compressedSize = this.calculateMemorySize();
      result.compressionRatio = 1 - (compressedSize / originalSize);
      result.processingTime = Date.now() - startTime;
      
      this.emit('memoryCompressed', result);
      
      return result;
      
    } finally {
      this.releaseMemoryLock();
    }
  }
  
  /**
   * 🔥 MÉTODOS PRIVADOS - PROCESAMIENTO INTERNO
   */
  private async processNewInformation(newInfo: ContextUpdate): Promise<ProcessedItem[]> {
    const processedItems: ProcessedItem[] = [];
    
    // 🧠 PROCESAR CONCEPTOS
    if (newInfo.concepts) {
      for (const concept of newInfo.concepts) {
        processedItems.push({
          type: 'concept',
          content: concept.content,
          relevance: concept.relevance || 0.5,
          metadata: concept.metadata || {}
        });
      }
    }
    
    // 🔄 PROCESAR PENSAMIENTOS
    if (newInfo.thoughts) {
      for (const thought of newInfo.thoughts) {
        processedItems.push({
          type: 'thought',
          content: thought.content,
          relevance: thought.relevance || 0.5,
          metadata: thought.metadata || {}
        });
      }
    }
    
    // 📊 PROCESAR ÍTEMS DE CONTEXTO
    if (newInfo.contextItems) {
      for (const item of newInfo.contextItems) {
        processedItems.push({
          type: 'context',
          content: item.content,
          relevance: item.relevance || 0.5,
          metadata: item.metadata || {}
        });
      }
    }
    
    return processedItems;
  }
  
  private async updateActiveConcepts(items: ProcessedItem[]): Promise<void> {
    for (const item of items) {
      if (item.type === 'concept') {
        await this.addActiveConcept({
          content: item.content,
          type: 'entity',
          activation: item.relevance,
          frequency: 1,
          recency: Date.now(),
          decayRate: this.config.conceptDecayRate,
          connections: [],
          emotionalWeight: 0.5,
          importance: item.relevance,
          metadata: {
            source: 'user_input',
            confidence: 0.8,
            verification: 'pending',
            tags: [],
            extractionTime: Date.now()
          }
        });
      }
    }
  }
  
  private async updateThoughtBuffer(items: ProcessedItem[]): Promise<void> {
    for (const item of items) {
      if (item.type === 'thought') {
        await this.addThought({
          content: item.content,
          type: 'query',
          priority: 'medium',
          concepts: [],
          emotionalState: 'neutral',
          cognitiveLoad: 0.5,
          processingTime: 0,
          metadata: {
            processingStage: 'completed',
            success: true,
            resourcesUsed: { cpu: 0.1, memory: 0.1, cognitive: 0.3 },
            selfAssessment: { clarity: 0.8, relevance: 0.7, completeness: 0.6, confidence: 0.7 }
          }
        });
      }
    }
  }
  
  private async updateContextWindow(items: ProcessedItem[]): Promise<void> {
    for (const item of items) {
      const contextItem: ContextItem = {
        id: this.generateContextItemId(),
        type: 'context',
        content: item.content,
        relevance: item.relevance,
        timestamp: Date.now(),
        age: 0,
        accessCount: 1,
        lastAccessed: Date.now(),
        connections: [],
        compressed: false,
        metadata: {
          category: 'user_input',
          priority: 1,
          persistent: false,
          encrypted: false,
          version: 1
        }
      };
      
      // 📊 VERIFICAR CAPACIDAD
      if (this.workingMemory.contextWindow.items.length >= this.config.maxContextItems) {
        await this.evictLeastRelevantContextItem();
      }
      
      this.workingMemory.contextWindow.items.push(contextItem);
      
      // 📊 ORDENAR POR RELEVANCIA
      this.workingMemory.contextWindow.items.sort((a, b) => b.relevance - a.relevance);
    }
  }
  
  private async updateConceptConnections(concept: ActiveConcept): Promise<void> {
    // 🧠 BUSCAR CONCEPTOS RELACIONADOS
    const relatedConcepts = this.findRelatedConcepts(concept);
    
    for (const related of relatedConcepts) {
      const connectionType = this.determineConnectionType(concept, related);
      const strength = this.calculateConnectionStrength(concept, related);
      
      // 🔄 AÑADIR CONEXIÓN BIDIRECCIONAL
      concept.connections.push({
        targetConceptId: related.id,
        type: connectionType,
        strength,
        lastActivated: Date.now(),
        bidirectional: true
      });
      
      // 🔄 ACTUALIZAR CONEXIÓN EN EL CONCEPTO RELACIONADO
      const relatedConcept = this.workingMemory.activeConcepts.get(related.id);
      if (relatedConcept) {
        relatedConcept.connections.push({
          targetConceptId: concept.id,
          type: connectionType,
          strength,
          lastActivated: Date.now(),
          bidirectional: true
        });
      }
    }
  }
  
  private findRelatedConcepts(concept: ActiveConcept): ActiveConcept[] {
    const related: ActiveConcept[] = [];
    
    for (const [id, otherConcept] of this.workingMemory.activeConcepts) {
      if (id === concept.id) continue;
      
      const similarity = this.calculateConceptSimilarity(concept, otherConcept);
      if (similarity >= 0.3) {
        related.push(otherConcept);
      }
    }
    
    return related.slice(0, 5); // Limitar a 5 conexiones principales
  }
  
  private calculateConceptSimilarity(concept1: ActiveConcept, concept2: ActiveConcept): number {
    // 🧠 SIMILITUD BASADA EN CONTENIDO
    const contentSimilarity = this.calculateContentSimilarity(concept1.content, concept2.content);
    
    // 📊 SIMILITUD BASADA EN TIPO
    const typeSimilarity = concept1.type === concept2.type ? 1.0 : 0.5;
    
    // 🔄 SIMILITUD BASADA EN CONEXIONES EXISTENTES
    const connectionSimilarity = this.calculateConnectionSimilarity(concept1, concept2);
    
    // 📊 PONDERACIÓN
    return (contentSimilarity * 0.5) + (typeSimilarity * 0.3) + (connectionSimilarity * 0.2);
  }
  
  private calculateContentSimilarity(content1: string, content2: string): number {
    // 🧠 IMPLEMENTACIÓN SIMPLE - podría ser más sofisticada
    const words1 = content1.toLowerCase().split(/\s+/);
    const words2 = content2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }
  
  private calculateConnectionSimilarity(concept1: ActiveConcept, concept2: ActiveConcept): number {
    const connections1 = concept1.connections.filter(c => c.targetConceptId === concept2.id);
    const connections2 = concept2.connections.filter(c => c.targetConceptId === concept1.id);
    
    if (connections1.length === 0 && connections2.length === 0) return 0;
    
    const avgStrength1 = connections1.reduce((sum, c) => sum + c.strength, 0) / (connections1.length || 1);
    const avgStrength2 = connections2.reduce((sum, c) => sum + c.strength, 0) / (connections2.length || 1);
    
    return (avgStrength1 + avgStrength2) / 2;
  }
  
  private determineConnectionType(concept1: ActiveConcept, concept2: ActiveConcept): ConnectionType {
    // 🧠 IMPLEMENTACIÓN SIMPLE - podría ser más sofisticada
    if (concept1.type === concept2.type) return 'similar_to';
    if (concept1.type === 'entity' && concept2.type === 'attribute') return 'has_a';
    if (concept1.type === 'action' && concept2.type === 'entity') return 'requires';
    
    return 'related_to';
  }
  
  private calculateConnectionStrength(concept1: ActiveConcept, concept2: ActiveConcept): number {
    const similarity = this.calculateConceptSimilarity(concept1, concept2);
    const activationFactor = (concept1.activation + concept2.activation) / 2;
    
    return similarity * activationFactor;
  }
  
  private async extractConceptsFromThought(thought: Thought): Promise<void> {
    // 🧠 IMPLEMENTACIÓN SIMPLE - podría ser más sofisticada
    const words = thought.content.toLowerCase().split(/\s+/);
    const concepts = words.filter(word => word.length > 3 && !this.isStopWord(word));
    
    for (const conceptContent of concepts) {
      await this.addActiveConcept({
        content: conceptContent,
        type: 'entity',
        activation: 0.5,
        frequency: 1,
        recency: Date.now(),
        decayRate: this.config.conceptDecayRate,
        connections: [],
        emotionalWeight: 0.3,
        importance: 0.4,
        metadata: {
          source: 'memory_recall',
          confidence: 0.6,
          verification: 'pending',
          tags: ['extracted', 'automatic'],
          extractionTime: Date.now()
        }
      });
    }
  }
  
  private isStopWord(word: string): boolean {
    const stopWords = ['el', 'la', 'los', 'las', 'de', 'en', 'que', 'es', 'un', 'una', 'como', 'para', 'con', 'por'];
    return stopWords.includes(word);
  }
  
  private async evictLeastRelevantConcept(): Promise<void> {
    let leastRelevant: ActiveConcept | null = null;
    let lowestScore = Infinity;
    
    for (const concept of this.workingMemory.activeConcepts.values()) {
      const score = concept.activation * concept.importance * (1 / concept.frequency);
      if (score < lowestScore) {
        lowestScore = score;
        leastRelevant = concept;
      }
    }
    
    if (leastRelevant) {
      this.workingMemory.activeConcepts.delete(leastRelevant.id);
      this.emit('conceptEvicted', leastRelevant);
    }
  }
  
  private async evictOldestThought(): Promise<void> {
    if (this.workingMemory.thoughtBuffer.length === 0) return;
    
    const oldestThought = this.workingMemory.thoughtBuffer.reduce((oldest, current) => 
      oldest.timestamp < current.timestamp ? oldest : current
    );
    
    this.workingMemory.thoughtBuffer = this.workingMemory.thoughtBuffer.filter(
      thought => thought.id !== oldestThought.id
    );
    
    this.emit('thoughtEvicted', oldestThought);
  }
  
  private async evictLeastRelevantContextItem(): Promise<void> {
    if (this.workingMemory.contextWindow.items.length === 0) return;
    
    const leastRelevant = this.workingMemory.contextWindow.items.reduce((least, current) => {
      const leastScore = least.relevance * (1 / least.accessCount);
      const currentScore = current.relevance * (1 / current.accessCount);
      return currentScore < leastScore ? current : least;
    });
    
    this.workingMemory.contextWindow.items = this.workingMemory.contextWindow.items.filter(
      item => item.id !== leastRelevant.id
    );
    
    this.emit('contextItemEvicted', leastRelevant);
  }
  
  private updateMemoryLoad(): void {
    const conceptLoad = this.workingMemory.activeConcepts.size / this.config.maxConcepts;
    const thoughtLoad = this.workingMemory.thoughtBuffer.length / this.config.maxThoughts;
    const contextLoad = this.workingMemory.contextWindow.items.length / this.config.maxContextItems;
    
    this.workingMemory.currentLoad = (conceptLoad + thoughtLoad + contextLoad) / 3;
    this.workingMemory.lastUpdated = Date.now();
  }
  
  private updateMemoryMetadata(items: ProcessedItem[]): void {
    this.workingMemory.metadata.totalConceptsProcessed += items.filter(i => i.type === 'concept').length;
    this.workingMemory.metadata.totalThoughtsProcessed += items.filter(i => i.type === 'thought').length;
    
    // 📊 ACTUALIZAR NIVEL PROMEDIO DE ACTIVACIÓN
    const totalActivation = Array.from(this.workingMemory.activeConcepts.values())
      .reduce((sum, concept) => sum + concept.activation, 0);
    const avgActivation = totalActivation / this.workingMemory.activeConcepts.size || 0;
    this.workingMemory.metadata.averageActivationLevel = avgActivation;
  }
  
  private updateMetrics(operation: string, processingTime: number): void {
    this.metrics.totalOperations++;
    this.metrics.totalProcessingTime += processingTime;
    this.metrics.averageProcessingTime = this.metrics.totalProcessingTime / this.metrics.totalOperations;
    
    // 📊 ACTUALIZAR EFICIENCIA
    this.metrics.memoryEfficiency = 1 - this.workingMemory.currentLoad;
  }
  
  private startAutomaticProcessing(): void {
    // 🔄 DECADIMIENTO AUTOMÁTICO
    this.decayTimer = setInterval(() => {
      this.performDecay();
    }, this.config.decayInterval);
    
    // 🧹 LIMPIEZA AUTOMÁTICA
    if (this.config.enableAutoCleanup) {
      this.cleanupTimer = setInterval(() => {
        this.performCleanup();
      }, this.config.cleanupInterval);
    }
    
    // 📊 COMPRESIÓN AUTOMÁTICA
    if (this.config.enableCompression) {
      this.compressionTimer = setInterval(() => {
        this.compressMemory();
      }, this.config.compressionInterval);
    }
  }
  
  private async performDecay(): Promise<void> {
    try {
      await this.acquireMemoryLock();
      
      const now = Date.now();
      
      // 🧠 DECADIMIENTO DE CONCEPTOS
      for (const concept of this.workingMemory.activeConcepts.values()) {
        const timeSinceAccess = now - concept.lastAccessed;
        const decayFactor = Math.exp(-concept.decayRate * timeSinceAccess / 1000);
        concept.activation *= decayFactor;
        
        // 📊 ELIMINAR CONCEPTOS CON ACTIVACIÓN MUY BAJA
        if (concept.activation < this.config.activationThreshold) {
          this.workingMemory.activeConcepts.delete(concept.id);
        }
      }
      
      // 🔄 DECADIMIENTO DE ÍTEMS DE CONTEXTO
      for (const item of this.workingMemory.contextWindow.items) {
        item.age = now - item.timestamp;
        item.relevance *= 0.95; // Decaimiento gradual
        
        // 📊 ELIMINAR ÍTEMS MUY ANTIGUOS O CON BAJA RELEVANCIA
        if (item.age > 300000 || item.relevance < 0.1) { // 5 minutos o relevancia < 0.1
          this.workingMemory.contextWindow.items = this.workingMemory.contextWindow.items.filter(
            i => i.id !== item.id
          );
        }
      }
      
      this.updateMemoryLoad();
      this.emit('decayPerformed');
      
    } finally {
      this.releaseMemoryLock();
    }
  }
  
  private async performCleanup(): Promise<void> {
    await this.performCleanup();
  }
  
  private async compressMemory(): Promise<void> {
    await this.compressMemory();
  }
  
  private async acquireMemoryLock(): Promise<void> {
    while (this.memoryLock) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    this.memoryLock = true;
  }
  
  private releaseMemoryLock(): void {
    this.memoryLock = false;
    
    // 🔄 PROCESAR COLA DE OPERACIONES
    if (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift();
      if (operation) {
        operation();
      }
    }
  }
  
  private generateConceptId(): string {
    return `concept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateThoughtId(): string {
    return `thought_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateContextItemId(): string {
    return `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private initializeWorkingMemory(): WorkingMemory {
    return {
      id: this.generateMemoryId(),
      activeConcepts: new Map(),
      thoughtBuffer: [],
      contextWindow: {
        id: this.generateContextId(),
        size: this.config.maxContextItems,
        position: 0,
        items: [],
        maxAge: 300000, // 5 minutos
        autoCleanup: this.config.enableAutoCleanup,
        compressionEnabled: this.config.enableCompression
      },
      capacity: this.config.maxConcepts,
      currentLoad: 0,
      lastUpdated: Date.now(),
      metadata: {
        sessionId: this.generateSessionId(),
        totalConceptsProcessed: 0,
        totalThoughtsProcessed: 0,
        averageActivationLevel: 0,
        memoryEfficiency: 1.0,
        compressionRatio: 0,
        lastCleanup: Date.now()
      }
    };
  }
  
  private initializeMetrics(): MemoryMetrics {
    return {
      totalOperations: 0,
      totalProcessingTime: 0,
      averageProcessingTime: 0,
      memoryEfficiency: 1.0,
      compressionRatio: 0,
      lastCleanup: Date.now()
    };
  }
  
  private generateMemoryId(): string {
    return `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateContextId(): string {
    return `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getConceptsForCleanup(): string[] {
    const conceptsToRemove: string[] = [];
    
    for (const [id, concept] of this.workingMemory.activeConcepts) {
      if (concept.activation < this.config.activationThreshold || 
          concept.importance < 0.2 ||
          (Date.now() - concept.lastAccessed) > 600000) { // 10 minutos
        conceptsToRemove.push(id);
      }
    }
    
    return conceptsToRemove;
  }
  
  private getThoughtsForCleanup(): string[] {
    const thoughtsToRemove: string[] = [];
    
    for (const thought of this.workingMemory.thoughtBuffer) {
      if (thought.priority === 'background' ||
          (Date.now() - thought.timestamp) > 300000) { // 5 minutos
        thoughtsToRemove.push(thought.id);
      }
    }
    
    return thoughtsToRemove;
  }
  
  private getContextItemsForCleanup(): string[] {
    const itemsToRemove: string[] = [];
    
    for (const item of this.workingMemory.contextWindow.items) {
      if (item.relevance < 0.1 ||
          item.age > 600000 || // 10 minutos
          item.accessCount < 2) {
        itemsToRemove.push(item.id);
      }
    }
    
    return itemsToRemove;
  }
  
  private compressContent(content: string): string {
    // 🧠 IMPLEMENTACIÓN SIMPLE - podría ser más sofisticada
    return content.length > 100 ? content.substring(0, 97) + '...' : content;
  }
  
  private calculateMemorySize(): number {
    let size = 0;
    
    // 📊 TAMAÑO DE CONCEPTOS
    for (const concept of this.workingMemory.activeConcepts.values()) {
      size += JSON.stringify(concept).length;
    }
    
    // 📊 TAMAÑO DE PENSAMIENTOS
    for (const thought of this.workingMemory.thoughtBuffer) {
      size += JSON.stringify(thought).length;
    }
    
    // 📊 TAMAÑO DE CONTEXTO
    for (const item of this.workingMemory.contextWindow.items) {
      size += JSON.stringify(item).length;
    }
    
    return size;
  }
}

// 🎯 INTERFACES ADICIONALES
interface WorkingMemoryConfig {
  maxConcepts: number;
  maxThoughts: number;
  maxContextItems: number;
  conceptDecayRate: number;
  thoughtDecayRate: number;
  contextItemDecayRate: number;
  activationThreshold: number;
  compressionThreshold: number;
  cleanupInterval: number;
  decayInterval: number;
  compressionInterval: number;
  enableAutoCleanup: boolean;
  enableCompression: boolean;
  enablePersistence: boolean;
}

interface ContextUpdate {
  concepts?: Array<{
    content: string;
    relevance?: number;
    metadata?: any;
  }>;
  thoughts?: Array<{
    content: string;
    relevance?: number;
    metadata?: any;
  }>;
  contextItems?: Array<{
    content: string;
    relevance?: number;
    metadata?: any;
  }>;
}

interface ProcessedItem {
  type: 'concept' | 'thought' | 'context';
  content: string;
  relevance: number;
  metadata: any;
}

interface ConceptFilter {
  type?: ConceptType;
  minActivation?: number;
  minImportance?: number;
  source?: string;
}

interface ThoughtFilter {
  type?: ThoughtType;
  priority?: ThoughtPriority;
  minTimestamp?: number;
  maxTimestamp?: number;
}

interface ContextFilter {
  type?: ContextItemType;
  minRelevance?: number;
  maxAge?: number;
}

interface MemoryMetrics {
  totalOperations: number;
  totalProcessingTime: number;
  averageProcessingTime: number;
  memoryEfficiency: number;
  compressionRatio: number;
  lastCleanup: number;
}

interface MemoryState {
  workingMemory: WorkingMemory;
  metrics: MemoryMetrics;
  config: WorkingMemoryConfig;
  isLocked: boolean;
  queueSize: number;
}

interface CleanupOptions {
  concepts?: boolean;
  thoughts?: boolean;
  context?: boolean;
}

interface CleanupResult {
  conceptsRemoved: number;
  thoughtsRemoved: number;
  contextItemsRemoved: number;
  memoryFreed: number;
  processingTime: number;
}

interface CompressionResult {
  itemsCompressed: number;
  spaceSaved: number;
  compressionRatio: number;
  processingTime: number;
}

interface MemoryOperation {
  type: string;
  execute: () => Promise<void>;
  priority: number;
}
