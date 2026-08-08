# DevTrack Kubernetes Deploy Guide

This file documents how to deploy the DevTrack stack to a Kubernetes cluster (local or managed), what I changed during recovery, and verification steps.

Prerequisites
- `kubectl` configured to the target cluster/context
- A StorageClass named `standard` (the manifests use it)
- `docker` images for backend/frontend pushed to a registry accessible by the cluster

Apply manifests
```sh
# Create namespace and core resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/limit-range.yaml
kubectl apply -f k8s/resource-quota.yaml

# Create service akubectl top pods -n devtrack
ccounts, configmap and secret (edit secret values first)
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/backend/serviceaccount.yaml
kubectl apply -f k8s/mongodb/serviceaccount.yaml

# Deploy the database first
kubectl apply -f k8s/mongodb/headless-service.yaml
kubectl apply -f k8s/mongodb/service.yaml
kubectl apply -f k8s/mongodb/statefulset.yaml

# Deploy backend + frontend + supporting manifests
kubectl apply -f k8s/backend/service.yml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml

# Ingress and networkpolicy
kubectl apply -f k8s/ingress/ingress.yaml
kubectl apply -f k8s/networkpolicy/mongodb-networkpolicy.yaml
```

Important notes (from recovery)
- The MongoDB root user is created only when the data directory is empty. If you reuse a PVC with existing data, `MONGO_INITDB_ROOT_*` will not run.
- Namespace `LimitRange` sets defaults/max memory to `512Mi`. Make sure `k8s/mongodb/statefulset.yaml` memory limits are <= 512Mi.
- `k8s/kind-config.yaml` is not a cluster manifest and should not be applied with `kubectl`.

Verification
```sh
kubectl get pods -n devtrack
kubectl get pvc -n devtrack
kubectl logs -n devtrack statefulset/mongodb --tail=200 || kubectl logs -n devtrack mongodb-0 --tail=200
kubectl logs -n devtrack -l app=backend --tail=200
kubectl get ingress -n devtrack
```

Rollback / cleanup
- To remove the stack: `kubectl delete -f k8s/ -R --ignore-not-found`
- If you need a clean MongoDB init: delete PVCs and the underlying hostPath data (careful: data loss).
