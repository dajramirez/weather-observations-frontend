<template>
    <HelpPage title="Dashboard" role="Admin"
        description="El dashboard es la pantalla principal del panel de administración. Muestra un resumen del estado del sistema en tiempo real: usuarios, estaciones, observaciones y alertas activas."
        :actions="actions" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '👥',
        title: 'Total de usuarios',
        description: 'Muestra el número total de usuarios registrados en el sistema, independientemente de su rol.'
    },
    {
        icon: '📡',
        title: 'Total de estaciones',
        description: 'Indica cuántas estaciones meteorológicas están registradas en el sistema.'
    },
    {
        icon: '🌡',
        title: 'Total de observaciones',
        description: 'Número total de observaciones meteorológicas registradas por todos los observadores.'
    },
    {
        icon: '🚨',
        title: 'Alertas activas',
        description: 'Número de alertas que están actualmente activas en el sistema. Una alerta activa indica una condición meteorológica que requiere atención.'
    },
]
</script>