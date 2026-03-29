import type { ChatMessageEvent, DOMHandlerConfig } from '@/types';
import { NLPProcessor } from '@/core/NLPProcessor';
import { IntentManager } from '@/core/IntentManager';
import { InferenceEngine } from '@/core/InferenceEngine';
import { DOMHandler } from '@/ui/DOMHandler';
import knowledgeBase from '@/data/knowledge_base.json';

/**
 * Sistema Principal Sensei AI
 * Orquesta todos los componentes del sistema experto
 */
class SenseiSystem {
  private domHandler!: DOMHandler;
  private intentManager!: IntentManager;
  private inferenceEngine!: InferenceEngine;
  private isInitialized = false;

  constructor() {
    this.initializeSystem();
  }

  /**
   * Inicializa el sistema completo
   */
  private async initializeSystem(): Promise<void> {
    try {
      // Validar que la base de conocimiento se cargó correctamente
      if (!this.validateKnowledgeBase()) {
        throw new Error('La base de conocimiento no es válida');
      }

      // Inicializar componentes
      this.intentManager = new IntentManager(knowledgeBase);
      this.inferenceEngine = new InferenceEngine(knowledgeBase);
      
      // Configurar manejador de DOM
      const domConfig: DOMHandlerConfig = {
        messagesContainerId: 'messages',
        userInputId: 'userInput',
        sendButtonId: 'sendBtn',
        cssClasses: {
          messageBubble: 'message-bubble',
          userMessage: 'user-message',
          senseiMessage: 'sensei-message',
          typingIndicator: 'typing-indicator',
          typingDot: 'typing-dot'
        }
      };
      
      this.domHandler = new DOMHandler(domConfig);
      
      // Vincular eventos del sistema
      this.bindSystemEvents();
      
      // Mostrar mensaje de bienvenida
      this.showWelcomeMessage();
      
      this.isInitialized = true;
      console.log('✅ Sistema Sensei AI inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error al inicializar el sistema:', error);
      this.showInitializationError(error);
    }
  }

  /**
   * Valida la estructura de la base de conocimiento
   */
  private validateKnowledgeBase(): boolean {
    const requiredSections = ['general', 'faq', 'bodyParts', 'vocabulary', 'history'];
    
    for (const section of requiredSections) {
      if (!(section in knowledgeBase)) {
        console.error(`❌ Falta la sección requerida: ${section}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Vincula eventos del sistema
   */
  private bindSystemEvents(): void {
    // Escuchar mensajes del chat
    window.addEventListener('chatMessage', (event: Event) => {
      const customEvent = event as CustomEvent<ChatMessageEvent>;
      this.handleUserMessage(customEvent.detail);
    });

    // Manejar cambios de visibilidad de la página
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.domHandler.focusInput();
      }
    });

    // Manejar errores no capturados
    window.addEventListener('error', (event) => {
      console.error('Error no capturado:', event.error);
      this.domHandler.showError('Ocurrió un error inesperado. Por favor, recarga la página.');
    });
  }

  /**
   * Muestra mensaje de bienvenida
   */
  private showWelcomeMessage(): void {
    const welcomeEvent: ChatMessageEvent = {
      type: 'sensei',
      content: knowledgeBase.general.greeting,
      timestamp: new Date(),
      metadata: { response: null }
    };
    
    this.domHandler.appendMessage(welcomeEvent);
  }

  /**
   * Muestra error de inicialización
   */
  private showInitializationError(error: any): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
      <h3 class="font-bold">Error de inicialización</h3>
      <p>No se pudo cargar el sistema Sensei AI.</p>
      <p class="text-sm mt-2">Error: ${error.message}</p>
      <button onclick="location.reload()" class="mt-2 bg-white text-red-500 px-3 py-1 rounded text-sm">
        Recargar página
      </button>
    `;
    document.body.appendChild(errorDiv);
  }

  /**
   * Maneja mensaje del usuario
   */
  private async handleUserMessage(messageEvent: ChatMessageEvent): Promise<void> {
    if (!this.isInitialized) {
      this.domHandler.showError('El sistema aún no está listo. Por favor, espera un momento.');
      return;
    }

    try {
      // Mostrar mensaje del usuario
      this.domHandler.appendMessage(messageEvent);
      
      // Establecer estado de procesamiento
      this.domHandler.setProcessingState(true);
      
      // Simular tiempo de pensamiento para mejor UX
      await this.simulateThinkingTime();
      
      // Procesar la consulta
      const response = await this.intentManager.processQuery(messageEvent.content);
      
      // Mostrar respuesta del Sensei
      const senseiEvent: ChatMessageEvent = {
        type: 'sensei',
        content: response.content,
        timestamp: new Date(),
        metadata: { response }
      };
      
      this.domHandler.appendMessage(senseiEvent);
      
      // Mostrar sugerencias si aplica
      if (response.metadata.intent !== 'greeting' && response.metadata.intent !== 'farewell') {
        const suggestions = this.intentManager.getSuggestions(response.metadata.intent);
        this.domHandler.showSuggestions(suggestions);
      }
      
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      this.domHandler.showError('No pude procesar tu mensaje. Por favor, intenta de nuevo.');
    } finally {
      // Restaurar estado normal
      this.domHandler.setProcessingState(false);
    }
  }

  /**
   * Simula tiempo de pensamiento para mejor experiencia
   */
  private async simulateThinkingTime(): Promise<void> {
    const minTime = 800; // 0.8 segundos mínimo
    const maxTime = 2000; // 2 segundos máximo
    const thinkingTime = Math.random() * (maxTime - minTime) + minTime;
    
    return new Promise(resolve => setTimeout(resolve, thinkingTime));
  }

  /**
   * Obtiene estadísticas del sistema
   */
  public getSystemStats(): any {
    if (!this.isInitialized) {
      return { status: 'not_initialized' };
    }
    
    const state = this.domHandler.getState();
    const config = this.inferenceEngine.getConfig();
    
    return {
      status: 'initialized',
      state,
      inferenceConfig: config,
      knowledgeBaseSections: Object.keys(knowledgeBase).length
    };
  }

  /**
   * Reinicia el sistema
   */
  public reset(): void {
    this.domHandler.clearMessages();
    this.showWelcomeMessage();
    this.domHandler.focusInput();
  }

  /**
   * Destruye el sistema
   */
  public destroy(): void {
    this.domHandler?.destroy();
    this.isInitialized = false;
  }
}

/**
 * Inicialización del sistema cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
  // Crear instancia global del sistema para debugging
  (window as any).senseiSystem = new SenseiSystem();
  
  // Exponer utilidades para debugging
  (window as any).senseiDebug = {
    getStats: () => (window as any).senseiSystem.getSystemStats(),
    reset: () => (window as any).senseiSystem.reset(),
    nlp: NLPProcessor
  };
  
  console.log('🥋 Sensei AI System Ready');
  console.log('🔍 Usa senseiDebug.getStats() para ver estadísticas');
  console.log('🔄 Usa senseiDebug.reset() para reiniciar el chat');
});

// Exportar para uso en módulos
export { SenseiSystem };
