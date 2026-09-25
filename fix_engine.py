import re

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "r") as f:
    engine = f.read()

# Vote Plagiarism
vote_plag_new = """    } else {
      const fb = voteForCorrectUse 
        ? 'Atenção, Juiz! Você deixou um plágio passar despercebido. Leia a atitude do aluno novamente.' 
        : 'Opa! Você penalizou um aluno que fez tudo certo. Lembre-se: se há créditos ou uso apropriado, está correto!';
      this.handleWrongAnswer(fb);
    }
  }"""
engine = re.sub(r"votePlagiarism.*?\} else \{\s*this\.handleWrongAnswer\('Cuidado! Leia o símbolo novamente[^}]+\}\n  \}", 
                lambda m: m.group(0).split("} else {")[0] + vote_plag_new, 
                engine, flags=re.DOTALL)

# Drag Drop
drag_drop_new = """    } else {
      this.handleWrongAnswer('Existem itens nas colunas erradas! Revise cada um deles com atenção.');
    }
  }"""
engine = re.sub(r"checkDragDropAnswers.*?\} else \{\s*this\.handleWrongAnswer\('Existem itens nas[^}]+\}\n  \}", 
                lambda m: m.group(0).split("} else {")[0] + drag_drop_new, 
                engine, flags=re.DOTALL)


# Audit
audit_new = """    } else {
      const fb = voteForApproved 
        ? 'Auditoria Falhou! Você aprovou algo que pode render um processo para a escola!' 
        : 'Calma, Auditor! Você reprovou um recurso que estava sendo usado de forma perfeitamente legal.';
      this.handleWrongAnswer(fb);
    }
  }"""
engine = re.sub(r"voteAudit.*?\} else \{\s*this\.handleWrongAnswer\('Cuidado! Leia o símbolo novamente[^}]+\}\n  \}", 
                lambda m: m.group(0).split("} else {")[0] + audit_new, 
                engine, flags=re.DOTALL)

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "w") as f:
    f.write(engine)
