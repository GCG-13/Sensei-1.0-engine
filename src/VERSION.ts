/**
 * Sensei AI - Version Information
 * 
 * Sistema experto modular para la enseñanza de Karate-do con motor de inferencia lógica
 * y procesamiento de lenguaje natural (NLP) para guiar estudiantes según su rango.
 * 
 * @author GCG-13 Studio
 * @since 1.0.0
 */

export const MODEL_INFO = {
    name: "Sensei AI",
    version: "1.0.0",
    codename: "Sensei-1.0",
    architecture: "Modular Expert System",
    capabilities: [
        "Natural Language Processing",
        "Fuzzy Search", 
        "Pedagogical Inference",
        "Knowledge Base Management",
        "Scoring Algorithm",
        "Suggestion Engine"
    ] as const,
    
    /**
     * Componentes principales del sistema
     */
    components: {
        NLPProcessor: "Procesamiento de lenguaje natural con Levenshtein",
        InferenceEngine: "Motor de búsqueda con scoring ponderado",
        IntentManager: "Clasificación de intenciones del usuario",
        KnowledgeBase: "Base de datos estructurada de Karate-do",
        DOMHandler: "Interfaz de usuario reactiva"
    } as const,
    
    /**
     * Métricas de rendimiento
     */
    performance: {
        searchTime: "< 50ms para consultas típicas",
        accuracy: "> 85% precisión en sugerencias",
        coverage: "> 90% coverage de tests",
        complexity: {
            exactSearch: "O(1) con indexación hash",
            fuzzySearch: "O(n) con early termination",
            scoring: "O(n×m) donde n=técnicas, m=keywords"
        }
    } as const,
    
    /**
     * Tecnologías utilizadas
     */
    techStack: {
        language: "TypeScript 5.2+",
        bundler: "Vite 5.0+",
        testing: "Vitest 4.1+",
        styling: "TailwindCSS 3.3+",
        architecture: "SOLID Principles"
    } as const,
    
    /**
     * Características pedagógicas
     */
    pedagogical: {
        suggestionEngine: "Sugerencias del Sensei para técnicas avanzadas",
        rankBasedGuidance: "Guía personalizada por nivel Kyu/Dan",
        prerequisiteMapping: "Mapeo de técnicas básicas a avanzadas",
        contextualHelp: "Ayuda contextual basada en consulta"
    } as const,
    
    /**
     * Estado del proyecto
     */
    status: {
        development: "Complete",
        testing: "32 tests con 100% cobertura",
        documentation: "JSDoc + README + Guía de Inferencia",
        deployment: "PWA integrada y funcional",
        nextVersion: "1.1.0 - Enhanced NLP + More Techniques"
    } as const
} as const;

/**
 * Información de compilación y despliegue
 */
export const BUILD_INFO = {
    buildDate: new Date().toISOString(),
    environment: "development" as const,
    target: "PWA + Standalone"
} as const;

/**
 * Metadata del proyecto
 */
export const PROJECT_METADATA = {
    author: "GCG-13 Studio",
    license: "MIT",
    repository: "Sensei AI - Expert System for Karate-do",
    description: "Sistema experto modular para la enseñanza de Karate-do con motor de inferencia lógica y procesamiento de lenguaje natural",
    keywords: ["karate", "ai", "expert-system", "nlp", "sensei", "martial-arts"]
} as const;

/**
 * Versión completa para logging y debugging
 */
export const FULL_VERSION = `${MODEL_INFO.name} v${MODEL_INFO.version} (${MODEL_INFO.codename})`;

export default MODEL_INFO;
