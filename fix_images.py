import re

with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

# Médica
content = content.replace(
    "name: 'Médica', icon: '👩‍⚕️',",
    "name: 'Médica', icon: 'assets/images/professions/medica_prof.jpg',"
)
content = content.replace(
    "correctTool: { name: 'Máquina de Ultrassom', icon: 'assets/images/professions/lousa_interativa.jpg' }",
    "correctTool: { name: 'Máquina de Ultrassom', icon: 'assets/images/professions/maquina_ultrassom.jpg' }"
)

# Produtor
content = content.replace(
    "name: 'Produtor Musical', icon: '🎹',",
    "name: 'Produtor Musical', icon: 'assets/images/professions/produtor_musical_prof.jpg',"
)
content = content.replace(
    "correctTool: { name: 'Teclado e Computador', icon: '🎧' }",
    "correctTool: { name: 'Teclado e Computador', icon: 'assets/images/professions/teclado_musical.jpg' }"
)

# Arquiteta
content = content.replace(
    "name: 'Arquiteta', icon: 'assets/images/professions/prancheta_digital.jpg',",
    "name: 'Arquiteta', icon: 'assets/images/professions/arquiteta_prof.jpg',"
)
content = content.replace(
    "correctTool: { name: 'Mesa Digitalizadora', icon: '🖊️' }",
    "correctTool: { name: 'Mesa Digitalizadora', icon: 'assets/images/professions/mesa_digitalizadora.jpg' }"
)

# Caixa de Mercado
content = content.replace(
    "name: 'Caixa de Mercado', icon: '🛒',",
    "name: 'Caixa de Mercado', icon: 'assets/images/professions/caixa_mercado_prof.jpg',"
)
content = content.replace(
    "correctTool: { name: 'Caixa Registradora', icon: '📠' }",
    "correctTool: { name: 'Caixa Registradora', icon: 'assets/images/professions/caixa_registradora.jpg' }"
)

# Professor (Tool)
content = content.replace(
    "correctTool: { name: 'Lousa Digital', icon: '📺' }",
    "correctTool: { name: 'Lousa Digital', icon: 'assets/images/professions/lousa_interativa.jpg' }"
)

# Piloto
content = content.replace(
    "name: 'Piloto de Avião', icon: '✈️',",
    "name: 'Piloto de Avião', icon: 'assets/images/professions/piloto_prof.jpg',"
)

# Mecânico
content = content.replace(
    "correctTool: { name: 'Scanner Automotivo', icon: '📟' }",
    "correctTool: { name: 'Scanner Automotivo', icon: 'assets/images/professions/scanner_automotivo.jpg' }"
)

# Agricultor
content = content.replace(
    "correctTool: { name: 'Drone de Plantação', icon: '🚁' }",
    "correctTool: { name: 'Drone de Plantação', icon: 'assets/images/professions/drone_plantacao.jpg' }"
)

with open('frontend/src/app/features/games/professions/professions.component.ts', 'w') as f:
    f.write(content)

print("Imagens injetadas com sucesso!")
