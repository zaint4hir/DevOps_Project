terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "kubernetes" {
  config_path = pathexpand("~/.kube/config")
}

# namespace
resource "kubernetes_namespace" "lf" {
  metadata { name = "lostfound" }
}

# configmap
resource "kubernetes_config_map" "app" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.lf.metadata[0].name
  }
  data = {
    MONGO_URI = "mongodb://mongodb.lostfound.svc.cluster.local:27017/lostandfounddb"
    PORT      = "5000"
  }
}

# secret (base64-encoded)
resource "kubernetes_secret" "app" {
  metadata {
    name      = "app-secret"
    namespace = kubernetes_namespace.lf.metadata[0].name
  }
  data = {
    JWT_SECRET = "eW91cl9zZWNyZXRfa2V5"  
  }
}

# deployment
resource "kubernetes_deployment" "api" {
  metadata {
    name      = "lostfound-api"
    namespace = kubernetes_namespace.lf.metadata[0].name
    labels    = { app = "lostfound-api" }
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "lostfound-api" } }
    template {
      metadata { labels = { app = "lostfound-api" } }
      spec {
        container {
          name  = "api"
          image = "22i0837/devops_project-api:latest"
          port { container_port = 5000 }
          env {
            name = "MONGO_URI"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.app.metadata[0].name
                key  = "MONGO_URI"
              }
            }
          }
          env {
            name = "PORT"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.app.metadata[0].name
                key  = "PORT"
              }
            }
          }
          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.app.metadata[0].name
                key  = "JWT_SECRET"
              }
            }
          }
          volume_mount {
            name       = "uploads"
            mount_path = "/app/uploads"
          }
        }
        volume {
          name = "uploads"
          persistent_volume_claim {
            claim_name = "uploads-pvc"
          }
        }
      }
    }
  }
}

# service
resource "kubernetes_service" "api" {
  metadata {
    name      = "lostfound-api-svc"
    namespace = kubernetes_namespace.lf.metadata[0].name
  }
  spec {
    selector = { app = kubernetes_deployment.api.metadata[0].labels.app }
    port {
      port        = 80
      target_port = 5000
    }
    type = "ClusterIP"
  }
}

# PVC (uploads)
resource "kubernetes_persistent_volume_claim" "uploads" {
  metadata {
    name      = "uploads-pvc"
    namespace = kubernetes_namespace.lf.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = { storage = "1Gi" }
    }
  }
}
