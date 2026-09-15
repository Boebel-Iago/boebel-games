export interface Tool {
  name: string;
  icon: string;
}

export interface Profession {
  name: string;
  icon: string;
  correctTool: Tool;
  wrongTools: Tool[];
  feedback: string;
  hardwareDesc: string; // Descrição do Físico
  softwareDesc: string; // Descrição do Lógico
}

export interface Scenario {
  description: string;
  icon: string;
  type: 'TRABALHO' | 'LAZER';
  feedback: string;
  hardwareDesc: string;
  softwareDesc: string;
}
