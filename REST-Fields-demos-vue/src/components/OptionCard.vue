<script setup lang="ts">
defineProps({
    active: Boolean
})

</script>


<template>
    <div :class="`card ${active ? 'active' : ''}`">
        <slot></slot>
    </div>
</template>

<style scoped>
.card {
    padding: 32px;
    background-color: hsl(212, 100%, 97%);
    border: 1px solid hsl(213, 27%, 84%);
    cursor: pointer;
    &:hover {
        background-color: hsl(212, 100%, 94%);
        border-color: hsl(213, 27%, 64%);
    }

    &.active {
        background: hsl(212, 100%, 90%);
        border-color: hsl(213, 27%, 44%);
    }
}


</style>