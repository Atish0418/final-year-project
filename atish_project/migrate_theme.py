import os
import glob

replacements = {
    "border-white/5": "border-gray-200",
    "border-white/10": "border-gray-200",
    "text-white": "text-gray-900",
    "bg-white/5": "bg-gray-50",
    "bg-white/10": "bg-gray-100",
    "bg-white/20": "bg-gray-100",
    "text-neutral-100": "text-gray-800",
    "text-neutral-200": "text-gray-700",
    "text-neutral-300": "text-gray-600",
    "text-neutral-400": "text-gray-500",
    "bg-surface/80": "bg-white/80",
    "bg-surface-card/80": "bg-gray-50/80",
    "bg-surface-card": "bg-white",
    "bg-surface": "bg-[#D5D3C8]",
    "shadow-glow": "shadow-sm",
    "shadow-inner/20": "shadow-sm",
    "shadow-inner/10": "shadow-sm",
    "ring-primary/60": "ring-black",
    "bg-gradient-to-br from-white/10 via-surface-card/60 to-black/50": "bg-white",
    "from-white/5 to-white/0": "bg-white",
    "text-amber-100": "text-amber-800",
    "bg-amber-500/15": "bg-amber-100",
    "border-amber-400/40": "border-amber-300",
    "text-emerald-50": "text-emerald-800",
    "bg-emerald-500/15": "bg-emerald-100",
    "border-emerald-300/40": "border-emerald-300",
    "border-emerald-300/50": "border-emerald-300",
    "text-slate-50": "text-slate-800",
    "bg-slate-500/15": "bg-slate-100",
    "border-slate-300/50": "border-slate-300",
    "text-amber-50": "text-amber-800",
    "border-amber-300/50": "border-amber-300",
    "text-indigo-50": "text-indigo-800",
    "bg-indigo-500/15": "bg-indigo-100",
    "border-indigo-300/50": "border-indigo-300"
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

dirs_to_process = [
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\pages\**\*.tsx"
]

files_to_process = [
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\layouts\AdminLayout.tsx",
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\admin\AdminDashboardPage.tsx",
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\admin\StreamsPage.tsx",
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\admin\DepartmentsPage.tsx",
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\admin\JobsPage.tsx",
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\admin\QuizPage.tsx",
]

for d in dirs_to_process:
    for filepath in glob.glob(d, recursive=True):
        files_to_process.append(filepath)

for filepath in files_to_process:
    if os.path.exists(filepath):
        process_file(filepath)

print("Migration complete.")
