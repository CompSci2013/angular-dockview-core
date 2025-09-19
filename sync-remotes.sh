#!/bin/bash
# Sync to both GitLab and GitHub for disaster recovery

echo "=== Syncing to all remotes ==="
echo ""
echo "Pushing to GitLab (internal via SSH)..."
git push gitlab main
echo ""
echo "Pushing to GitHub (external backup via SSH)..."
git push github main
echo ""
echo "=== Sync complete ==="
git log --oneline -5
