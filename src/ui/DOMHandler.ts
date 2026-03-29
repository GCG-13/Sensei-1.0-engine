import type { 
  DOMHandlerConfig, 
  ChatMessageEvent, 
  SystemState 
} from '@/types';

/**
 * Gestor de Interfaz de Usuario del Chat
 * Maneja la presentación y animaciones del DOM
 */
export class DOMHandler {
  private config: DOMHandlerConfig;
  private elements!: {
    messagesContainer: HTMLElement;
    userInput: HTMLInputElement;
    sendButton: HTMLButtonElement;
  };
  private state: SystemState;
  private typingIndicator: HTMLElement | null = null;

  constructor(config: DOMHandlerConfig) {
    this.config = config;
    this.state = {
      isProcessing: false,
      messageCount: 0,
      lastActivity: new Date()
    };
    
    this.initializeElements();
    this.bindEvents();
  }

  /**
   * Inicializa los elementos del DOM
   */
  private initializeElements(): void {
    this.elements = {
      messagesContainer: document.getElementById(this.config.messagesContainerId)!,
      userInput: document.getElementById(this.config.userInputId)! as HTMLInputElement,
      sendButton: document.getElementById(this.config.sendButtonId)! as HTMLButtonElement
    };

    if (!this.elements.messagesContainer || !this.elements.userInput || !this.elements.sendButton) {
      throw new Error('No se encontraron todos los elementos requeridos del DOM');
    }
  }

  /**
   * Vincula los eventos del DOM
   */
  private bindEvents(): void {
    this.elements.sendButton.addEventListener('click', () => this.handleSendClick());
    this.elements.userInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
    this.elements.userInput.addEventListener('input', () => this.handleInputChange());
  }

  /**
   * Maneja el clic en el botón de envío
   */
  private handleSendClick(): void {
    if (!this.state.isProcessing) {
      this.dispatchUserMessage();
    }
  }

  /**
   * Maneja la pulsación de teclas
   */
  private handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.state.isProcessing) {
      this.dispatchUserMessage();
    }
  }

  /**
   * Maneja cambios en el input
   */
  private handleInputChange(): void {
    const hasContent = this.elements.userInput.value.trim().length > 0;
    this.elements.sendButton.disabled = !hasContent || this.state.isProcessing;
  }

  /**
   * Despacha un evento de mensaje de usuario
   */
  private dispatchUserMessage(): void {
    const content = this.elements.userInput.value.trim();
    if (content.length === 0) return;

    const event: ChatMessageEvent = {
      type: 'user',
      content,
      timestamp: new Date()
    };

    // Limpiar input
    this.elements.userInput.value = '';
    this.handleInputChange();

    // Despachar evento personalizado
    window.dispatchEvent(new CustomEvent('chatMessage', { detail: event }));
  }

  /**
   * Agrega un mensaje al chat
   */
  public appendMessage(event: ChatMessageEvent): void {
    const messageBubble = this.createMessageBubble(event);
    this.elements.messagesContainer.appendChild(messageBubble);
    this.scrollToBottom();
    
    // Actualizar estado
    this.state.messageCount++;
    this.state.lastActivity = new Date();
    
    if (event.type === 'user') {
      this.state.lastQuery = event.content;
    } else if (event.type === 'sensei') {
      this.state.lastResponse = event.metadata?.response;
    }
  }

  /**
   * Crea un elemento de mensaje
   */
  private createMessageBubble(event: ChatMessageEvent): HTMLElement {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add(this.config.cssClasses.messageBubble);
    
    // Aplicar clase según el tipo
    if (event.type === 'user') {
      messageBubble.classList.add(this.config.cssClasses.userMessage);
    } else if (event.type === 'sensei') {
      messageBubble.classList.add(this.config.cssClasses.senseiMessage);
    }

    // Configurar contenido
    messageBubble.style.whiteSpace = 'pre-wrap';
    messageBubble.textContent = event.content;
    
    // Añadir timestamp como atributo para debugging
    messageBubble.setAttribute('data-timestamp', event.timestamp.toISOString());
    
    return messageBubble;
  }

  /**
   * Muestra indicador de que el Sensei está escribiendo
   */
  public showTypingIndicator(): HTMLElement {
    this.typingIndicator = document.createElement('div');
    this.typingIndicator.className = this.config.cssClasses.typingIndicator;
    this.typingIndicator.innerHTML = `
      <div class="${this.config.cssClasses.typingDot}"></div>
      <div class="${this.config.cssClasses.typingDot}"></div>
      <div class="${this.config.cssClasses.typingDot}"></div>
    `;
    
    this.elements.messagesContainer.appendChild(this.typingIndicator);
    this.scrollToBottom();
    
    return this.typingIndicator;
  }

  /**
   * Oculta el indicador de escritura
   */
  public hideTypingIndicator(): void {
    if (this.typingIndicator && this.typingIndicator.parentNode) {
      this.typingIndicator.parentNode.removeChild(this.typingIndicator);
      this.typingIndicator = null;
    }
  }

  /**
   * Desplaza el scroll hacia abajo
   */
  public scrollToBottom(): void {
    this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
  }

  /**
   * Actualiza el estado de procesamiento
   */
  public setProcessingState(processing: boolean): void {
    this.state.isProcessing = processing;
    this.elements.userInput.disabled = processing;
    this.elements.sendButton.disabled = processing || this.elements.userInput.value.trim().length === 0;
    
    if (processing) {
      this.elements.userInput.placeholder = 'Sensei está pensando...';
      this.showTypingIndicator();
    } else {
      this.elements.userInput.placeholder = 'Escribe tu pregunta al Sensei...';
      this.hideTypingIndicator();
      this.elements.userInput.focus();
    }
  }

  /**
   * Muestra un mensaje de error
   */
  public showError(message: string): void {
    const errorEvent: ChatMessageEvent = {
      type: 'system',
      content: `❌ Error: ${message}`,
      timestamp: new Date()
    };
    
    this.appendMessage(errorEvent);
  }

  /**
   * Muestra un mensaje informativo del sistema
   */
  public showSystemMessage(message: string): void {
    const systemEvent: ChatMessageEvent = {
      type: 'system',
      content: `ℹ️ ${message}`,
      timestamp: new Date()
    };
    
    this.appendMessage(systemEvent);
  }

  /**
   * Limpia todos los mensajes del chat
   */
  public clearMessages(): void {
    this.elements.messagesContainer.innerHTML = '';
    this.state.messageCount = 0;
    this.state.lastQuery = undefined;
    this.state.lastResponse = undefined;
  }

  /**
   * Obtiene el estado actual
   */
  public getState(): SystemState {
    return { ...this.state };
  }

  /**
   * Enfoca el input de usuario
   */
  public focusInput(): void {
    this.elements.userInput.focus();
  }

  /**
   * Establece el valor del input
   */
  public setInputValue(value: string): void {
    this.elements.userInput.value = value;
    this.handleInputChange();
  }

  /**
   * Obtiene el valor actual del input
   */
  public getInputValue(): string {
    return this.elements.userInput.value;
  }

  /**
   * Añade sugerencias al input
   */
  public showSuggestions(suggestions: string[]): void {
    if (suggestions.length === 0) return;

    // Crear datalist para sugerencias
    let datalist = document.getElementById('sensei-suggestions') as HTMLDataListElement;
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = 'sensei-suggestions';
      this.elements.userInput.parentNode?.insertBefore(datalist, this.elements.userInput.nextSibling);
      this.elements.userInput.setAttribute('list', 'sensei-suggestions');
    }

    // Limpiar y añadir nuevas sugerencias
    datalist.innerHTML = '';
    suggestions.forEach(suggestion => {
      const option = document.createElement('option');
      option.value = suggestion;
      datalist.appendChild(option);
    });
  }

  /**
   * Destruye el manejador y limpia eventos
   */
  public destroy(): void {
    this.elements.sendButton.removeEventListener('click', () => this.handleSendClick());
    this.elements.userInput.removeEventListener('keypress', (e) => this.handleKeyPress(e));
    this.elements.userInput.removeEventListener('input', () => this.handleInputChange());
    this.hideTypingIndicator();
  }
}
