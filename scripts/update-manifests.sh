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