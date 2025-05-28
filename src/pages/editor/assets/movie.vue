<template>
    <v-container class="pa-md-6" fluid>
        <p class="text-h5 font-weight-bold mb-4">Customers also bought</p>
        <v-row>
            <v-col v-for="(item, i) in products" :key="i" cols="12" md="6" sm="12">
                <v-card class="mx-auto" flat height="300" :image="item.img" link :ripple="false" rounded="lg">
                    <template #image>
                        <v-img cover
                            gradient="to bottom, rgba(var(--v-theme-surface), .1), rgba(var(--v-theme-surface), 1)" />
                    </template>

                    <p class="text-body-1 font-weight-bold position-absolute right-0 bottom-0 pa-4"> {{ item.title }}
                    </p>
                </v-card>


                <v-btn block class="text-none mt-2" color="surface-light" :ripple="false" rounded="lg"
                    text="Add to Timeline" variant="flat" />
            </v-col>
        </v-row>

    </v-container>
</template>

<script setup lang="ts">
const products = [
    {
        title: 'Shoes 1',
        subtitle: 'Fashsion',
        price: 35,
        img: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Shoes 2',
        subtitle: 'Nederland',
        price: 60,
        img: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Shoes 3',
        subtitle: 'Charcoal',
        price: 82,
        img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Shoes 4',
        subtitle: 'Iso Dots',
        price: 42,
        img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
]
</script>

<style scoped></style>