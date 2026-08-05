#!/bin/bash

echo "========================================"
echo "Updating Kubernetes Manifests..."
echo "========================================"

echo "Current Image Tag: $IMAGE_TAG"

echo ""
echo "Current Backend Image:"
grep "image:" k8s/backend/deployment.yaml

echo ""
echo "Current Frontend Image:"
grep "image:" k8s/frontend/deployment.yaml

echo ""
echo "Updating Backend Image..."

sed -i "s|image: nasirhayat028/devtrack-backend:.*|image: nasirhayat028/devtrack-backend:$IMAGE_TAG|" k8s/backend/deployment.yaml

echo "Updated Backend Image:"
grep "image:" k8s/backend/deployment.yaml


echo ""
echo "Updating Frontend Image..."

sed -i "s|image: nasirhayat028/devtrack-frontend:.*|image: nasirhayat028/devtrack-frontend:$IMAGE_TAG|" k8s/frontend/deployment.yaml

echo "Updated Frontend Image:"
grep "image:" k8s/frontend/deployment.yaml

echo ""
echo "========================================"
echo "Configuring Git..."
echo "========================================"

git config --global user.name "Nasir Hayat"
git config --global user.email "nasirhayat.dev@gmail.com"

echo "Git Configuration:"
git config --global --list

echo ""
echo "========================================"
echo "Git Status"
echo "========================================"

git status


echo ""
echo "========================================"
echo "Staging Manifest Files..."
echo "========================================"

git add k8s/backend/deployment.yaml
git add k8s/frontend/deployment.yaml

echo "Git Status After Staging:"
git status


echo ""
echo "Checking for staged changes..."

if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 0
fi

echo ""
echo "========================================"
echo "Creating Commit..."
echo "========================================"


git commit -m "Update image tags to $IMAGE_TAG"


echo ""
echo "========================================"
echo "Pushing Changes..."
echo "========================================"

git push