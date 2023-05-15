<template>
  <section>
    <div class="ui m-0 container fluid bg-green">
      <h2 class="text-center m-0 p-top color-white">
        my<span class="color-green-light">.</span>finances<span class="color-green-light">$</span>
      </h2>
      <div class="ui container">
        <div class="row">
          <div class="ui stackable three column grid">
            <div class="column text-center">
              <div class="ui segment box-value">
                  <div class="text-left">  
                    <span class="fs-box">Entradas</span>
                    <i class="arrow alternate circle up outline icon icon-value color-green"></i>
                    <div class="div-value">
                      <strong class="value"> {{ formatValue(inboundTransaction) }} </strong>
                    </div>
                  </div>
              </div>
            </div>
            <div class="column text-center">
              <div class="ui segment box-value">
                  <div class="text-left">  
                    <span class="fs-box">Saídas</span>
                    <i class="arrow alternate circle down outline icon icon-value color-red"></i>
                    <div class="div-value">
                      <strong class="value"> {{ formatValue(outboundTransaction) }} </strong>
                    </div>
                  </div>
              </div>
            </div>
            <div class="column text-center">
              <div class="ui segment box-value bg-green-light color-white">
                  <div class="text-left">  
                    <span class="fs-box">Total</span>
                    <i class="dollar sign icon icon-value color-white"></i>
                    <div class="div-value">
                      <strong class="value"> {{ formatValue(total) }} </strong>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui container mt">
      <div class="row">
        <div class="ui column grid">
          <div class="column text-center">
            <div class="main-box">
              <h3 class="text-left">Adicionar Transação</h3>
              <form class="ui form text-left">
                <div class="field">
                  <div class="five fields">
                    <div class="six wide field">
                      <label>Descrição</label>
                      <input type="text" name="description" v-model="transaction.description">
                    </div>
                    <div class="three wide field">
                      <label>Valor</label>
                      <input type="number" name="value" v-model="transaction.value">
                    </div>
                    <div class="four wide field">
                      <label>Data</label>
                      <input type="date" name="date" v-model="transaction.date">
                    </div>
                    <div class="four wide field">
                      <label>Tipo</label>
                      <select name="type" class="ui fluid dropdown" v-model="transaction.type">
                        <option value="1">Entrada</option>
                        <option value="2">Saída</option>
                      </select>
                    </div>
                    <div class="field">
                      <div class="btn-add">
                        <button class="ui primary button" @click.prevent="checkTransaction()"> Adicionar </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="ui container mt-transactions">          
        <div class="row">
          <div class="ui column grid" :key="updateKey">
            <div class="column text-center">
              <div class="main-box">
                <h3 class="text-left">Transações</h3>
                <table class="ui celled table">
                  <thead>
                    <tr class="text-center">
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Data</th>
                      <th>Operação</th>
                      <th>Remover</th>
                    </tr>
                  </thead>
                  <tbody v-if="transactions.length > 0" class="text-center" id="main-tbody">
                    <tr v-for="(transact, index) of transactions" :key="index" :class="returnText(transact, 'class')">
                      <td>{{ returnText(transact, 'description') }}</td>
                      <td>{{ returnText(transact, 'value') }}</td>
                      <td>{{ returnText(transact, 'date') }}</td>
                      <td>{{ returnText(transact, 'type') }}</td>
                      <td class="text-center">
                        <button id="remove-transaction" class="ui inverted red button" @click.prevent="removeTransaction(index)"> 
                          <i class="trash alternate outline icon m-0"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr class="text-center">
                      <td colspan="5">
                        <p>Nenhuma transação adicionada</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { alertStore } from '../store/alertStore'

const alert = alertStore()
let transaction = reactive({description: '', value: '', date: '', type: 1})
let transactions: object[] = reactive([])
let inboundTransaction = ref(0)
let outboundTransaction = ref(0)
let total = ref(0)
let updateKey = ref(0)

function checkTransaction () {
  let messageAlert = ''
  if (!transaction.description) {
    messageAlert = 'Por favor insira a descrição para adicionar a transação'
  } else if (!transaction.value) {
    messageAlert = 'Por favor insira o valor para adicionar a transação'
  } else if (!transaction.date) {
    messageAlert = 'Por favor insira a data para adicionar a transação'
  }
  if (messageAlert.length) {
    alert.setShowAlert(true)
    alert.setMessageAlert(messageAlert)
    setTimeout(() => {alert.setShowAlert(false)}, 6000)
  } else {
    saveTransaction()
  }
}

function removeTransaction (index: number) {
  transactions.splice(index, 1)
  saveStorage()
}

function saveTransaction () {
  transactions.push(transaction)
  transaction = {description: '', value: '', date: '', type: 1}
  saveStorage()
}

function saveStorage () {
  localStorage.setItem('transactions', JSON.stringify(transactions))
  calculateTotal()
}

function calculateTotal () {
  inboundTransaction.value = 0
  outboundTransaction.value = 0
  transactions.forEach(function(element: any) {
    if (element.type === 1) {
      inboundTransaction.value += element.value
    } else {
      outboundTransaction.value += element.value
    }
  })
  total.value = inboundTransaction.value - outboundTransaction.value
  updateKey.value++
}

function returnText (transact: any, type: string): string {
  let text = ''
  if (type === 'class') {
    text = transact.type === 1 ? 'positive' : 'negative'
  } else if (type === 'description') {
    text = transact.description
  } else if (type === 'value') {
    text = formatValue(transact.value)
  } else if (type === 'date') {
    text = formatDate(transact.date)
  } else if (type === 'type') {
    text = transact.type === 1 ? 'Entrada' : 'Saída'
  }
  return text
}

function formatValue (value: number): string {
  let format = value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
  return format
}

function formatDate (date: string): string {
  let format = date.split('-').reverse().join('/')
  return format
}

onMounted(() => {
  if (localStorage.getItem('transactions')) {
    transactions = JSON.parse(localStorage.getItem('transactions')!)
    calculateTotal()
  }
})

</script>

<style scoped>
.mt {
  margin-top: 70px
}

.box-value {
  width: 17rem; 
  height: 130px; 
  padding: 20px; 
  display: inline-block; 
  position: relative; 
  top: 30px;
}

.bg-green {
  background-color: #005700;
}

.bg-green-light {
  background-color: #428e42;
}

.icon-value {
  float: right;  
  font-size: 27px;
}

.color-green-light {
  color: #428e42;
}

.color-green {
  color: green;
}

.color-red {
  color: red;
}

.color-white {
  color: white;
}

.fs-box {
  font-size: 17px;
}
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.m-0 {
  margin: 0 !important;
}

.div-value {
  position: relative; 
  top: 45px;
}

.value {
  font-size: 24px;
}

.mt-transactions {
  margin-top: 10px;
}

.btn-add {
  position: relative; 
  top: 24px; 
  float: right;
}

.p-top {
  padding-top: 20px;
}

.main-box {
  display: inline-block;
  width: 90%;
}

@media (max-width: 767px)
{
  .btn-add {
    float: left;
    top: 10px;
    margin-bottom: 30px;
  }
}

</style>
