import type { 
  UserIntent, 
  NLPProcessResult, 
  SenseiResponse,
  KnowledgeBase,
  SearchResult,
  TechniqueDetail
} from '@/types';
import { NLPProcessor } from './NLPProcessor';

/**
 * Gestor de Intenciones de Usuario
 * Clasifica y dirige las consultas según su intención detectada
 */
export class IntentManager {
  private knowledgeBase: KnowledgeBase;

  constructor(knowledgeBase: KnowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }

  /**
   * Procesa la consulta del usuario y genera la respuesta apropiada
   * @param input - Texto de entrada del usuario
   * @returns Respuesta formateada del Sensei
   */
  public async processQuery(input: string): Promise<SenseiResponse> {
    const startTime = performance.now();
    
    // Procesar el texto con NLP
    const nlpResult = NLPProcessor.process(input);
    
    // Generar respuesta según la intención detectada
    let response: SenseiResponse;
    
    switch (nlpResult.intent) {
      case 'greeting':
        response = this.createGreetingResponse(nlpResult);
        break;
        
      case 'farewell':
        response = this.createFarewellResponse(nlpResult);
        break;
        
      case 'motivation_request':
        response = this.createMotivationResponse(nlpResult);
        break;
        
      case 'rank_query':
        response = this.createRankResponse(nlpResult);
        break;
        
      case 'technique_query':
      case 'body_part_query':
      case 'vocabulary_query':
      case 'history_query':
      case 'faq_query':
        // Estas intenciones requieren búsqueda en la base de conocimiento
        response = await this.createKnowledgeResponse(nlpResult);
        break;
        
      default:
        response = this.createErrorResponse(nlpResult);
    }
    
    const processingTime = performance.now() - startTime;
    response.metadata.processingTime = processingTime;
    
    return response;
  }

  /**
   * Crea una respuesta de saludo
   */
  private createGreetingResponse(nlpResult: NLPProcessResult): SenseiResponse {
    return {
      content: this.knowledgeBase.general.greeting,
      type: 'general',
      metadata: {
        intent: nlpResult.intent,
        processingTime: 0
      }
    };
  }

  /**
   * Crea una respuesta de despedida
   */
  private createFarewellResponse(nlpResult: NLPProcessResult): SenseiResponse {
    return {
      content: this.knowledgeBase.general.farewell,
      type: 'general',
      metadata: {
        intent: nlpResult.intent,
        processingTime: 0
      }
    };
  }

  /**
   * Crea una respuesta motivacional
   */
  private createMotivationResponse(nlpResult: NLPProcessResult): SenseiResponse {
    const { normalizedText } = nlpResult;
    let content = '';
    
    if (normalizedText.includes('frustrado') || normalizedText.includes('no puedo') || normalizedText.includes('difícil')) {
      content = "Osu. El camino del Budo es largo y a veces rocoso. Pero recuerda, la verdadera fuerza no es la que se muestra en un golpe, sino la que te levanta después de una caída. Sigue practicando con dedicación, y el muro que ves hoy será el escalón de mañana.";
    } else if (normalizedText.includes('poema') || normalizedText.includes('romance')) {
      content = this.knowledgeBase.logica_creativa.poema_karate_romance;
    } else if (normalizedText.includes('progreso') || normalizedText.includes('metafora')) {
      content = this.knowledgeBase.logica_creativa.metafora_progreso;
    } else {
      content = "Osu. Recuerda que el karate no solo fortalece el cuerpo, sino también el espíritu. Cada día de práctica es un paso hacia tu mejor versión. Continúa con el corazón de principiante y la determinación de un guerrero.";
    }
    
    return {
      content,
      type: 'motivational',
      metadata: {
        intent: nlpResult.intent,
        processingTime: 0
      }
    };
  }

  /**
   * Crea una respuesta para consultas de rango
   */
  private createRankResponse(nlpResult: NLPProcessResult): SenseiResponse {
    const { entities } = nlpResult;
    
    if (!entities.rank) {
      return this.createErrorResponse(nlpResult);
    }
    
    const techniques = this.knowledgeBase.techniquesByRank[entities.rank];
    
    if (!techniques) {
      return {
        content: `No encontré información específica para el rango ${entities.rank}. Los rangos disponibles van desde 10 kyu hasta 1 dan.`,
        type: 'error',
        metadata: {
          intent: nlpResult.intent,
          processingTime: 0
        }
      };
    }
    
    let content = `¡Osu! ¡Buena pregunta! Para el **${entities.rank}**, las técnicas que se suelen estudiar son:\n\n`;
    
    if (techniques.teWaza.length > 0) {
      content += "Técnicas de puño (Te Waza):\n- " + techniques.teWaza.join('\n- ') + '\n\n';
    }
    
    if (techniques.fuseguiWaza.length > 0) {
      content += "Técnicas de defensa (Fusegui Waza):\n- " + techniques.fuseguiWaza.join('\n- ') + '\n\n';
    }
    
    if (techniques.ashiWaza.length > 0) {
      content += "Técnicas de patada (Ashi Waza):\n- " + techniques.ashiWaza.join('\n- ') + '\n\n';
    }
    
    content += "Recuerda que cada técnica requiere práctica constante. Sigue así.";
    
    return {
      content,
      type: 'rank',
      metadata: {
        intent: nlpResult.intent,
        processingTime: 0
      }
    };
  }

  /**
   * Crea una respuesta basada en conocimiento (requiere motor de inferencia)
   */
  private async createKnowledgeResponse(nlpResult: NLPProcessResult): Promise<SenseiResponse> {
    // Este método delegará al InferenceEngine cuando se implemente
    // Por ahora, implementaremos una búsqueda básica
    const { normalizedText, keywords, intent } = nlpResult;
    
    // Búsqueda en FAQs
    for (const [key, value] of Object.entries(this.knowledgeBase.faq)) {
      if (NLPProcessor.fuzzyMatch(normalizedText, key) > 0.7 || 
          keywords.some(keyword => NLPProcessor.fuzzyMatch(keyword, key) > 0.7)) {
        return {
          content: `¡Osu! ¡Buena pregunta!\n\n${value}`,
          type: 'general',
          metadata: {
            intent,
            processingTime: 0
          }
        };
      }
    }
    
    // Búsqueda en vocabulario
    for (const [key, value] of Object.entries(this.knowledgeBase.vocabulary)) {
      if (NLPProcessor.fuzzyMatch(normalizedText, key) > 0.7 || 
          keywords.some(keyword => NLPProcessor.fuzzyMatch(keyword, key) > 0.7)) {
        return {
          content: `¡Osu! ¡Buena pregunta!\n\n${value}`,
          type: 'general',
          metadata: {
            intent,
            processingTime: 0
          }
        };
      }
    }
    
    // Búsqueda en historia
    if (intent === 'history_query') {
      for (const [key, value] of Object.entries(this.knowledgeBase.history)) {
        if (NLPProcessor.fuzzyMatch(normalizedText, key) > 0.7 || 
            keywords.some(keyword => NLPProcessor.fuzzyMatch(keyword, key) > 0.7)) {
          return {
            content: `¡Osu! ¡Buena pregunta!\n\n${value}`,
            type: 'general',
            metadata: {
              intent,
              processingTime: 0
            }
          };
        }
      }
    }
    
    // Si no se encuentra nada específico
    return this.createErrorResponse(nlpResult);
  }

  /**
   * Crea una respuesta basada en SearchResult del InferenceEngine
   */
  public createResponseFromSearchResult(searchResult: SearchResult, nlpResult: NLPProcessResult): SenseiResponse {
    let content = '';
    let type: SenseiResponse['type'] = 'general';

    switch (searchResult.type) {
      case 'technique':
        const technique = searchResult.item as TechniqueDetail;
        content = `¡Osu! ¡Excelente pregunta sobre ${technique.itemSpanishName}!\n\n`;
        content += `**Descripción:** ${technique.descripcion}\n\n`;
        content += `**Uso:** ${technique.uso}\n\n`;
        content += `**Nivel requerido:** ${technique.cinturon}`;
        
        // Añadir sugerencia si existe
        if (searchResult.suggestion) {
          content += `\n\n💡 **Sugerencia del Sensei:** ${searchResult.suggestion}`;
        }
        
        type = 'technique';
        break;
        
      case 'rank':
        const rankData = searchResult.data;
        if (rankData) {
          content = `¡Osu! ¡Buena pregunta sobre el **${searchResult.key}**!\n\n`;
          
          Object.entries(rankData).forEach(([category, techniques]) => {
            if (Array.isArray(techniques) && techniques.length > 0) {
              const categoryName = this.getCategoryDisplayName(category);
              content += `**${categoryName}**:\n`;
              content += techniques.map(t => `- ${t}`).join('\n') + '\n\n';
            }
          });
        }
        type = 'rank';
        break;
        
      case 'body_parts_category':
        const bodyPartData = searchResult.data;
        content = `¡Osu! ¡Buena pregunta!\n\nLas partes del cuerpo en karate:\n\n`;
        
        Object.entries(bodyPartData).forEach(([key, value]) => {
          content += `- **${key.replace('_', ' ').toUpperCase()}:** ${value}\n`;
        });
        type = 'general';
        break;
        
      case 'body_part':
        content = `¡Osu! ¡Buena pregunta!\n\n${searchResult.item}`;
        type = 'general';
        break;
        
      case 'general':
      default:
        content = `¡Osu! ¡Buena pregunta!\n\n${searchResult.item}`;
        type = 'general';
        break;
    }

    return {
      content,
      type,
      metadata: {
        intent: nlpResult.intent,
        searchResult,
        processingTime: 0
      }
    };
  }

  /**
   * Obtiene el nombre para mostrar de una categoría
   */
  private getCategoryDisplayName(category: string): string {
    const names: Record<string, string> = {
      teWaza: 'Técnicas de Mano (Te Waza)',
      fuseguiWaza: 'Técnicas de Defensa (Fusegui Waza)',
      ashiWaza: 'Técnicas de Patada (Ashi Waza)'
    };
    
    return names[category] || category;
  }

  /**
   * Crea una respuesta de error
   */
  private createErrorResponse(nlpResult: NLPProcessResult): SenseiResponse {
    return {
      content: this.knowledgeBase.general.error,
      type: 'error',
      metadata: {
        intent: nlpResult.intent,
        processingTime: 0
      }
    };
  }

  /**
   * Verifica si el sistema puede manejar la intención detectada
   * @param intent - Intención a verificar
   * @returns true si la intención es soportada
   */
  public isIntentSupported(intent: UserIntent): boolean {
    return intent !== 'unknown';
  }

  /**
   * Obtiene sugerencias basadas en la intención actual
   * @param intent - Intención actual
   * @returns Array de sugerencias
   */
  public getSuggestions(intent: UserIntent): string[] {
    const suggestions: Record<UserIntent, string[]> = {
      greeting: ['¿Qué técnicas debo practicar para 8 kyu?', '¿Qué significa "Oss"?', '¿Cuál es el origen del karate?'],
      farewell: ['¡Gracias por tu ayuda!', 'Seguiré practicando', 'Hasta la próxima'],
      technique_query: ['Oi Zuki', 'Gyaku Zuki', 'Mae Geri', 'Gedan Barai', 'Shuto Uchi'],
      rank_query: ['¿Qué técnicas son para 5 kyu?', '¿Qué aprendo en 1 dan?', 'Técnicas para cinturón blanco'],
      body_part_query: ['¿Partes de la mano?', '¿Qué es Jyo Dan?', 'Zonas del cuerpo en karate'],
      vocabulary_query: ['¿Qué significa dojo?', '¿Qué es kumite?', 'Significado de kata'],
      history_query: ['¿Quién fundó el Shindo Jinen Ryu?', 'Origen del karate', 'Historia del estilo'],
      motivation_request: ['Necesito motivación', 'Estoy frustrado con mi progreso', 'Poema de karate'],
      faq_query: ['¿Qué es el karate?', '¿Para qué sirve el karate?', 'Estilos de karate'],
      unknown: ['¿Puedes explicarme qué es el karate?', '¿Qué técnicas básicas debo aprender?', 'Ayúdame a empezar']
    };
    
    return suggestions[intent] || suggestions.unknown;
  }
}
