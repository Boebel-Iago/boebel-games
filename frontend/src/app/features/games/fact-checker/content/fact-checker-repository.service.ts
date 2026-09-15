import { Injectable } from '@angular/core';
import { NewsPartTask, FactCheckTask } from './fact-checker.model';

@Injectable()
export class FactCheckerRepository {
  
  private newsTasks: NewsPartTask[] = [
    { id: 'url', instruction: 'Fase 1: Encontre e toque no ENDEREÇO DO SITE (URL). É a primeira coisa a olhar para ver se o site é conhecido.', feedback: 'Isso! Sites que terminam com nomes estranhos ou erros de português na URL costumam ser falsos.' },
    { id: 'headline', instruction: 'Fase 2: Toque na MANCHETE (Título Grande).', feedback: 'Muito bem! Manchetes muito exageradas, com MUITAS LETRAS MAIÚSCULAS e pontos de exclamação (!!!) servem para nos assustar e clicar rápido sem pensar.' },
    { id: 'date', instruction: 'Fase 3: Essa notícia é de hoje ou do ano passado? Toque na DATA DE PUBLICAÇÃO.', feedback: 'Excelente! Muitas vezes as pessoas compartilham notícias verdadeiras, mas que aconteceram há 5 anos atrás, fora de contexto.' },
    { id: 'author', instruction: 'Fase 4: Quem escreveu isso? Toque no NOME DO AUTOR (Jornalista).', feedback: 'Perfeito! Notícias confiáveis sempre mostram quem é o jornalista responsável. Se não tem autor, desconfie!' },
    { id: 'image', instruction: 'Fase 5: Toque na FOTOGRAFIA da notícia.', feedback: 'Ótimo! Às vezes a foto é verdadeira, mas foi tirada em outro país e usada para inventar uma mentira aqui.' },
    { id: 'url', instruction: 'Fase 6: Onde vemos se o site tem um cadeado de segurança e o nome oficial?', feedback: 'Exato! A barra de endereço é a identidade do site.' },
    { id: 'author', instruction: 'Fase 7: Encontre a assinatura de quem se responsabiliza pelo texto.', feedback: 'Boa! Assinaturas dão credibilidade à informação.' },
    { id: 'date', instruction: 'Fase 8: Onde você clica para ver se essa informação não está desatualizada?', feedback: 'Isso aí! Ficar de olho na data evita confusão.' },
    { id: 'headline', instruction: 'Fase 9: Qual parte foi feita com letras gigantes só para chamar sua atenção?', feedback: 'Muito bem. O título é feito para chamar atenção, mas não conta a história toda.' },
    { id: 'body', instruction: 'Fase 10: Toque no CORPO DO TEXTO (a notícia inteira).', feedback: 'Perfeito! Nunca leia só o título. Para saber a verdade, precisamos ler o texto até o final.' }
  ];

  private factCheckTasks: FactCheckTask[] = [
    {
      suspiciousNews: 'Tubarão gigante de 15 metros foi visto na praia ontem à tarde. Proibido entrar na água!',
      sourceType: 'Mensagem encaminhada no grupo da família',
      reliableSearch: 'Instituto do Meio Ambiente e biólogos confirmam que era apenas um golfinho saltando perto da costa. Nenhuma proibição foi feita.',
      isFact: false,
      feedback: 'FAKE! Mensagens alarmistas no WhatsApp sem links oficiais costumam ser falsas para gerar pânico.'
    },
    {
      suspiciousNews: 'Prefeitura vai distribuir sorvete grátis de chocolate para todos os alunos nas escolas amanhã.',
      sourceType: 'Postagem sem autor no Facebook',
      reliableSearch: 'Nenhum site oficial da prefeitura ou da secretaria de educação publicou esta informação.',
      isFact: false,
      feedback: 'FAKE! Sempre desconfie de promoções e coisas grátis fáceis demais. Verifique nos sites oficiais.'
    },
    {
      suspiciousNews: 'Santa Catarina tem aumento no número de pinguins que aparecem nas praias durante o inverno.',
      sourceType: 'Site de Notícias Conhecido',
      reliableSearch: 'Projeto de Monitoramento de Praias registrou 30% a mais de pinguins resgatados nas praias de SC este ano.',
      isFact: true,
      feedback: 'FATO! Animais marinhos realmente seguem correntes de água fria no inverno. A informação foi confirmada por biólogos.'
    },
    {
      suspiciousNews: 'O WhatsApp vai ser pago a partir de amanhã! Repasse essa mensagem para 10 pessoas para o seu ficar azul e continuar grátis.',
      sourceType: 'Mensagem encaminhada muitas vezes',
      reliableSearch: 'A empresa dona do aplicativo confirmou que o serviço continua gratuito. Mensagens de repasse são sempre falsas.',
      isFact: false,
      feedback: 'FAKE! Um clássico das notícias falsas. Nenhuma empresa avisa mudanças sérias pedindo para repassar mensagens.'
    },
    {
      suspiciousNews: 'Receber mensagens de números desconhecidos oferecendo empregos onde você ganha muito dinheiro rápido é golpe.',
      sourceType: 'Site de Segurança Digital',
      reliableSearch: 'A Polícia Civil alerta para o aumento de fraudes na internet usando falsas promessas de dinheiro fácil.',
      isFact: true,
      feedback: 'FATO! Dinheiro fácil não existe. Isso é uma armadilha de criminosos na internet.'
    },
    {
      suspiciousNews: 'Beber água gelada com limão mata todos os vírus e cura qualquer gripe em menos de 1 hora!',
      sourceType: 'Vídeo amador no YouTube',
      reliableSearch: 'Médicos e o Ministério da Saúde afirmam que limão tem vitamina C e ajuda na imunidade, mas não cura gripe sozinho, muito menos em 1 hora.',
      isFact: false,
      feedback: 'FAKE! Dicas milagrosas de saúde são perigosas. Confie sempre em médicos e na ciência.'
    },
    {
      suspiciousNews: 'A Terra tem formato arredondado, parecido com uma esfera achatada nos polos.',
      sourceType: 'Livro Escolar e Site da NASA',
      reliableSearch: 'Todas as imagens de satélites e estudos científicos de astrônomos do mundo inteiro confirmam o formato do planeta.',
      isFact: true,
      feedback: 'FATO! A ciência e as fotos espaciais comprovam isso há muitas décadas.'
    },
    {
      suspiciousNews: 'Novo parque de diversões gigante com 50 montanhas-russas será construído na nossa cidade na semana que vem.',
      sourceType: 'Blog "Notícias Chocantes"',
      reliableSearch: 'O blog foi criado ontem. Não há registros na prefeitura de nenhuma obra desse tamanho aprovada para a cidade.',
      isFact: false,
      feedback: 'FAKE! Uma obra gigantesca dessas leva anos de planejamento e estaria em todos os jornais confiáveis, não apenas num blog obscuro.'
    },
    {
      suspiciousNews: 'Jogar videogame por muitas horas sem piscar pode causar ressecamento nos olhos dos alunos.',
      sourceType: 'Revista de Saúde Ocular',
      reliableSearch: 'Oftalmologistas recomendam fazer pausas a cada 20 minutos de tela para piscar e evitar o cansaço visual.',
      isFact: true,
      feedback: 'FATO! É importante cuidar da saúde dos olhos quando usamos as tecnologias.'
    },
    {
      suspiciousNews: 'Se você colocar o celular no micro-ondas por 5 segundos, a bateria carrega 100% imediatamente.',
      sourceType: 'Desafio do TikTok',
      reliableSearch: 'Fabricantes alertam: celulares contêm metal e baterias que EXPLODEM se colocados no micro-ondas. Risco de incêndio grave.',
      isFact: false,
      feedback: 'FAKE EXTREMAMENTE PERIGOSO! Desafios de internet podem ser mortais. O celular só carrega na tomada com o carregador correto.'
    }
  ];

  getNewsTask(index: number): NewsPartTask | null {
    return this.newsTasks[index] || null;
  }

  getFactCheckTask(index: number): FactCheckTask | null {
    return this.factCheckTasks[index] || null;
  }

  getTotalNewsTasks(): number {
    return this.newsTasks.length;
  }

  getTotalPhases(): number {
    return this.newsTasks.length + this.factCheckTasks.length;
  }
}
