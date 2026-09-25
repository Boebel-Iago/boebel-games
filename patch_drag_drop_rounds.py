import re

with open("frontend/src/app/features/games/creators-vs-copiers/content/creators-content.service.ts", "r") as f:
    content = f.read()

new_rounds = """    // Fase 3
    [
      { id: 'i11', description: 'Apagar a marca d\\'água de uma foto para usar de graça', category: 'PLAGIO' },
      { id: 'i12', description: 'Mudar duas palavras de um texto da web e assinar seu nome', category: 'PLAGIO' },
      { id: 'i13', description: 'Baixar um modelo 3D do governo marcado como CC0', category: 'LIVRE' },
      { id: 'i14', description: 'Apresentar dados do IBGE, colocando a fonte no rodapé', category: 'CREDITOS' },
      { id: 'i15', description: 'Entregar texto feito 100% pelo ChatGPT como autoria própria', category: 'PLAGIO' }
    ],
    // Fase 4
    [
      { id: 'i16', description: 'Gravar um vídeo da chuva na rua da sua casa', category: 'LIVRE' },
      { id: 'i17', description: 'Usar uma música folclórica antiga sem dono registrado', category: 'LIVRE' },
      { id: 'i18', description: 'Pegar trecho de um podcast, editando e citando o nome do host', category: 'CREDITOS' },
      { id: 'i19', description: 'Tirar a assinatura do artista de uma arte do Instagram', category: 'PLAGIO' },
      { id: 'i20', description: 'Traduzir um artigo inteiro e postar como seu', category: 'PLAGIO' }
    ],
    // Fase 5
    [
      { id: 'i21', description: 'Fazer um desenho totalmente original com suas próprias mãos', category: 'LIVRE' },
      { id: 'i22', description: 'Usar dados de uma universidade aberta colocando o link', category: 'CREDITOS' },
      { id: 'i23', description: 'Baixar um trabalho escolar pronto e trocar o nome da capa', category: 'PLAGIO' },
      { id: 'i24', description: 'Copiar o trabalho que o irmão fez anos atrás', category: 'PLAGIO' },
      { id: 'i25', description: 'Usar imagens de IA deixando claro que foram geradas por IA', category: 'CREDITOS' }
    ]"""

content = re.sub(r"    // Fase 3\n.*?\]", new_rounds, content, flags=re.DOTALL)

with open("frontend/src/app/features/games/creators-vs-copiers/content/creators-content.service.ts", "w") as f:
    f.write(content)
