<template>
  <q-page padding>
    <div class="row q-col-gutter-xs">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>Registries</q-card-section>
        <q-card-section>
          <q-select
            v-model="peers"
            :options="peerOptions"
            label="Registries"
            outlined
            dense
            use-input
            input-debounce="0"
            @filter="filterRegistries"
            multiple
            clearable>
            <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
              <q-item v-bind="itemProps">
                <q-item-section side>
                  <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>Search Criteria</q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-4">
                <q-card flat bordered>
                  <q-card-section>Service Category</q-card-section>
                  <q-card-section>
                    <div class="row q-col-gutter-sm">
                      <div class="col-6">
                        <q-list dense>
                          <q-item header>Information</q-item>
                          <q-item v-for="item in categoryInformationOptions" :key="item.value" tag="label">
                            <q-item-section side>
                              <q-checkbox v-model="selectedCategory" :val="item"/>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                      <div class="col-6">
                        <q-list dense>
                          <q-item header>Core</q-item>
                          <q-item v-for="item in categoryCoreOptions" :key="item.value" tag="label">
                            <q-item-section side>
                              <q-checkbox v-model="selectedCategory" :val="item"/>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>

                  </q-card-section>
                </q-card>
              </div>

              <div class="col-4">
                <q-card flat bordered>
                  <q-card-section>Availability Status</q-card-section>
                  <q-card-section>
                    <div class="row q-col-gutter-sm">
                      <div class="col-12">
                        <q-list dense>
                          <q-item v-for="item in availabilityStatusOptions" :key="item.value" tag="label">
                            <q-item-section side>
                              <q-checkbox v-model="selectedStatus" :val="item"/>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-4">
                <q-card flat bordered>
                  <q-card-section>Interface Type</q-card-section>
                  <q-card-section>
                    <div class="row q-col-gutter-sm">
                      <div class="col-12">
                        <q-list dense>
                          <q-item v-for="item in interfaceTypeOptions" :key="item.value" tag="label">
                            <q-item-section side>
                              <q-checkbox v-model="selectedInterface" :val="item"/>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
 
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-card-actions align="center">
      <q-btn label="Reset" color="primary"/>
      <q-btn label="Search" color="primary" @click="search" :loading="loading"/>
    </q-card-actions>
    <q-inner-loading :showing="loading" color="primary" size="50px"/>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    return {
      loading: ref(false),
      peers: ref([]),
      peerOptions: ref([]),
      selectedCategory: ref([]),
      selectedStatus: ref([]),
      selectedInterface: ref([]),
      categoryInformationOptions: ref([
        { label: 'Aeronautical', value: 'aeronautical', parent: 'information' },
        { label: 'Flight', value: 'flight', parent: 'information' },
        { label: 'Infrastructure', value: 'infrastructure', parent: 'information' },
        { label: 'Surveillance', value: 'surveillance', parent: 'information' },
        { label: 'Weather', value: 'weather', parent: 'information' },
        { label: 'World Features', value: 'world-features', parent: 'information' }
      ]),
      categoryCoreOptions: ref([
        { label: 'Discovery', value: 'discovery' },
        { label: 'Mediation', value: 'mediation' },
        { label: 'Messaging', value: 'messaging' },
        { label: 'Security', value: 'security' }
      ]),
      availabilityStatusOptions: ref([
        { label: 'Prospective', value: 'prospective' },
        { label: 'Operational', value: 'operational' },
        { label: 'Retired', value: 'retired' }
      ]),
      interfaceTypeOptions: ref([
        { label: 'Message Oriented', value: 'message-oriented' },
        { label: 'Method Oriented', value: 'method-oriented' },
        { label: 'Resource Oriented', value: 'resource-oriented' }
      ])
    }
  },

  methods: {
    async search () {
      try {
        this.loading = true
        const svc = this.$apiClient.service('service-finder')
        const query = {
          endpoints: this.peers.map(r => r.value),
          categories: this.selectedCategory.map(r => r.value),
          availability: this.selectedStatus.map(r => r.value),
          interfaces: this.selectedInterface.map(r => r.value)
        }
        const result = await svc.find({ query })
        console.log('result', result)
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Error: ' + err.message
        })
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async filterRegistries (val, update, abort) {
      try {
        console.log('filter')
        this.peerOptions = []
        const svc = this.$apiClient.service('peers')
        const result = await svc.find()
        update(() => {
          this.peerOptions = result.map(r => {
            return {
              label: r['service-id'],
              value: r['endpoint']
            }
          })
        })
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Error finding registries.'
        })
        console.error(err)
        abort()
      }
    }
  }
})
</script>
