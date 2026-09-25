import re

with open('frontend/src/app/features/student-login/student-login.component.ts', 'r') as f:
    content = f.read()

new_error_block = """error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = "Código incorreto ou indisponível. Chame o professor!";
        }
      }"""

content = re.sub(r'error: \(err\) => \{.*?\n\s+\}', new_error_block, content, flags=re.DOTALL)

with open('frontend/src/app/features/student-login/student-login.component.ts', 'w') as f:
    f.write(content)
