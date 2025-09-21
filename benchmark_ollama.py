#!/usr/bin/env python3
import os
import sys
import time
import json
import requests
from pathlib import Path

def gather_codebase(root_dir, target_tokens=2000):
    """Collect files to approximately match target token count"""
    files_content = []
    current_tokens = 0
    chars_per_token = 4  # Rough estimate
    target_chars = target_tokens * chars_per_token
    
    extensions = ['.ts', '.js', '.html', '.css', '.json', '.md']
    
    for ext in extensions:
        if current_tokens >= target_tokens:
            break
            
        for file_path in Path(root_dir).rglob(f'*{ext}'):
            if any(skip in str(file_path) for skip in ['node_modules', '.git', 'dist', '.angular', 'coverage']):
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Add portion of file to reach target
                    remaining_chars = target_chars - (current_tokens * chars_per_token)
                    if remaining_chars > 0:
                        chunk = content[:remaining_chars]
                        files_content.append(f"\n--- {file_path.relative_to(root_dir)} ---\n{chunk}")
                        current_tokens += len(chunk) // chars_per_token
                    
                    if current_tokens >= target_tokens:
                        break
            except:
                pass
    
    full_context = ''.join(files_content)
    actual_tokens = len(full_context) // chars_per_token
    print(f"Gathered {len(files_content)} files, ~{actual_tokens:,} tokens")
    return full_context

def benchmark_ollama(model, context, context_size):
    """Benchmark with specified context size"""
    
    prompt = f"{context}\n\nBased on the code above, identify the main Angular components and services."
    
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True,
        "options": {
            "temperature": 0.6,
            "num_ctx": context_size,
            "num_gpu": -1,  # Use all GPU layers
            "num_thread": 8  # Limit CPU threads to reduce competition
        }
    }
    
    print(f"\nTesting {model} with {context_size:,} token context window...")
    start_time = time.time()
    first_token_time = None
    tokens_generated = 0
    
    try:
        response = requests.post(url, json=payload, stream=True, timeout=300)
        
        for line in response.iter_lines():
            if line:
                data = json.loads(line)
                if 'error' in data:
                    print(f"ERROR: {data['error']}")
                    return False
                    
                if 'response' in data:
                    if first_token_time is None:
                        first_token_time = time.time()
                        print(f"✓ Time to first token: {first_token_time - start_time:.2f}s")
                    
                    tokens_generated += 1
                    if tokens_generated % 25 == 0:
                        elapsed = time.time() - first_token_time
                        tps = tokens_generated / elapsed if elapsed > 0 else 0
                        print(f"  Generating: {tokens_generated} tokens @ {tps:.1f} t/s", end='\r')
                
                if data.get('done', False):
                    break
        
        if first_token_time:
            generation_time = time.time() - first_token_time
            print(f"\n✓ Completed: {tokens_generated} tokens @ {tokens_generated/generation_time:.1f} t/s")
            return True
        else:
            print("\n✗ Failed: No tokens generated (likely OOM)")
            return False
            
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False

def find_max_context(model, project_root, start=8192, max_size=131072, step_factor=2):
    """Binary search to find maximum working context size"""
    
    print(f"\n{'='*60}")
    print(f"Finding maximum GPU context for {model}")
    print(f"Starting from {start:,} tokens, testing up to {max_size:,}")
    print(f"{'='*60}")
    
    working_sizes = []
    failed_sizes = []
    current_size = start
    
    # First, find a failing size by doubling
    while current_size <= max_size:
        print(f"\n--- Testing {current_size:,} tokens ---")
        context = gather_codebase(project_root, current_size)
        
        success = benchmark_ollama(model, context, current_size)
        
        if success:
            working_sizes.append(current_size)
            print(f"✓ SUCCESS at {current_size:,} tokens")
            current_size *= step_factor
        else:
            failed_sizes.append(current_size)
            print(f"✗ FAILED at {current_size:,} tokens")
            break
    
    # Binary search between last working and first failing
    if working_sizes and failed_sizes:
        low = max(working_sizes)
        high = min(failed_sizes)
        
        print(f"\n--- Binary search between {low:,} and {high:,} ---")
        
        while high - low > 1024:
            mid = (low + high) // 2
            mid = (mid // 1024) * 1024  # Round to nearest 1024
            
            print(f"\n--- Testing {mid:,} tokens ---")
            context = gather_codebase(project_root, mid)
            
            if benchmark_ollama(model, context, mid):
                working_sizes.append(mid)
                low = mid
            else:
                failed_sizes.append(mid)
                high = mid
    
    max_working = max(working_sizes) if working_sizes else 0
    
    print(f"\n{'='*60}")
    print(f"Results for {model}:")
    print(f"Maximum working context: {max_working:,} tokens")
    print(f"Working sizes tested: {sorted(working_sizes)}")
    print(f"Failed sizes tested: {sorted(failed_sizes)}")
    print(f"{'='*60}\n")
    
    return max_working

if __name__ == "__main__":
    project_root = "/home/odin/projects/angular-dockview-core"
    
    # Parse command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "find":
            # Find maximum context for both models
            max_14b = find_max_context("qwen2.5-coder:14b", project_root, start=8192, max_size=65536)
            max_30b = find_max_context("qwen3-coder:30b", project_root, start=8192, max_size=32768)
            
            print("\nFinal Summary:")
            print(f"Qwen2.5-14B max context: {max_14b:,} tokens")
            print(f"Qwen3-30B max context: {max_30b:,} tokens")
        else:
            # Test specific size
            test_size = int(sys.argv[1])
            context = gather_codebase(project_root, test_size)
            
            print("\n--- Testing both models ---")
            benchmark_ollama("qwen2.5-coder:14b", context, test_size)
            benchmark_ollama("qwen3-coder:30b", context, test_size)
    else:
        # Default test with 8192
        context = gather_codebase(project_root, 8192)
        benchmark_ollama("qwen2.5-coder:14b", context, 8192)
        benchmark_ollama("qwen3-coder:30b", context, 8192)