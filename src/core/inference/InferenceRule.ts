import type { SearchResult, NLPProcessResult, BeltRank } from '@/types';

/**
 * Interfaz para reglas de inferencia
 * Aplica el patrón Chain of Responsibility para procesamiento de reglas
 */
export interface InferenceRule {
  apply(results: SearchResult[], nlpResult: NLPProcessResult): SearchResult[];
  setNext(rule: InferenceRule): InferenceRule;
}

/**
 * Clase base para reglas de inferencia
 */
export abstract class BaseInferenceRule implements InferenceRule {
  protected nextRule: InferenceRule | null = null;

  setNext(rule: InferenceRule): InferenceRule {
    this.nextRule = rule;
    return rule;
  }

  apply(results: SearchResult[], nlpResult: NLPProcessResult): SearchResult[] {
    // Aplicar regla actual
    let processedResults = this.processRule(results, nlpResult);
    
    // Pasar al siguiente rule si existe
    if (this.nextRule) {
      processedResults = this.nextRule.apply(processedResults, nlpResult);
    }
    
    return processedResults;
  }

  protected abstract processRule(results: SearchResult[], nlpResult: NLPProcessResult): SearchResult[];
}

/**
 * Regla para filtrar resultados por umbral de score
 */
export class ScoreThresholdRule extends BaseInferenceRule {
  private threshold: number;

  constructor(threshold: number = 0.3) {
    super();
    this.threshold = threshold;
  }

  protected processRule(results: SearchResult[], nlpResult: NLPProcessResult): SearchResult[] {
    if (results.length === 0) return results;

    const maxScore = Math.max(...results.map(r => r.score));
    const actualThreshold = maxScore * this.threshold;
    
    return results.filter(result => result.score >= actualThreshold);
  }
}

/**
 * Regla para añadir sugerencias de prerrequisitos
 */
export class PrerequisiteRule extends BaseInferenceRule {
  private rankHierarchy: string[];
  private knowledgeBase: any;

  constructor(knowledgeBase: any) {
    super();
    this.knowledgeBase = knowledgeBase;
    this.rankHierarchy = [
      '10 kyu', '9 kyu', '8 kyu', '7 kyu', '6 kyu', '5 kyu', 
      '4 kyu', '3 kyu', '2 kyu', '1 kyu', '1 dan', '2 dan', 
      '3 dan', '4 dan', '5 dan', '6 dan', '7 dan', '8 dan', '9 dan', '10 dan'
    ];
  }

  protected processRule(results: SearchResult[], nlpResult: NLPProcessResult): SearchResult[] {
    const { entities } = nlpResult;
    
    return results.map(result => {
      if (result.type === 'technique' && result.data?.rank && entities.rank) {
        const techniqueRank = result.data.rank;
        const userRank = entities.rank;
        
        if (this.isHigherRank(techniqueRank, userRank)) {
          const prerequisites = this.getPrerequisites(result);
          if (prerequisites) {
            result.suggestion = `Esta es una técnica avanzada. Te recomiendo dominar primero ${prerequisites} antes de profundizar en esta.`;
          }
        }
      }
      
      return result;
    });
  }

  private isHigherRank(techniqueRank: string, userRank: string): boolean {
    const techniqueIndex = this.rankHierarchy.indexOf(techniqueRank);
    const userIndex = this.rankHierarchy.indexOf(userRank);
    
    return techniqueIndex > userIndex;
  }

  private getPrerequisites(searchResult: SearchResult): string | null {
    const techniqueData = searchResult.data;
    if (!techniqueData?.rank || !techniqueData?.category) return null;

    const techniqueRank = techniqueData.rank;
    const techniqueCategory = techniqueData.category;
    const techniqueName = techniqueData.techniqueName;

    if (this.isHighRank(techniqueRank)) {
      const basicRanks = ['10 kyu', '9 kyu'];
      
      for (const basicRank of basicRanks) {
        const rankTechniques = this.knowledgeBase.techniquesByRank[basicRank as BeltRank];
        if (rankTechniques && (techniqueCategory === 'teWaza' || techniqueCategory === 'fuseguiWaza' || techniqueCategory === 'ashiWaza')) {
          const basicTechniques = rankTechniques[techniqueCategory as 'teWaza' | 'fuseguiWaza' | 'ashiWaza'];
          if (basicTechniques.length > 0) {
            return this.selectMostRelevantBasicTechnique(
              basicTechniques, 
              techniqueName, 
              techniqueCategory
            );
          }
        }
      }

      const fundamentalTechniques = this.getFundamentalTechniques();
      if (fundamentalTechniques.length > 0) {
        return fundamentalTechniques.join(' y ');
      }
    }

    return null;
  }

  private isHighRank(rank: string): boolean {
    const highRanks = ['5 kyu', '4 kyu', '3 kyu', '2 kyu', '1 kyu', '1 dan', '2 dan', '3 dan', '4 dan', '5 dan'];
    return highRanks.includes(rank);
  }

  private selectMostRelevantBasicTechnique(
    basicTechniques: string[], 
    advancedTechnique: string, 
    category: string
  ): string {
    const prerequisites: Record<string, Record<string, string>> = {
      teWaza: {
        'Sanbon Zuki': 'Oi Zuki',
        'Ren Zuki': 'Gyaku Zuki',
        'Age Zuki': 'Oi Zuki',
        'Yoko Zuki': 'Gyaku Zuki',
        'Kumade Uchi': 'Shuto Uchi',
        'Ippon Ken': 'Oi Zuki',
        'Hiraken': 'Gyaku Zuki',
        'Nukite': 'Oi Zuki',
        'Haito Uchi': 'Shuto Uchi',
        'Otoshi Zuki': 'Oi Zuki'
      },
      ashiWaza: {
        'Kakato Geri': 'Mae Geri',
        'Nidan Geri': 'Mae Geri',
        'Tobi Geri': 'Mae Geri',
        'Ura Mawashi Geri': 'Mae Geri',
        'Mikazuki Geri': 'Mae Geri',
        'Fumikomi': 'Mae Geri',
        'Hiza Geri': 'Mae Geri',
        'Kake Geri': 'Mae Geri'
      },
      fuseguiWaza: {
        'Manji Uke': 'Gedan Barai',
        'Mawashi Uke': 'Jodan Uke',
        'Juji Uke': 'Gedan Barai',
        'Kakato Uke': 'Gedan Barai',
        'Nagashi Uke': 'Soto Uke',
        'Haito Uke': 'Shuto Uke',
        'Teisho Uke': 'Gedan Barai',
        'Empi Uke': 'Jodan Uke'
      }
    };

    const categoryPrereqs = prerequisites[category];
    if (categoryPrereqs && categoryPrereqs[advancedTechnique]) {
      const specificPrereq = categoryPrereqs[advancedTechnique];
      if (basicTechniques.includes(specificPrereq)) {
        return specificPrereq;
      }
    }

    return basicTechniques[0];
  }

  private getFundamentalTechniques(): string[] {
    return ['Oi Zuki', 'Gyaku Zuki', 'Mae Geri', 'Gedan Barai'];
  }
}

/**
 * Regla para aplicar boost por rango de cinturón
 */
export class RankBoostRule extends BaseInferenceRule {
  private knowledgeBase: any;
  private categoryBoost: number;

  constructor(knowledgeBase: any, categoryBoost: number) {
    super();
    this.knowledgeBase = knowledgeBase;
    this.categoryBoost = categoryBoost;
  }

  protected processRule(results: SearchResult[], nlpResult: NLPProcessResult): SearchResult[] {
    const { entities } = nlpResult;
    
    if (!entities.rank) return results;

    const rankTechniques = this.knowledgeBase.techniquesByRank[entities.rank];
    if (!rankTechniques) return results;

    const allTechniques = [
      ...rankTechniques.teWaza,
      ...rankTechniques.fuseguiWaza,
      ...rankTechniques.ashiWaza
    ];

    return results.map(result => {
      if (result.type === 'technique' && result.data?.techniqueName) {
        if (allTechniques.includes(result.data.techniqueName)) {
          result.score += this.categoryBoost * 2;
        }
      }
      return result;
    });
  }
}

/**
 * Factory para crear cadenas de reglas de inferencia
 */
export class InferenceRuleFactory {
  static createDefaultChain(knowledgeBase: any): InferenceRule {
    const thresholdRule = new ScoreThresholdRule(0.3);
    const rankBoostRule = new RankBoostRule(knowledgeBase, 0.3);
    const prerequisiteRule = new PrerequisiteRule(knowledgeBase);

    // Configurar cadena de responsabilidad
    rankBoostRule.setNext(prerequisiteRule);
    thresholdRule.setNext(rankBoostRule);

    return thresholdRule;
  }

  static createCustomChain(knowledgeBase: any, rules: InferenceRule[]): InferenceRule {
    if (rules.length === 0) return new ScoreThresholdRule();

    for (let i = 0; i < rules.length - 1; i++) {
      rules[i].setNext(rules[i + 1]);
    }

    return rules[0];
  }
}
