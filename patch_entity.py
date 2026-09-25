import re

with open('api/src/main/java/com/boebel/api/model/AccessTicket.java', 'r') as f:
    content = f.read()

new_field = """    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "paused_at")
    private LocalDateTime pausedAt;"""

content = re.sub(r'    @Column\(name = "is_active", nullable = false\)\n    @Builder.Default\n    private Boolean isActive = true;', new_field, content)

with open('api/src/main/java/com/boebel/api/model/AccessTicket.java', 'w') as f:
    f.write(content)
