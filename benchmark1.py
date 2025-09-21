#!/usr/bin/env python3
import os
import time
import json
import requests
from pathlib import Path

def gather_codebase(root_dir, max_chars=50000):  # Limit context size
    """Collect limited files to fit in GPU memory"""
    files_content = []
    total_chars = 0
    extensions = ['.ts', '.js', '.html', '.css']
    
    for ext in extensions:
        for file_path in Path(root_dir).rglob(f'*{ext}'):
            if any(skip in str(file_path) for skip in ['node_modules', '.git', 'dist', '.angular']):
                continue
            
            if total_chars > max_chars:
                break
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    files_content.append(f"\n--- {file_path.relative_to(root_dir)} ---\n{content[:2000]}")  # Limit each file
                    total_chars += len(content)
            except:
                pass
    
    full_context = ''.join(files_content)
    print(f"Gathered {len(files_content)} files, {total_chars:,} characters (limited)")
    return full_context

def benchmark_ollama(model, prompt, context, context_size=8192):
    """Benchmark with reasonable context size"""
    
    full_prompt = f"{context}\n\nBased on the code above, {prompt}"
    
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": full_prompt,
        "stream": True,
        "options": {
            "temperature": 0.6,
            "num_ctx": context_size,
            "num_gpu": -1  # Use all GPU layers possible
        }
    }
    
    print(f"\nTesting {model} with {context_size} context...")
    start_time = time.time()
    first_token_time = None
    tokens_generated = 0
    
    response = requests.post(url, json=payload, stream=True)
    
    for line in response.iter_lines():
        if line:
            data = json.loads(line)
            if 'response' in data:
                if first_token_time is None:
                    first_token_time = time.time()
                    print(f"Time to first token: {first_token_time - start_time:.2f}s")
                
                tokens_generated += 1
                if tokens_generated % 25 == 0:
                    elapsed = time.time() - first_token_time
                    tps = tokens_generated / elapsed if elapsed > 0 else 0
                    print(f"Tokens: {tokens_generated}, Speed: {tps:.1f} t/s", end='\r')
            
            if data.get('done', False):
                break
    
    generation_time = time.time() - first_token_time if first_token_time else 0
    print(f"\n=== Results for {model} ===")
    print(f"Tokens generated: {tokens_generated}")
    print(f"Generation speed: {tokens_generated/generation_time:.2f} tokens/second\n")

if __name__ == "__main__":
    project_root = "/home/odin/projects/angular-dockview-core"
    context = gather_codebase(project_root, max_chars=20000)  # Limited context
    
    prompt = "What are the main components in this Angular application?"
    
    # Test 14B first (will fit in GPU)
    benchmark_ollama("qwen2.5-coder:14b", prompt, context, 8192)
    
    # Then try 30B with limited context
    benchmark_ollama("qwen3-coder:30b", prompt, context, 8192)