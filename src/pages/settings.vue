<template>
    <v-layout>
        <v-app-bar class="px-md-4" flat>
            <template #prepend>
                <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />
            </template>

            <div class="d-flex align-center flex-fill">
                <v-img class="me-sm-8" max-width="40" src="@/assets/logo.png" />

                <div v-if="$vuetify.display.mdAndUp" class="d-flex justify-center flex-1-0-0">
                    <v-btn v-for="(item, i) in items" :key="i" :active="i === 0" class="me-2 text-none" slim
                        v-bind="item" />
                </div>
            </div>

            <template #append>
                <v-btn class="ms-1 opacity-60" icon="mdi-bell-outline" />

                <v-btn class="ms-1" icon>
                    <v-avatar image="https://cdn.vuetifyjs.com/images/john.png" />

                    <v-menu activator="parent" origin="top">
                        <v-list>
                            <v-list-item link title="Update profile" />

                            <v-list-item link title="Sign out" />
                        </v-list>
                    </v-menu>
                </v-btn>
            </template>
        </v-app-bar>

        <v-main>
            <v-toolbar v-if="display.mdAndDown.value" color="surface" height="70">
                <v-container class="align-self-start pa-0 mx-3 h-100">
                    <v-btn-toggle class="overflow-x-auto h-100" color="primary" :model-value="0" :ripple="false" slim
                        variant="plain">
                        <v-btn v-for="(navItem, i) in navItems" :key="i" class="text-none" v-bind="navItem"
                            :ripple="false" :text="navItem.title" :value="i" />
                    </v-btn-toggle>
                </v-container>
            </v-toolbar>

            <v-container class="px-6 py-6 mb-6" fluid max-width="1200px">
                <h5 class="text-h6 mb-2 font-weight-medium">Profile</h5>

                <p class="text-body-2 text-medium-emphasis">This information will be displayed publicly so be careful
                    what you
                    share.</p>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <v-row class="w-50" no-gutters>
                        <v-col cols="12" md="6">
                            <h5 class="text-subtitle-1 font-weight-medium ">Full name</h5>
                        </v-col>

                        <v-col cols="12" md="6">
                            <p class="text-body-2 text-medium-emphasis">Tom Cook</p>
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <v-row class="w-50" no-gutters>
                        <v-col cols="12" md="6">
                            <h5 class="text-subtitle-1 font-weight-medium ">Email address</h5>
                        </v-col>

                        <v-col cols="12" md="6">
                            <p class="text-body-2 text-medium-emphasis">tom.cook@example.com</p>
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <v-row class="w-50" no-gutters>
                        <v-col cols="12" md="6">
                            <h5 class="text-subtitle-1 font-weight-medium ">Title</h5>
                        </v-col>

                        <v-col cols="12" md="6">
                            <p class="text-body-2 text-medium-emphasis">Human Resources Manager</p>
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>
            </v-container>

            <v-container class="px-6 py-6 mb-6" fluid max-width="1200px">
                <h5 class="text-h6 mb-2 font-weight-medium">Bank accounts</h5>

                <p class="text-body-2 text-medium-emphasis">Connect bank accounts to your account.</p>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <h5 class="text-subtitle-1 font-weight-medium ">TD Canada Trust</h5>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <h5 class="text-subtitle-1 font-weight-medium ">Royal Bank of Canada</h5>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>

                <v-divider class="my-6" />

                <v-btn class="text-none" color="primary" prepend-icon="mdi-plus" :ripple="false" slim
                    text="Add another bank" variant="text" />
            </v-container>

            <v-container class="px-6 py-6 mb-6" fluid max-width="1200px">
                <h5 class="text-h6 mb-2 font-weight-medium">Integrations</h5>

                <p class="text-body-2 text-medium-emphasis">Connect applications to your account.</p>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <h5 class="text-subtitle-1 font-weight-medium ">QuickBooks</h5>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>

                <v-divider class="my-6" />

                <v-btn class="text-none" color="primary" prepend-icon="mdi-plus" :ripple="false" slim
                    text="Add another application" variant="text" />
            </v-container>

            <v-container class="px-6 py-6 mb-6" fluid max-width="1200px">
                <h5 class="text-h6 mb-2 font-weight-medium">Language and dates</h5>

                <p class="text-body-2 text-medium-emphasis">Choose what language and date format to use throughout your
                    account.
                </p>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <v-row class="w-50" no-gutters>
                        <v-col cols="12" md="6">
                            <h5 class="text-subtitle-1 font-weight-medium ">Language</h5>
                        </v-col>

                        <v-col cols="12" md="6">
                            <p class="text-body-2 text-medium-emphasis">English</p>
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <v-row class="w-50" no-gutters>
                        <v-col cols="12" md="6">
                            <h5 class="text-subtitle-1 font-weight-medium ">Date format</h5>
                        </v-col>

                        <v-col cols="12" md="6">
                            <p class="text-body-2 text-medium-emphasis">DD-MM-YYYY</p>
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-btn class="text-none" color="primary" :ripple="false" slim text="Update" variant="text" />
                    </div>
                </div>

                <v-divider class="my-6" />

                <div class="d-flex justify-space-between align-center">
                    <h5 class="text-subtitle-1 font-weight-medium ">Automatic timezone</h5>

                    <div class="d-flex justify-end align-center flex-grow-1">
                        <v-switch color="primary" hide-details />
                    </div>
                </div>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { useDisplay } from 'vuetify'

const display = useDisplay()

const drawer = shallowRef(false)

const navDrawer = shallowRef(true)

const items = [
    {
        text: 'Dashboard',
    },
    {
        text: 'Users',
    },
    {
        text: 'Projects',
    },
    {
        text: 'Settings',
    },
    {
        text: 'Contact',
    },
]

const navItems = ref([
    {
        title: 'General',
        prependIcon: 'mdi-account-reactivate-outline',
        link: true,
    },
    {
        title: 'Security',
        prependIcon: 'mdi-fingerprint',
        link: true,
    },
    {
        title: 'Notifications',
        prependIcon: 'mdi-bell-badge-outline',
        link: true,
    },
    {
        title: 'Plan',
        prependIcon: 'mdi-calendar-month-outline',
        link: true,
    },
    {
        title: 'Billing',
        prependIcon: 'mdi-wallet',
        link: true,
    },
    {
        title: 'Team members',
        prependIcon: 'mdi-account-group',
        link: true,
    },
])

</script>