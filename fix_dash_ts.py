with open('frontend/src/app/features/admin/dashboard/dashboard.component.ts', 'r') as f:
    text = f.read()

text = text.replace('  isDemoFullscreen = false;', '  isDemoFullscreen = false;\n  showCreateModal = false;\n  sortOrder: "newest" | "oldest" | "active" = "active";')

with open('frontend/src/app/features/admin/dashboard/dashboard.component.ts', 'w') as f:
    f.write(text)
