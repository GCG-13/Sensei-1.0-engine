import type { SearchResult, NLPProcessResult } from '@/types';
import { NLPProcessor } from '../NLPProcessor';

/**
 * Interfaz para estrategias de búsqueda
 * Aplica el patrón Strategy para diferentes tipos de búsqueda
 */
export interface SearchStrategy {
  search(query: string, keywords: string[], entities: NLPProcessResult['entities'], data: any): SearchResult[];
}

/**
 * Estrategia de búsqueda para técnicas con scoring optimizado
 */
export class TechniqueSearchStrategy implements SearchStrategy {
  private weights: {
    exact_match: number;
    keyword_match: number;
    fuzzy_match: number;
    partial_match: number;
    category_boost: number;
  };
  private fuzzyThreshold: number;

  constructor(weights: any, fuzzyThreshold: number) {
    this.weights = weights;
    this.fuzzyThreshold = fuzzyThreshold;
  }

  search(query: string, keywords: string[], entities: NLPProcessResult['entities'], data: any): SearchResult[] {
    const results: SearchResult[] = [];
    const techniqueDetails = data.techniqueDetails;
    const techniquesByRank = data.techniquesByRank;

    // Cache para evitar duplicados y mejorar rendimiento
    const processedTechniques = new Set<string>();

    // 1. Búsqueda optimizada en techniqueDetails
    if (techniqueDetails) {
      for (const [techniqueName, techniqueDetail] of Object.entries(techniqueDetails)) {
        const result = this.evaluateTechnique(query, keywords, entities, techniqueName, techniqueDetail, 'techniqueDetails');
        if (result) {
          results.push(result);
          processedTechniques.add(techniqueName);
        }
      }
    }

    // 2. Búsqueda en techniquesByRank solo para técnicas no procesadas
    if (techniquesByRank) {
      for (const [rank, techniques] of Object.entries(techniquesByRank)) {
        for (const [category, techniqueList] of Object.entries(techniques)) {
          for (const techniqueName of techniqueList) {
            if (processedTechniques.has(techniqueName)) continue;

            const result = this.evaluateRankTechnique(query, keywords, entities, techniqueName, rank, category);
            if (result) {
              results.push(result);
            }
          }
        }
      }
    }

    return results;
  }

  private evaluateTechnique(
    query: string, 
    keywords: string[], 
    entities: NLPProcessResult['entities'], 
    techniqueName: string, 
    techniqueDetail: any, 
    section: string
  ): SearchResult | null {
    let score = 0;
    let matchType: SearchResult['matchType'] = 'partial';

    const normalizedTechnique = NLPProcessor.normalizeText(techniqueName);
    
    // Evaluación de coincidencia con early return para optimización
    if (normalizedTechnique === query) {
      score = this.weights.exact_match;
      matchType = 'exact';
    } else if (normalizedTechnique.includes(query) || query.includes(normalizedTechnique)) {
      score = this.weights.partial_match;
      matchType = 'partial';
    } else {
      const fuzzyScore = NLPProcessor.fuzzyMatch(query, normalizedTechnique);
      if (fuzzyScore > this.fuzzyThreshold) {
        score = this.weights.fuzzy_match * fuzzyScore;
        matchType = 'fuzzy';
      }
    }

    if (score === 0) return null;

    // Evaluación de keywords con vectorización
    const keywordScore = this.evaluateKeywords(keywords, techniqueDetail);
    score += keywordScore;

    // Aplicación de boosts
    if (entities.category && techniqueDetail.category === entities.category) {
      score += this.weights.category_boost * 1.5;
    }

    if (entities.rank && techniqueDetail.cinturon === entities.rank) {
      score += this.weights.category_boost * 2;
    }

    return {
      type: 'technique',
      score,
      matchType,
      section,
      key: techniqueName,
      item: {
        descripcion: techniqueDetail.descripcion,
        uso: techniqueDetail.uso,
        cinturon: techniqueDetail.cinturon,
        itemSpanishName: techniqueName
      },
      data: { 
        rank: techniqueDetail.cinturon, 
        category: techniqueDetail.category,
        techniqueName,
        keywords: techniqueDetail.keywords
      }
    };
  }

  private evaluateRankTechnique(
    query: string, 
    keywords: string[], 
    entities: NLPProcessResult['entities'], 
    techniqueName: string, 
    rank: string, 
    category: string
  ): SearchResult | null {
    let score = 0;
    let matchType: SearchResult['matchType'] = 'partial';

    const normalizedTechnique = NLPProcessor.normalizeText(techniqueName);
    
    if (normalizedTechnique === query) {
      score = this.weights.exact_match;
      matchType = 'exact';
    } else if (normalizedTechnique.includes(query) || query.includes(normalizedTechnique)) {
      score = this.weights.partial_match;
      matchType = 'partial';
    } else {
      const fuzzyScore = NLPProcessor.fuzzyMatch(query, normalizedTechnique);
      if (fuzzyScore > this.fuzzyThreshold) {
        score = this.weights.fuzzy_match * fuzzyScore;
        matchType = 'fuzzy';
      }
    }

    if (score === 0) return null;

    // Evaluación de keywords en nombre
    keywords.forEach(keyword => {
      if (normalizedTechnique.includes(keyword)) {
        score += this.weights.keyword_match * 0.6;
      }
    });

    // Boosts
    if (entities.category && category === entities.category) {
      score += this.weights.category_boost * 1.5;
    }

    if (entities.rank && rank === entities.rank) {
      score += this.weights.category_boost * 2;
    }

    return {
      type: 'technique',
      score,
      matchType,
      section: 'techniquesByRank',
      key: `${rank}.${category}.${techniqueName}`,
      item: {
        descripcion: `Técnica de ${this.getCategoryName(category)} para el rango ${rank}`,
        uso: `Practicada en kihon y katas para el nivel ${rank}`,
        cinturon: rank,
        itemSpanishName: techniqueName
      },
      data: { rank, category, techniqueName }
    };
  }

  private evaluateKeywords(keywords: string[], techniqueDetail: any): number {
    let score = 0;
    
    // Evaluación de keywords predefinidas (más eficiente)
    if (techniqueDetail.keywords) {
      for (const keyword of keywords) {
        for (const kw of techniqueDetail.keywords) {
          if (NLPProcessor.fuzzyMatch(keyword, kw) > 0.8) {
            score += this.weights.keyword_match * 0.8;
            break;
          }
        }
      }
    }
    
    // Evaluación en descripción y uso
    const normalizedDesc = NLPProcessor.normalizeText(techniqueDetail.descripcion);
    const normalizedUso = NLPProcessor.normalizeText(techniqueDetail.uso);
    
    for (const keyword of keywords) {
      if (normalizedDesc.includes(keyword) || normalizedUso.includes(keyword)) {
        score += this.weights.keyword_match * 0.5;
      }
    }
    
    return score;
  }

  private getCategoryName(category: string): string {
    const categoryNames: Record<string, string> = {
      teWaza: 'Técnicas de Mano',
      ashiWaza: 'Técnicas de Patada',
      fuseguiWaza: 'Técnicas de Defensa',
      atemiWaza: 'Técnicas de Puntos Vitales'
    };
    
    return categoryNames[category] || category;
  }
}

/**
 * Estrategia de búsqueda genérica para FAQs, vocabulario, historia
 */
export class GenericSearchStrategy implements SearchStrategy {
  private weights: any;
  private fuzzyThreshold: number;

  constructor(weights: any, fuzzyThreshold: number) {
    this.weights = weights;
    this.fuzzyThreshold = fuzzyThreshold;
  }

  search(query: string, keywords: string[], entities: NLPProcessResult['entities'], data: Record<string, string>): SearchResult[] {
    const results: SearchResult[] = [];

    for (const [key, value] of Object.entries(data)) {
      let score = 0;
      let matchType: SearchResult['matchType'] = 'partial';

      const normalizedKey = NLPProcessor.normalizeText(key);
      
      if (normalizedKey === query) {
        score = this.weights.exact_match;
        matchType = 'exact';
      } else if (normalizedKey.includes(query) || query.includes(normalizedKey)) {
        score = this.weights.partial_match;
        matchType = 'partial';
      } else {
        const fuzzyScore = NLPProcessor.fuzzyMatch(query, normalizedKey);
        if (fuzzyScore > this.fuzzyThreshold) {
          score = this.weights.fuzzy_match * fuzzyScore;
          matchType = 'fuzzy';
        }
      }

      if (score === 0) continue;

      // Búsqueda por keywords en el contenido
      for (const keyword of keywords) {
        const normalizedValue = NLPProcessor.normalizeText(value);
        if (normalizedValue.includes(keyword)) {
          score += this.weights.keyword_match * 0.5;
        }
      }

      results.push({
        type: 'general',
        score,
        matchType,
        section: 'generic',
        key,
        item: value
      });
    }

    return results;
  }
}

/**
 * Estrategia de búsqueda para partes del cuerpo
 */
export class BodyPartsSearchStrategy implements SearchStrategy {
  private weights: any;
  private fuzzyThreshold: number;

  constructor(weights: any, fuzzyThreshold: number) {
    this.weights = weights;
    this.fuzzyThreshold = fuzzyThreshold;
  }

  search(query: string, keywords: string[], entities: NLPProcessResult['entities'], data: any): SearchResult[] {
    const results: SearchResult[] = [];

    // Búsqueda por categorías específicas
    if (query.includes('partes del pie') || query.includes('pie')) {
      results.push({
        type: 'body_parts_category',
        score: this.weights.exact_match,
        matchType: 'exact',
        section: 'bodyParts',
        key: 'foot',
        data: data.foot
      });
    }

    if (query.includes('partes de la mano') || query.includes('mano')) {
      results.push({
        type: 'body_parts_category',
        score: this.weights.exact_match,
        matchType: 'exact',
        section: 'bodyParts',
        key: 'hand',
        data: data.hand
      });
    }

    if (query.includes('partes del cuerpo') || query.includes('cuerpo')) {
      results.push({
        type: 'body_parts_category',
        score: this.weights.exact_match,
        matchType: 'exact',
        section: 'bodyParts',
        key: 'general',
        data: data.general
      });
    }

    // Búsqueda individual de partes del cuerpo
    ['general', 'hand', 'foot'].forEach(category => {
      const categoryData = data[category];
      if (!categoryData) return;

      Object.entries(categoryData).forEach(([key, value]) => {
        keywords.forEach(keyword => {
          const normalizedKey = NLPProcessor.normalizeText(key);
          const normalizedValue = NLPProcessor.normalizeText(value);
          
          if (normalizedKey.includes(keyword) || normalizedValue.includes(keyword)) {
            results.push({
              type: 'body_part',
              score: this.weights.keyword_match,
              matchType: 'keyword',
              section: 'bodyParts',
              key: `${category}.${key}`,
              item: value
            });
          }
        });
      });
    });

    return results;
  }
}
