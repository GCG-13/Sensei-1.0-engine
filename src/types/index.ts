/**
 * Tipos e interfaces principales del sistema Sensei AI
 */

// ==================== TIPOS BASE ====================

/**
 * Representa un nivel de cinturón en karate
 */
export type BeltRank = `${number} kyu` | `${number} dan`;

/**
 * Categorías de técnicas en karate
 */
export type TechniqueCategory = 'teWaza' | 'fuseguiWaza' | 'ashiWaza' | 'atemiWaza';

/**
 * Intenciones de usuario identificadas por el sistema
 */
export type UserIntent = 
  | 'greeting'
  | 'farewell'
  | 'technique_query'
  | 'rank_query'
  | 'body_part_query'
  | 'vocabulary_query'
  | 'history_query'
  | 'motivation_request'
  | 'faq_query'
  | 'unknown';

// ==================== INTERFACES DE TÉCNICAS ====================

/**
 * Información detallada de una técnica de karate
 */
export interface TechniqueDetail {
  /** Descripción detallada de la técnica */
  descripcion: string;
  /** Uso específico de la técnica */
  uso: string;
  /** Nivel de cinturón requerido */
  cinturon: string;
  /** Nombre en español de la técnica */
  itemSpanishName: string;
}

/**
 * Detalles extendidos de técnica con keywords y categoría
 */
export interface ExtendedTechniqueDetail extends TechniqueDetail {
  /** Categoría de la técnica */
  category: string;
  /** Palabras clave para búsqueda */
  keywords: string[];
}

/**
 * Técnicas organizadas por rango de cinturón
 */
export interface TechniquesByRank {
  teWaza: string[];
  fuseguiWaza: string[];
  ashiWaza: string[];
}

/**
 * Detalles de técnicas de puntos vitales (Atemi Waza)
 */
export interface AtemiWazaDetail {
  itemName: string;
  itemSpanishName: string;
  descripcion: string;
  uso: string;
  cinturon: string;
}

// ==================== INTERFACES DE BÚSQUEDA ====================

/**
 * Resultado de búsqueda con scoring
 */
export interface SearchResult {
  /** Tipo de resultado encontrado */
  type: 'technique' | 'rank' | 'body_part' | 'general' | 'body_parts_category';
  /** Puntuación de relevancia (0-1) */
  score: number;
  /** Tipo de coincidencia */
  matchType: 'exact' | 'partial' | 'fuzzy' | 'keyword';
  /** Sección de la base de conocimiento */
  section?: string;
  /** Clave del item */
  key?: string;
  /** Datos del item encontrado */
  item?: TechniqueDetail | AtemiWazaDetail | string;
  /** Datos adicionales según el tipo */
  data?: any;
  /** Sugerencia contextual para el usuario */
  suggestion?: string;
}

/**
 * Configuración de pesos para el algoritmo de scoring
 */
export interface ScoringWeights {
  /** Peso para coincidencia exacta */
  exact_match: number;
  /** Peso para coincidencia de palabras clave */
  keyword_match: number;
  /** Peso para coincidencia aproximada */
  fuzzy_match: number;
  /** Peso para coincidencia parcial */
  partial_match: number;
  /** Peso adicional por categoría */
  category_boost: number;
}

// ==================== INTERFACES DE PROCESAMIENTO ====================

/**
 * Palabras clave extraídas de una consulta
 */
export interface ExtractedKeywords {
  /** Palabras clave principales */
  keywords: string[];
  /** Texto normalizado */
  normalizedText: string;
  /** Stop words removidas */
  stopWordsRemoved: string[];
}

/**
 * Resultado del procesamiento de NLP
 */
export interface NLPProcessResult {
  /** Texto original */
  originalText: string;
  /** Texto normalizado */
  normalizedText: string;
  /** Texto sanitizado */
  sanitizedText: string;
  /** Palabras clave extraídas */
  keywords: string[];
  /** Intención detectada */
  intent: UserIntent;
  /** Entidades extraídas */
  entities: {
    rank?: BeltRank;
    technique?: string;
    bodyPart?: string;
    category?: TechniqueCategory;
  };
}

// ==================== INTERFACES DE RESPUESTA ====================

/**
 * Respuesta formateada del sistema
 */
export interface SenseiResponse {
  /** Contenido de la respuesta */
  content: string;
  /** Tipo de respuesta */
  type: 'technique' | 'rank' | 'general' | 'motivational' | 'error';
  /** Metadatos de la respuesta */
  metadata: {
    /** Intención original */
    intent: UserIntent;
    /** Resultado de búsqueda usado */
    searchResult?: SearchResult;
    /** Tiempo de procesamiento en ms */
    processingTime: number;
  };
}

// ==================== INTERFACES DE LA BASE DE CONOCIMIENTO ====================

/**
 * Estructura general de la base de conocimiento
 */
export interface KnowledgeBase {
  /** Respuestas generales del sistema */
  general: {
    greeting: string;
    farewell: string;
    error: string;
    apology: string;
  };
  /** Preguntas frecuentes */
  faq: Record<string, string>;
  /** Partes del cuerpo y vocabulario */
  bodyParts: {
    general: Record<string, string>;
    hand: Record<string, string>;
    foot: Record<string, string>;
  };
  /** Información de la organización */
  organization: Record<string, string>;
  /** Código del dojo */
  dojoKun: string[];
  /** Vocabulario de karate */
  vocabulary: Record<string, string>;
  /** Historia del estilo */
  history: Record<string, string>;
  /** Lógica creativa */
  logica_creativa: {
    poema_karate_romance: string;
    metafora_progreso: string;
  };
  /** Técnicas por rango */
  techniquesByRank: Record<BeltRank, TechniquesByRank>;
  /** Detalles extendidos de técnicas */
  techniqueDetails: Record<string, ExtendedTechniqueDetail>;
}

// ==================== INTERFACES DE UI ====================

/**
 * Configuración del manejador de DOM
 */
export interface DOMHandlerConfig {
  /** ID del contenedor de mensajes */
  messagesContainerId: string;
  /** ID del input de usuario */
  userInputId: string;
  /** ID del botón de envío */
  sendButtonId: string;
  /** Clases CSS */
  cssClasses: {
    messageBubble: string;
    userMessage: string;
    senseiMessage: string;
    typingIndicator: string;
    typingDot: string;
  };
}

/**
 * Evento de mensaje de chat
 */
export interface ChatMessageEvent {
  /** Tipo de mensaje */
  type: 'user' | 'sensei' | 'system';
  /** Contenido del mensaje */
  content: string;
  /** Timestamp del mensaje */
  timestamp: Date;
  /** Metadatos adicionales */
  metadata?: Record<string, any>;
}

// ==================== INTERFACES DEL SISTEMA ====================

/**
 * Configuración del motor de inferencia
 */
export interface InferenceEngineConfig {
  /** Pesos para scoring */
  weights: ScoringWeights;
  /** Umbral de similitud para fuzzy matching */
  fuzzyThreshold: number;
  /** Número máximo de resultados */
  maxResults: number;
}

/**
 * Estado actual del sistema
 */
export interface SystemState {
  /** Si el sistema está procesando */
  isProcessing: boolean;
  /** Número de mensajes en el chat */
  messageCount: number;
  /** Última consulta del usuario */
  lastQuery?: string;
  /** Última respuesta generada */
  lastResponse?: SenseiResponse;
  /** Timestamp de la última actividad */
  lastActivity: Date;
}
