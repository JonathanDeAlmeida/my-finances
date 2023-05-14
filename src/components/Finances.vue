<template>
  <section>
    <div v-if="showAlert" class="alert">
      <p>{{ message }}</p>
    </div>
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
                      <input type="text" v-model="transaction.description">
                    </div>
                    <div class="three wide field">
                      <label>Valor</label>
                      <input type="number" v-model="transaction.value">
                    </div>
                    <div class="four wide field">
                      <label>Data</label>
                      <input type="date" v-model="transaction.date">
                    </div>
                    <div class="four wide field">
                      <label>Tipo</label>
                      <select class="ui fluid dropdown" v-model="transaction.type">
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
                  <tbody v-if="transactions.length > 0" class="text-center">
                    <tr v-for="(transact, index) of transactions" :key="index" :class="transact.type === 1 ? 'positive' : 'negative'">
                      <td>{{ transact.description }}</td>
                      <td>{{ formatValue(transact.value) }}</td>
                      <td>{{ formatDate(transact.date) }}</td>
                      <td>{{ transact.type === 1 ? 'Entrada' : 'Saída' }}</td>
                      <td class="text-center">
                        <button class="ui inverted red button" @click.prevent="removeTransaction(index)"> 
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

let transaction = reactive({description: '', value: '', date: '', type: 1})
let transactions: object[] = reactive([])
let inboundTransaction = ref(0)
let outboundTransaction = ref(0)
let total = ref(0)
let updateKey = ref(0)
let message = ref('')
let showAlert = ref(false)

function checkTransaction () {
  let showMessage = false
  if (!transaction.description) {
    message.value = 'Por favor insira a descrição para adicionar a transação'
    showMessage = true
  } else if (!transaction.value) {
    message.value = 'Por favor insira o valor para adicionar a transação'
    showMessage = true
  } else if (!transaction.date) {
    message.value = 'Por favor insira a data para adicionar a transação'
    showMessage = true
  }
  if (showMessage) {
    showAlert.value = true
    setTimeout(() => {showAlert.value = false}, 7000)
  } else {
    saveTransaction()
  }
}

function saveTransaction () {
  transactions.push(transaction)
  transaction = {description: '', value: '', date: '', type: 1}
  saveStorage()
}

function removeTransaction (index: number) {
  transactions.splice(index, 1)
  saveStorage()
}

function saveStorage () {
  localStorage.setItem('transactions', JSON.stringify(transactions))
  calculateTotal()
}

function calculateTotal () {
  inboundTransaction.value = 0
  outboundTransaction.value = 0
  // transactions.forEach(function(element) {
  //   if (element.type === 1) {
  //     inboundTransaction.value += element.value
  //   } else {
  //     outboundTransaction.value += element.value
  //   }
  // })
  total.value = inboundTransaction.value - outboundTransaction.value
  updateKey.value++
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

.alert {
  position: fixed; 
  bottom: 15px; 
  right: 15px;
  z-index: 5;
  background-color: #ffb7be;
  border: 3px solid #f5c6cb;;
  border-radius: 5px;
  padding: 10px 20px;
  color: #721c24;
  font-size: 13px;
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
