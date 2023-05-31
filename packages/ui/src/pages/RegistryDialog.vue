<template>
  <q-dialog ref="dialog" @show="onDialogShow" @hide="onDialogHide" maximized no-backdrop-dismiss>
    <q-layout view="Lhh lpR fff" container class="bg-white text-dark">
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Registry</q-toolbar-title>
          <q-space/>
          <q-btn icon="close" flat v-close-popup dense/>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <q-card flat bordered>
            <q-card-section>
              <span class="text-h6">Registry</span>
            </q-card-section>
            <q-card-section>
              <q-markup-table flat bordered separator="cell" wrap-cells>
                <tbody>
                  <tr>
                    <td width="10%" class="text-left text-bold">ID</td>
                    <td class="text-left">{{ response.id }}</td>
                  </tr>
                  <tr>
                    <td width="10%" class="text-left text-bold">Name</td>
                    <td class="text-left">{{ response.name }}</td>
                  </tr>
                  <tr>
                    <td width="10%" class="text-left text-bold">Description</td>
                    <td class="text-left">{{ response.description }}</td>
                  </tr>
                  <tr>
                    <td width="10%" class="text-left text-bold">Version</td>
                    <td class="text-left">{{ response.version }}</td>
                  </tr>
                  <tr>
                    <td width="10%" class="text-left text-bold">See Also</td>
                    <td class="text-left">{{ response['see also'] }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="q-mt-sm">
            <q-card-section>
              <span class="text-h6">Provider</span>
            </q-card-section>
            <q-card-section>
              <q-markup-table flat bordered separator="cell" wrap-cells>
                <tbody>
                  <tr>
                    <td width="10%" class="text-left text-bold">Name</td>
                    <td class="text-left">{{ provider.name }}</td>
                  </tr>
                  <tr>
                    <td width="10%" class="text-left text-bold">Description</td>
                    <td class="text-left">{{ provider.description }}</td>
                  </tr>
                   <tr>
                    <td width="10%" class="text-left text-bold">Web Page</td>
                    <td class="text-left">{{ provider['web page'] }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
            <q-card-section>
              <span class="text-h6 text-grey">Point of Contacts</span>
            </q-card-section>
            <q-card-section>
              <q-markup-table flat bordered v-for="(poc, index) in pocs" :key="'poc_' + index + poc.email" separator="cell" wrap-cells>
                <tbody>
                  <tr>
                    <td width="10%" class="text-left text-bold">Name</td>
                    <td class="text-left">{{ poc.name }}</td>
                  </tr>
                  <tr>
                    <td width="10%" class="text-left text-bold">Email</td>
                    <td class="text-left">{{ poc.email }}</td>
                  </tr>
                  <tr>
                    <td width="10%" class="text-left text-bold">Function</td>
                    <td class="text-left">{{ poc.function }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="q-mt-sm">
            <q-card-section>
              <span class="text-h6">Operations</span>
            </q-card-section>
            <q-card-section>
              <q-markup-table flat bordered separator="cell" wrap-cells>
                <thead class="bg-primary text-white">
                  <th class="text-left" width="50%">Name</th>
                  <th class="text-left">Security Constraints</th>
                </thead>
                <tbody>
                  <tr v-for="op in operations" :key="op.name">
                    <td>{{ op.name }}</td>
                      <td>{{ op['security-constraint'] || '-' }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="q-mt-sm">
            <q-card-section>
              <span class="text-h6">Peers</span>
            </q-card-section>
            <q-card-section>
              <q-markup-table flat bordered separator="cell" wrap-cells>
                <thead class="bg-primary text-white">
                  <th class="text-left">ID</th>
                  <th class="text-left">Endpoint</th>
                </thead>
                <tbody>
                  <tr v-for="peer in peers" :key="peer['service-id']">
                    <td class="text-left" width="50%">{{ peer['service-id'] }}</td>
                    <td class="text-left">{{ peer.endpoint }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>
          <q-inner-loading color="primary" :showing="loading" size="40px"/>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { ref, defineComponent } from 'vue'
export default defineComponent({
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },

  emits: ['ok', 'hide'],

  setup () {
    return {
      loading: ref(false),
      response: ref({})
    }
  },

  computed: {
    provider () {
      return this.response.provider ? this.response.provider : {}
    },

    pocs () {
      return this.provider['point of contact'] ? (Array.isArray(this.provider['point of contact']) ? this.provider['point of contact'] : [this.provider['point of contact']]) : []
    },

    operations () {
      return this.response.operations ? this.response.operations : []
    },

    peers () {
      return this.response.peers ? this.response.peers : []
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    async onDialogShow () {
      try {
        this.loading = true
        if (!this.endpoint) {
          throw new Error('Endpoint is required.')
        }

        const svc = this.$apiClient.service('discovery-service')
        const result = await svc.get(this.endpoint)
        console.log('result', result)
        this.response = result
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Error: ' + err.message
        })
        console.error(err)
        this.hide()
      } finally {
        this.loading = false
      }
    },

    onDialogHide () {
      this.$emit('hide')
    }
  }
})
</script>