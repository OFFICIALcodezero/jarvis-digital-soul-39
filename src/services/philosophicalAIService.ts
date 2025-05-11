
export interface PhilosophicalQuestion {
  id: string;
  text: string;
  timestamp: number;
}

export interface PhilosophicalResponse {
  id: string;
  questionId: string;
  content: string;
  philosophies: string[];
  alternatives: string[];
  timestamp: number;
}

export interface PhilosophicalAnalysis {
  id: string;
  situation: string;
  analysis: string;
  perspectives: { 
    philosophy: string;
    guidance: string;
  }[];
  timestamp: number;
}

class PhilosophicalAIService {
  private questions: PhilosophicalQuestion[] = [];
  private responses: PhilosophicalResponse[] = [];
  private analyses: PhilosophicalAnalysis[] = [];

  constructor() {
    console.info('Philosophical AI Service initialized');
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedQuestions = localStorage.getItem('philosophical-questions');
      const savedResponses = localStorage.getItem('philosophical-responses');
      const savedAnalyses = localStorage.getItem('philosophical-analyses');

      if (savedQuestions) {
        this.questions = JSON.parse(savedQuestions);
      }
      if (savedResponses) {
        this.responses = JSON.parse(savedResponses);
      }
      if (savedAnalyses) {
        this.analyses = JSON.parse(savedAnalyses);
      }
    } catch (error) {
      console.error('Error loading philosophical data from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('philosophical-questions', JSON.stringify(this.questions));
      localStorage.setItem('philosophical-responses', JSON.stringify(this.responses));
      localStorage.setItem('philosophical-analyses', JSON.stringify(this.analyses));
    } catch (error) {
      console.error('Error saving philosophical data to localStorage:', error);
    }
  }

  public async analyzeQuestion(question: string): Promise<PhilosophicalResponse> {
    // Create a question object
    const questionObj: PhilosophicalQuestion = {
      id: `question-${Date.now()}`,
      text: question,
      timestamp: Date.now()
    };
    
    this.questions.push(questionObj);
    
    // Generate philosophical analysis
    // In a real app, this would call an AI service
    const philosophies = this.getRelevantPhilosophies(question);
    const content = this.generatePhilosophicalResponse(question, philosophies);
    const alternatives = this.generateAlternativePerspectives(question, philosophies);
    
    const response: PhilosophicalResponse = {
      id: `response-${Date.now()}`,
      questionId: questionObj.id,
      content,
      philosophies,
      alternatives,
      timestamp: Date.now()
    };
    
    this.responses.push(response);
    this.saveToLocalStorage();
    
    return response;
  }
  
  public async getLifeGuidance(situation: string): Promise<PhilosophicalAnalysis> {
    // Generate philosophical life guidance
    // In a real app, this would call an AI service
    
    const philosophies = this.getRelevantPhilosophies(situation);
    const perspectives = philosophies.map(philosophy => ({
      philosophy,
      guidance: this.generateGuidance(situation, philosophy)
    }));
    
    const analysis: PhilosophicalAnalysis = {
      id: `analysis-${Date.now()}`,
      situation,
      analysis: this.generateOverallAnalysis(situation),
      perspectives,
      timestamp: Date.now()
    };
    
    this.analyses.push(analysis);
    this.saveToLocalStorage();
    
    return analysis;
  }
  
  public getHistory() {
    return {
      questions: this.questions,
      responses: this.responses
    };
  }
  
  public clearHistory() {
    this.questions = [];
    this.responses = [];
    this.analyses = [];
    this.saveToLocalStorage();
  }
  
  private getRelevantPhilosophies(text: string): string[] {
    // In a real app, this would use NLP to match the question with relevant philosophies
    const allPhilosophies = [
      'Existentialism', 'Stoicism', 'Utilitarianism', 'Nihilism', 
      'Rationalism', 'Empiricism', 'Humanism', 'Buddhism', 'Taoism',
      'Pragmatism', 'Absurdism', 'Ethics', 'Metaphysics'
    ];
    
    // Get 1-3 random philosophies
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...allPhilosophies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  private generatePhilosophicalResponse(question: string, philosophies: string[]): string {
    // In a real app, this would generate a response based on the question and philosophies
    const responses = [
      "From a philosophical perspective, this question addresses the fundamental nature of human existence. Consider that our perception of reality is shaped by our experiences and cultural context.",
      "This inquiry touches on profound questions of meaning and purpose. Various philosophical traditions have approached this differently, but they all recognize the inherent complexity of the human condition.",
      "Philosophers throughout history have wrestled with this question. The answer lies not in absolute truths but in understanding the frameworks through which we interpret our experiences.",
      "When examining this question, we must consider the interplay between individual agency and societal structures. Our choices are both constrained and enabled by factors beyond our immediate control.",
      "This is a question that bridges ethics and metaphysics. To answer it requires examining both what is and what ought to be, recognizing the tension between descriptive and normative claims."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  private generateAlternativePerspectives(question: string, mainPhilosophies: string[]): string[] {
    // Generate 2-3 alternative perspectives
    const perspectives = [
      "An alternate view might suggest that this question itself contains assumptions worth examining.",
      "Some would argue that this approach oversimplifies the complexity of human experience.",
      "Another perspective would focus more on the practical implications rather than theoretical constructs.",
      "A contrasting viewpoint would emphasize the role of cultural and historical context in shaping our understanding.",
      "Some traditions would reject the premises of this question entirely, suggesting a different framework for understanding."
    ];
    
    // Get 2-3 random perspectives
    const count = Math.floor(Math.random() * 2) + 2;
    const shuffled = [...perspectives].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  private generateOverallAnalysis(situation: string): string {
    const analyses = [
      "This situation presents a classic tension between individual desires and ethical responsibilities. The path forward requires balancing multiple valid considerations.",
      "Your situation reflects the fundamental human struggle between freedom and determinism. Various philosophical approaches can offer different frameworks for navigating this challenge.",
      "This dilemma highlights the intersection of personal values and external expectations. Finding resolution involves clarifying your own principles while acknowledging social context.",
      "The complexity of your situation mirrors larger philosophical questions about meaning and purpose. By examining the assumptions underlying your choices, you may find clarity.",
      "This challenge represents a common theme in philosophical inquiry: how we reconcile competing goods when no perfect solution exists. The answer lies not in finding the 'right' choice but in understanding the values that inform your decision."
    ];
    
    return analyses[Math.floor(Math.random() * analyses.length)];
  }
  
  private generateGuidance(situation: string, philosophy: string): string {
    const guidanceByPhilosophy: {[key: string]: string[]} = {
      'Existentialism': [
        "Embrace the freedom to define your own meaning in this situation. Your choices create who you are.",
        "Recognize that anxiety about this decision reflects the weight of authentic choice and responsibility."
      ],
      'Stoicism': [
        "Focus on what you can control and accept what you cannot. Find peace in this distinction.",
        "Consider how virtue and character might guide your response, rather than focusing on outcomes."
      ],
      'Utilitarianism': [
        "Evaluate options based on which produces the greatest happiness or well-being for all affected.",
        "Consider both immediate and long-term consequences of each possible choice."
      ],
      'Buddhism': [
        "Examine how attachment to specific outcomes creates suffering in this situation.",
        "Practice mindful awareness of your responses without immediate judgment."
      ],
      'Pragmatism': [
        "Consider what practical difference each choice would make in your life and the lives of others.",
        "Test solutions provisionally, remaining open to revising your approach based on results."
      ]
    };
    
    // Default guidance if specific philosophy not found
    const defaultGuidance = [
      "Reflect on how this situation aligns with your deeper values and principles.",
      "Consider multiple perspectives before determining your path forward.",
      "Examine both emotional and rational aspects of your response to this challenge."
    ];
    
    const options = guidanceByPhilosophy[philosophy] || defaultGuidance;
    return options[Math.floor(Math.random() * options.length)];
  }
}

export const philosophicalAIService = new PhilosophicalAIService();
