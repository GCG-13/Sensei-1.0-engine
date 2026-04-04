/**
 * 🎯 INTERFACES CENTRALIZADAS - PATRÓN DE PREVENCIÓN
 * Interfaces compartidas para todo el sistema cognitivo
 * Previene desajustes de tipos entre componentes
 */

// ==================== INTERFACES BASE ====================

/**
 * Interfaz base para todos los componentes cognitivos
 */
export interface CognitiveComponent {
  initialize(): Promise<void>;
  getStatus(): ComponentStatus;
  getMetrics(): ComponentMetrics;
  healthCheck(): Promise<HealthCheckResult>;
}

/**
 * Estado de componente estándar
 */
export interface ComponentStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'failed';
  lastCheck: number;
  responseTime: number;
  errorCount: number;
}

/**
 * Métricas de componente estándar
 */
export interface ComponentMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  memoryUsage: number;
}

/**
 * Resultado de health check estándar
 */
export interface HealthCheckResult {
  healthy: boolean;
  responseTime: number;
  issues: string[];
  recommendations: string[];
}

// ==================== INTERFACES DE COMUNICACIÓN ====================

/**
 * Interfaz estándar para solicitudes entre componentes
 */
export interface ComponentRequest {
  id: string;
  type: string;
  data: any;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Interfaz estándar para respuestas entre componentes
 */
export interface ComponentResponse {
  requestId: string;
  success: boolean;
  data: any;
  error?: string;
  processingTime: number;
  confidence: number;
  metadata?: Record<string, any>;
}

// ==================== INTERFACES DE PROCESAMIENTO ====================

/**
 * Interfaz estándar para procesamiento de datos
 */
export interface ProcessingRequest {
  input: any;
  options: ProcessingOptions;
  context: ProcessingContext;
}

export interface ProcessingOptions {
  strategy?: string;
  depth?: number;
  timeout?: number;
  retry?: number;
}

export interface ProcessingContext {
  sessionId: string;
  userId?: string;
  previousResults?: any[];
  componentState?: Record<string, any>;
}

/**
 * Interfaz estándar para resultados de procesamiento
 */
export interface ProcessingResult {
  success: boolean;
  data: any;
  confidence: number;
  processingTime: number;
  strategy: string;
  insights: string[];
  issues: ProcessingIssue[];
}

export interface ProcessingIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion: string;
}

// ==================== INTERFACES DE MEMORIA ====================

/**
 * Interfaz estándar para operaciones de memoria
 */
export interface MemoryRequest {
  operation: 'store' | 'retrieve' | 'update' | 'delete';
  key?: string;
  data?: any;
  metadata?: MemoryMetadata;
}

export interface MemoryMetadata {
  timestamp: number;
  importance: number;
  accessCount: number;
  lastAccessed: number;
  tags: string[];
}

/**
 * Interfaz estándar para respuestas de memoria
 */
export interface MemoryResponse {
  success: boolean;
  data?: any;
  exists?: boolean;
  operation: string;
  processingTime: number;
}

// ==================== INTERFACES DE APRENDIZAJE ====================

/**
 * Interfaz estándar para solicitudes de aprendizaje
 */
export interface LearningRequest {
  interactionId: string;
  sessionId: string;
  input: any;
  output: any;
  feedback?: LearningFeedback;
  context: LearningContext;
}

export interface LearningFeedback {
  explicit: ExplicitFeedback;
  implicit: ImplicitFeedback;
  behavioral: BehavioralFeedback;
}

export interface ExplicitFeedback {
  rating: number;
  comment?: string;
  helpful: boolean;
  accurate: boolean;
}

export interface ImplicitFeedback {
  readingTime: number;
  responseTime: number;
  followUpQuestions: number;
  sessionLength: number;
}

export interface BehavioralFeedback {
  clickPatterns: any[];
  navigationPatterns: any[];
  interactionFrequency: any;
}

export interface LearningContext {
  userLevel: string;
  previousInteractions: any[];
  currentTopic: string;
  emotionalState: any;
}

/**
 * Interfaz estándar para resultados de aprendizaje
 */
export interface LearningResponse {
  success: boolean;
  adaptations: Adaptation[];
  insights: LearningInsight[];
  improvements: ImprovementArea[];
  processingTime: number;
}

export interface Adaptation {
  component: string;
  parameter: string;
  oldValue: any;
  newValue: any;
  reason: string;
  confidence: number;
}

export interface LearningInsight {
  pattern: string;
  effectiveness: number;
  context: string;
  recommendation: string;
}

export interface ImprovementArea {
  area: string;
  current: number;
  target: number;
  strategies: string[];
  progress: number;
}

// ==================== INTERFACES DE METACOGNICIÓN ====================

/**
 * Interfaz estándar para análisis metacognitivo
 */
export interface MetacognitionRequest {
  sessionId: string;
  thoughtProcess: ThoughtProcessData;
  reasoningResult: any;
  context: MetacognitionContext;
  timestamp: number;
}

export interface ThoughtProcessData {
  stages: ProcessStage[];
  decisions: DecisionPoint[];
  strategies: StrategyChoice[];
  resources: ResourceAllocation[];
  efficiency: EfficiencyMetrics;
  quality: QualityAssessment;
}

export interface ProcessStage {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  input: any;
  output: any;
  strategy: string;
  confidence: number;
}

export interface DecisionPoint {
  id: string;
  timestamp: number;
  context: string;
  options: DecisionOption[];
  selected: DecisionOption;
  reasoning: string;
  confidence: number;
}

export interface DecisionOption {
  id: string;
  description: string;
  strategy: string;
  expectedOutcome: string;
  risk: number;
  confidence: number;
}

export interface StrategyChoice {
  strategy: string;
  reason: string;
  alternatives: StrategyAlternative[];
  effectiveness: number;
  efficiency: number;
}

export interface StrategyAlternative {
  strategy: string;
  reason: string;
  wouldHaveBeen: string;
  effectiveness: number;
}

export interface ResourceAllocation {
  component: string;
  allocated: number;
  used: number;
  efficiency: number;
}

export interface EfficiencyMetrics {
  overall: number;
  stages: StageEfficiency[];
  resources: ResourceEfficiency[];
  time: TimeEfficiency;
  quality: QualityEfficiency;
}

export interface StageEfficiency {
  stage: string;
  efficiency: number;
  time: number;
  quality: number;
}

export interface ResourceEfficiency {
  resource: string;
  efficiency: number;
  utilization: number;
  waste: number;
}

export interface TimeEfficiency {
  totalTime: number;
  stageTimes: Record<string, number>;
  idleTime: number;
  parallelization: number;
}

export interface QualityEfficiency {
  accuracy: number;
  completeness: number;
  consistency: number;
  relevance: number;
}

export interface QualityAssessment {
  overall: number;
  dimensions: QualityDimension[];
  issues: QualityIssue[];
  improvements: QualityImprovement[];
}

export interface QualityDimension {
  dimension: string;
  score: number;
  trend: 'improving' | 'declining' | 'stable';
  factors: string[];
}

export interface QualityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  resolution: string;
}

export interface QualityImprovement {
  area: string;
  current: number;
  target: number;
  strategies: string[];
  timeline: string;
}

export interface MetacognitionContext {
  userLevel: string;
  sessionHistory: any;
  systemState: any;
  cognitiveLoad: any;
}

/**
 * Interfaz estándar para resultados metacognitivos
 */
export interface MetacognitionResponse {
  success: boolean;
  selfAwareness: SelfAwarenessAssessment;
  thinkingAnalysis: ThinkingAnalysis;
  qualityEvaluation: QualityEvaluation;
  optimization: OptimizationRecommendations;
  learning: LearningInsights;
  adaptation: AdaptationPlan;
  processingTime: number;
}

export interface SelfAwarenessAssessment {
  level: 'minimal' | 'basic' | 'moderate' | 'high' | 'complete';
  consciousness: ConsciousnessMetrics;
  introspection: IntrospectionAnalysis;
  selfMonitoring: SelfMonitoringAnalysis;
  selfRegulation: SelfRegulationAnalysis;
}

export interface ConsciousnessMetrics {
  awareness: number;
  metacognition: number;
  selfReflection: number;
  strategicThinking: number;
  adaptability: number;
}

export interface IntrospectionAnalysis {
  depth: number;
  accuracy: number;
  completeness: number;
  objectivity: number;
  insights: string[];
}

export interface SelfMonitoringAnalysis {
  effectiveness: number;
  accuracy: number;
  timeliness: number;
  coverage: number;
  gaps: string[];
}

export interface SelfRegulationAnalysis {
  effectiveness: number;
  strategies: string[];
  adaptations: string[];
  improvements: string[];
  challenges: string[];
}

export interface ThinkingAnalysis {
  processQuality: ProcessQuality;
  strategyEffectiveness: StrategyEffectiveness;
  decisionQuality: DecisionQuality;
  resourceEfficiency: ResourceEfficiency;
  biasDetection: BiasDetection;
}

export interface ProcessQuality {
  structure: number;
  logic: number;
  completeness: number;
  efficiency: number;
  consistency: number;
}

export interface StrategyEffectiveness {
  overall: number;
  appropriateness: number;
  execution: number;
  adaptation: number;
  alternatives: string[];
}

export interface DecisionQuality {
  accuracy: number;
  speed: number;
  consistency: number;
  justification: number;
  outcomes: number;
}

export interface BiasDetection {
  detected: CognitiveBias[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  mitigation: string[];
  prevention: string[];
}

export interface CognitiveBias {
  type: string;
  description: string;
  evidence: string[];
  confidence: number;
  impact: string;
}

export interface QualityEvaluation {
  overall: number;
  dimensions: QualityDimension[];
  standards: QualityStandard[];
  compliance: ComplianceAssessment;
  improvements: QualityImprovement[];
}

export interface QualityStandard {
  name: string;
  criteria: QualityCriterion[];
  threshold: number;
  importance: number;
}

export interface QualityCriterion {
  aspect: string;
  measure: string;
  target: number;
  weight: number;
}

export interface ComplianceAssessment {
  compliant: boolean;
  score: number;
  violations: StandardViolation[];
  recommendations: string[];
}

export interface StandardViolation {
  standard: string;
  criterion: string;
  actual: number;
  target: number;
  severity: string;
}

export interface OptimizationRecommendations {
  immediate: ImmediateOptimization[];
  shortTerm: ShortTermOptimization[];
  longTerm: LongTermOptimization[];
  strategic: StrategicOptimization[];
  priority: OptimizationPriority;
}

export interface ImmediateOptimization {
  area: string;
  issue: string;
  solution: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: 'immediate';
}

export interface ShortTermOptimization {
  area: string;
  issue: string;
  solution: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: '1-7 days';
}

export interface LongTermOptimization {
  area: string;
  issue: string;
  solution: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: '1-4 weeks';
}

export interface StrategicOptimization {
  area: string;
  vision: string;
  roadmap: string[];
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: '1-6 months';
}

export interface OptimizationPriority {
  high: string[];
  medium: string[];
  low: string[];
  rationale: string;
}

export interface LearningInsights {
  lessons: Lesson[];
  patterns: ThinkingPattern[];
  improvements: PersonalImprovement[];
  adaptations: CognitiveAdaptation[];
}

export interface Lesson {
  situation: string;
  lesson: string;
  application: string;
  importance: number;
  frequency: number;
}

export interface ThinkingPattern {
  pattern: string;
  effectiveness: number;
  context: string;
  alternatives: string[];
  optimization: string;
}

export interface PersonalImprovement {
  area: string;
  current: number;
  target: number;
  strategies: string[];
  progress: number;
}

export interface CognitiveAdaptation {
  type: 'cognitive' | 'strategic' | 'behavioral' | 'structural';
  description: string;
  effectiveness: number;
  transfer: number;
  retention: number;
}

export interface AdaptationPlan {
  immediate: ImmediateAdaptation[];
  shortTerm: ShortTermAdaptation[];
  longTerm: LongTermAdaptation[];
  monitoring: MonitoringPlan;
  evaluation: EvaluationPlan;
}

export interface ImmediateAdaptation {
  component: string;
  change: string;
  reason: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ShortTermAdaptation {
  component: string;
  change: string;
  reason: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: '1-7 days';
}

export interface LongTermAdaptation {
  component: string;
  change: string;
  reason: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: '1-4 weeks';
}

export interface MonitoringPlan {
  metrics: string[];
  frequency: string;
  thresholds: Threshold[];
  alerts: AlertRule[];
}

export interface Threshold {
  metric: string;
  min: number;
  max: number;
  action: string;
}

export interface AlertRule {
  metric: string;
  threshold: number;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface EvaluationPlan {
  criteria: EvaluationCriteria[];
  timeline: string;
  success: SuccessCriteria[];
  reporting: ReportingPlan;
}

export interface EvaluationCriteria {
  aspect: string;
  measure: string;
  target: number;
  weight: number;
}

export interface SuccessCriteria {
  criterion: string;
  threshold: number;
  measurement: string;
}

export interface ReportingPlan {
  frequency: string;
  recipients: string[];
  format: string;
  metrics: string[];
}

// ==================== UTILIDADES ====================

/**
 * Tipo unión para todos los tipos de respuesta posibles
 */
export type ResponseType = 
  | 'technique' 
  | 'rank' 
  | 'general' 
  | 'motivational' 
  | 'error';

/**
 * Tipo unión para todos los niveles de usuario
 */
export type UserLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced' 
  | 'expert' 
  | 'master';

/**
 * Tipo unión para todas las prioridades
 */
export type Priority = 
  | 'critical' 
  | 'high' 
  | 'medium' 
  | 'low';

/**
 * Tipo unión para todos los niveles de severidad
 */
export type Severity = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical';

/**
 * Interfaz para metadatos estándar
 */
export interface StandardMetadata {
  timestamp: number;
  processingTime: number;
  confidence: number;
  component: string;
  version: string;
}
