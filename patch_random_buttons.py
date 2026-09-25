import re

def add_randomizer(filepath):
    with open(filepath, "r") as f:
        content = f.read()
    
    # 1. Add boolean to the class
    class_name = re.search(r'export class (\w+)', content).group(1)
    
    # Add swapButtons property to class
    if "swapButtons = false;" not in content:
        content = content.replace(f"export class {class_name} {{", f"export class {class_name} {{\n  swapButtons = false;\n  ngOnInit() {{ this.swapButtons = Math.random() > 0.5; }}\n")
        # Also need to implement OnInit
        if "implements OnInit" not in content:
            content = content.replace(f"export class {class_name} {{", f"export class {class_name} implements OnInit {{")
            # And add import
            content = content.replace("import { Component }", "import { Component, OnInit }")
            content = content.replace("import { Component,", "import { Component, OnInit,")
            
    # 2. Add style flex-col-reverse based on swapButtons
    # Find the div holding the buttons (it's the one under the "Veredito" h3)
    # The div has "flex flex-col gap-4 justify-center"
    # we will wrap just the buttons in a new div with flex-col-reverse conditionally.
    
    # Actually, simpler: dynamically apply flex-col-reverse to the button container.
    # Wait, the h3 and p are in a text-center mb-4 div which should stay on top.
    # So I'll wrap the two buttons in `<div class="flex flex-col gap-4" [ngClass]="{'flex-col-reverse': swapButtons}">`
    
    # We can do this with string replace.
    if '<div class="flex flex-col gap-4"' not in content:
        content = content.replace('</button>\n\n        <button', '</button>\n        <button')
        content = re.sub(r'(<div class="text-center mb-4">.*?</div>\n)', r'\1\n        <div class="flex flex-col gap-4" [ngClass]="{\'flex-col-reverse\': swapButtons}">\n', content, flags=re.DOTALL)
        content = content.replace('</button>\n      </div>\n\n    </div>', '</button>\n        </div>\n      </div>\n\n    </div>')
    
    with open(filepath, "w") as f:
        f.write(content)

add_randomizer("frontend/src/app/features/games/creators-vs-copiers/activities/plagiarism-court/plagiarism-court.component.ts")
add_randomizer("frontend/src/app/features/games/creators-vs-copiers/activities/audit/audit.component.ts")
