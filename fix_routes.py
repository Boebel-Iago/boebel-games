import re

with open("frontend/src/app/app.routes.ts", "r") as f:
    content = f.read()

# Replace statically imported routes with lazy loaded ones for the latest 6 games
# (Tech Investigators, Touch Literacy, Password Mystery, Hardware Care, Data Anonymity, Ethical Dilemmas, Automation Robotics, Future Fair)

for game in ['tech-investigators', 'password-mystery', 'hardware-care', 'data-anonymity', 'ethical-dilemmas', 'automation-robotics', 'future-fair']:
    comp_name = ''.join([w.capitalize() for w in game.split('-')]) + 'Component'
    
    # Remove the static import
    content = re.sub(fr"import\s+{{\s*{comp_name}\s*}}\s+from\s+'.*/{game}/{game}\.component';\n", "", content)
    
    # Replace the route
    content = content.replace(f"component: {comp_name},", f"loadComponent: () => import('./features/games/{game}/{game}.component').then(m => m.{comp_name}),")

with open("frontend/src/app/app.routes.ts", "w") as f:
    f.write(content)
