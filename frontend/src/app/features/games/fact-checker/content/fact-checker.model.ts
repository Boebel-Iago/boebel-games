export interface NewsPartTask {
  id: string; // 'url', 'headline', 'author', 'date', 'image', 'body'
  instruction: string;
  feedback: string;
}

export interface FactCheckTask {
  suspiciousNews: string;
  sourceType: string; // Ex: 'Mensagem de WhatsApp', 'Site Desconhecido'
  reliableSearch: string; // O que o buscador mostrou após investigar
  isFact: boolean;
  feedback: string;
}
