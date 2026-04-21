<template>
    <HelpPage title="Usuarios" role="Admin"
        description="La sección de usuarios permite gestionar todos los usuarios registrados en el sistema. Puedes consultar sus datos, cambiar su rol y eliminarlos."
        :actions="actions"
        notes="No puedes eliminar tu propio usuario. El botón de eliminar estará deshabilitado para el usuario con el que hayas iniciado sesión." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar usuarios',
        description: 'Visualiza el listado completo de usuarios con su nombre, email, rol y estaciones asignadas.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para abrir un modal con la información completa del usuario, incluyendo las estaciones que tiene asignadas.'
    },
    {
        icon: '🔄',
        title: 'Cambiar rol',
        description: 'Haz clic en "Cambiar rol" para asignar un rol diferente al usuario. Los roles disponibles son Admin, Observer y User.'
    },
    {
        icon: '🗑️',
        title: 'Eliminar usuario',
        description: 'Haz clic en "Eliminar" para borrar un usuario del sistema. Se pedirá confirmación antes de proceder. Esta acción no se puede deshacer.'
    },
]
</script>