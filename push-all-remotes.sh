#!/bin/bash
# Disaster recovery - push to all remotes
echo "Pushing to GitLab..."
git push gitlab main
echo "Pushing to GitHub..."
git push github main
echo "All remotes updated!"
git remote -v
