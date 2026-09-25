with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "r") as f:
    engine = f.read()

constructor_old = """  constructor(
    private content: CreatorsContentService,
    private progressReporter: ProgressReporter
  ) {
    const isDemo = sessionStorage.getItem('isDemoMode') === 'true';
    this.contentData = this.content.getFilteredData(isDemo);
    this.missions = this.content.missions;
  }"""

constructor_new = """  constructor(
    private content: CreatorsContentService,
    private progressReporter: ProgressReporter
  ) {
    const isDemo = sessionStorage.getItem('isDemoMode') === 'true';
    this.contentData = this.content.getFilteredData(isDemo);
    
    // Shuffle the tasks so the answers don't follow a predictable true/false pattern
    this.contentData.licenseTasks = this.shuffleArray([...this.contentData.licenseTasks]);
    this.contentData.plagiarismTasksModule2 = this.shuffleArray([...this.contentData.plagiarismTasksModule2]);
    this.contentData.plagiarismTasksModule3 = this.shuffleArray([...this.contentData.plagiarismTasksModule3]);
    this.contentData.auditTasks = this.shuffleArray([...this.contentData.auditTasks]);
    
    this.missions = this.content.missions;
  }"""

engine = engine.replace(constructor_old, constructor_new)

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "w") as f:
    f.write(engine)
