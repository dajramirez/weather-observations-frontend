<template>
    <HelpPage title="Alertas" role="Admin"
        description="La sección de alertas muestra todas las alertas del sistema. Las alertas se generan automáticamente cuando una observación supera los umbrales definidos, pero también pueden crearse manualmente."
        :actions="actions"
        notes="Las alertas se generan automáticamente al registrar una observación con valores extremos: temperatura superior a 42°C o inferior a -10°C, viento superior a 90 km/h, precipitación superior a 50 mm, presión inferior a 970 hPa o superior a 1040 hPa, y humedad superior al 95%." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar alertas',
        description: 'Visualiza el listado de todas las alertas del sistema con su estación, nivel, estado y fecha.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para consultar el detalle completo de la alerta, incluyendo la observación que la originó.'
    },
    {
        icon: '➕',
        title: 'Crear alerta manualmente',
        description: 'Haz clic en "Nueva alerta" para crear una alerta manual. Selecciona la estación, introduce el título, mensaje y nivel (green, yellow, orange, red).'
    },
    {
        icon: '✏️',
        title: 'Editar alerta',
        description: 'Haz clic en "Editar" para modificar el título, mensaje, nivel o estado de activación de una alerta existente.'
    },
    {
        icon: '🔔',
        title: 'Activar / Desactivar',
        description: 'Desde el formulario de edición puedes marcar o desmarcar el checkbox "Activa" para cambiar el estado de la alerta.'
    },
    {
        icon: '🗑️',
        title: 'Eliminar alerta',
        description: 'Haz clic en "Eliminar" para borrar una alerta del sistema. Se pedirá confirmación antes de proceder.'
    },
]
</script>