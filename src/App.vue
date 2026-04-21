<template>
    <ThemeProvider>
        <SidebarProvider>
            <RouterView />
        </SidebarProvider>
    </ThemeProvider>
</template>

<script setup>
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
</script>

<!-- Link to Figma design: -->
<!-- https://www.figma.com/design/Ng19EfuzQJeMKx8m5FEl12/POS_-CodeOn-Pos?node-id=870-37366&p=f&t=PiqylvvvBFZwcGgn-0 -->