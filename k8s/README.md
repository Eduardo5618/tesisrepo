# Kubernetes Configurations

Esta carpeta contiene todos los archivos YAML para la orquestación de los microservicios en Kubernetes.

## Archivos
- **prueba-pod.yaml**: Pod temporal para probar conectividad con servicios.
- **servicio-pagos-pendientes.yaml**: Configuración del servicio externo para el microservicio de pagos pendientes.
- **servicio-intermediariopagos.yaml**: Configuración del servicio externo para el intermediario de pagos.
- **servicio-gestion-socios.yaml**: Configuración del servicio externo para la gestión de socios.
- **servicio-pagos-actuales.yaml**: Configuración del servicio externo para pagos actuales.

## Cómo aplicar los archivos
Para aplicar un archivo YAML, usa el siguiente comando:
```bash
kubectl apply -f <nombre-del-archivo>.yaml
