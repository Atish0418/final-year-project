"""Mermaid diagram rendering utilities."""

import base64
import re
from pathlib import Path
from typing import Optional


def sanitize_mermaid_code(code: str) -> str:
    """Clean up common Mermaid syntax errors from small LLMs."""
    if not code:
        return ""
    
    lines = code.split('\n')
    clean_lines = []
    
    for line in lines:
        l = line.strip()
        if not l:
            continue
            
        # Ensure 'graph TD' or 'flowchart TD' is at the top
        if l.startswith('graph') or l.startswith('flowchart'):
            clean_lines.append(l)
            continue
            
        # Fix 1: Wrap orphan text in brackets if it looks like a label but missing brackets
        # e.g. Node1 Label Text -> Node1[Label Text]
        if '[' not in l and '(' not in l and '{' not in l and '-->' in l:
            # Handle connections: A --> B C -> A --> B_C
            parts = l.split('-->')
            new_parts = []
            for p in parts:
                p = p.strip()
                if ' ' in p:
                    new_parts.append(f"{p.split(' ')[0]}[{' '.join(p.split(' ')[1:])}]")
                else:
                    new_parts.append(p)
            l = ' --> '.join(new_parts)
            
        # Fix 2: Remove common forbidden characters from labels
        if '[' in l and ']' in l:
            label_start = l.find('[')
            label_end = l.rfind(']')
            label = l[label_start+1:label_end]
            # Remove parentheses, brackets, etc from label
            clean_label = re.sub(r'[(){}[\]&#]', '', label)
            l = l[:label_start+1] + clean_label + l[label_end:]
            
        clean_lines.append(l)
            
    return '\n'.join(clean_lines)

def extract_mermaid_code(content: str) -> Optional[str]:
    """Extract Mermaid code from markdown code blocks and sanitize it.
    
    Args:
        content: String that may contain Mermaid code in markdown format
        
    Returns:
        Extracted and sanitized Mermaid code or None if not found
    """
    # Try to extract from ```mermaid code blocks
    pattern = r'```mermaid\s*(.*?)\s*```'
    match = re.search(pattern, content, re.DOTALL)
    
    code = None
    if match:
        code = match.group(1).strip()
    elif content.strip().startswith('graph') or content.strip().startswith('flowchart'):
        code = content.strip()
        
    if code:
        return sanitize_mermaid_code(code)
    
    return None


def render_mermaid_to_image(mermaid_code: str, output_path: str, format: str = "png") -> bool:
    """Render Mermaid code to an image file using Mermaid.ink API.
    
    Args:
        mermaid_code: Mermaid diagram code
        output_path: Path where to save the image
        format: Output format ('png' or 'svg')
        
    Returns:
        True if successful, False otherwise
    """
    try:
        import httpx
        
        # Extract clean Mermaid code
        clean_code = extract_mermaid_code(mermaid_code)
        if not clean_code:
            return False
        
        # Encode the Mermaid code for URL
        encoded = base64.urlsafe_b64encode(clean_code.encode('utf-8')).decode('utf-8')
        
        # Use Mermaid.ink API
        if format.lower() == 'svg':
            url = f"https://mermaid.ink/svg/{encoded}"
        else:
            url = f"https://mermaid.ink/img/{encoded}"
        
        # Download the image
        response = httpx.get(url, timeout=30.0)
        response.raise_for_status()
        
        # Save to file
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'wb') as f:
            f.write(response.content)
        
        return True
        
    except Exception:
        return False


def render_mermaid_with_playwright(mermaid_code: str, output_path: str, format: str = "png") -> bool:
    """Render Mermaid code to an image using Playwright (local rendering).
    
    This method renders the diagram locally using a headless browser.
    Requires playwright to be installed: pip install playwright && playwright install chromium
    
    Args:
        mermaid_code: Mermaid diagram code
        output_path: Path where to save the image
        format: Output format ('png' or 'svg')
        
    Returns:
        True if successful, False otherwise
    """
    try:
        from playwright.sync_api import sync_playwright
        
        # Extract clean Mermaid code
        clean_code = extract_mermaid_code(mermaid_code)
        if not clean_code:
            return False
        
        # Create HTML with Mermaid
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <script type="module">
                import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                mermaid.initialize({{ startOnLoad: true, theme: 'default' }});
            </script>
        </head>
        <body>
            <div class="mermaid">
{clean_code}
            </div>
        </body>
        </html>
        """
        
        
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.set_content(html_content)
            
            # Wait for Mermaid to render
            page.wait_for_selector('svg', timeout=10000)
            
            # Get the SVG element
            svg_element = page.query_selector('.mermaid svg')
            
            if svg_element:
                output_file = Path(output_path)
                output_file.parent.mkdir(parents=True, exist_ok=True)
                
                if format.lower() == 'svg':
                    # Save as SVG
                    svg_content = svg_element.inner_html()
                    with open(output_file, 'w', encoding='utf-8') as f:
                        f.write(f'<svg{svg_content}</svg>')
                else:
                    # Save as PNG
                    svg_element.screenshot(path=str(output_file))
                
                browser.close()
                return True
            
            browser.close()
            return False
            
    except ImportError:
        return False
    except Exception:
        return False


def save_mermaid_html(mermaid_code: str, output_path: str) -> bool:
    """Save Mermaid code as an HTML file that can be opened in a browser.
    
    Args:
        mermaid_code: Mermaid diagram code
        output_path: Path where to save the HTML file
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Extract clean Mermaid code
        clean_code = extract_mermaid_code(mermaid_code)
        if not clean_code:
            return False
        
        # Create HTML with Mermaid
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roadmap Diagram</title>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({{ 
            startOnLoad: true, 
            theme: 'default',
            themeVariables: {{
                fontSize: '16px'
            }}
        }});
    </script>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            text-align: center;
        }}
        .mermaid {{
            text-align: center;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Learning Roadmap Diagram</h1>
        <div class="mermaid">
{clean_code}
        </div>
    </div>
</body>
</html>"""
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        return True
        
    except Exception:
        return False
