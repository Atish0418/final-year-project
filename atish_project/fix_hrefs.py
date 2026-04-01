import os
import re
import glob

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Fix href={`/...`} patterns (template literals) - add # prefix
    # Matches href={`/something...`} but NOT href={`#/...`}
    new_content = re.sub(r'href=\{`/', r'href={`#/', new_content)
    
    # Fix href="/..." patterns (static strings) - add # prefix  
    # Matches href="/something" but NOT href="#/..." or href="#contact"
    new_content = re.sub(r'href="(/[^"]*)"', r'href="#\1"', new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed: {filepath}")

patterns = [
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\pages\**\*.tsx",
    r"C:\Users\jayes\Downloads\FuturePath-3D-main\src\features\**\*.tsx",
]

for p in patterns:
    for filepath in glob.glob(p, recursive=True):
        fix_file(filepath)

print("Done.")
