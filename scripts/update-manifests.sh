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