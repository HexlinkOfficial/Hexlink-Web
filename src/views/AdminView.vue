<template>
    <div class="about">
        <div>
            <input 
                class="input"
                placeholder="your sending address"
                v-model="senderAddrInputStr"/>
            <button 
                class="addrButton"
                :disabled="(senderAddrInputStr.length === 0) || (receiverAddrItems.length === 0)"
                @click="checkResult">Check</button>
        </div>
        <div class="d-flex justify-center flex-wrap mb-6 mt-10">
            <textarea 
                class="textarea"
                v-model="receiverAddrStr"
                placeholder="receiver address(es), for example:
&quot;twitter_username1; twitter_username2; twitter_username3&quot; for user(s) with Twitter accounts
&quot;123@mail.com; 456@mail.com; 789@mail.com&quot; for user(s) with email
                "
                @input="textAreaInput($event)"></textarea>
            <button 
                class="addrButton"
                @click="addAddresses">Add</button>
        </div>
        <div class="d-flex flex-row mb-2 receiverAddressCard">
            <div class="ma-4">
                <v-card
                    class="d-flex flex-wrap"
                    color="grey lighten-2"
                    flat
                    tile
                >
                    <v-card
                        v-for="(addrItem, index) in receiverAddrItems"
                        :key="index"
                        class="pa-2 receiverAddressCell"
                        outlined
                        tile>
                        {{ addrItem.addr }}
                        <button 
                            class="removeReceiverAddrItemButton"
                            v-on:click="receiverAddrItems.splice(index, 1)">&#x2716</button>
                    </v-card>
                </v-card>
            </div>
        </div>
        <table class="table" v-if="resultItems.length > 0">
            <thead>
                <tr>
                    <th v-for="itemKey in tableItemKeys">
                        {{columns[itemKey]}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in resultItems">
                    <td v-for="itemKey in tableItemKeys">
                        {{item[itemKey]}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">

export default {
  data() {
    return {
      senderAddrInputStr: '',
      receiverAddrStr: '',
      receiverAddrItems: [],
      tableItemKeys: ["userhandle", "addr", "lastHistory"],
      columns: { userhandle: 'User Handle', addr: 'Address', lastHistory: 'Last History'},
      resultItems: []
    };
  },
  methods: {
    addAddresses: function () {
        var newAddressItems = this.receiverAddrStr.replace(/\s/g, "").split(";")
        for (var i = 0; i < newAddressItems.length; i++) {
            if (newAddressItems[i].length > 0) {
                // TO-DO: remove the duplicate
                this.receiverAddrItems.push({addr: newAddressItems[i]})
            }
        }
        this.receiverAddrStr = ''
    },
    textAreaInput: function(e) {
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    },
    checkResult: function() {
        this.resultItems = []
        for (var i = 0; i < this.receiverAddrItems.length; i ++) {
            this.resultItems.push({userhandle: this.receiverAddrItems[i].addr, addr: '0x1234', lastHistory: '10pm'})
        }
    },
  },
};

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    padding-top: 10vh;
    padding-left: 10vh;
    padding-right: 10vh;
  }
}

.table {
    text-align: left; 
    width: 80%;
    margin-top: 20px;
}

.table > thead > tr > th{
    color: black;
    background-color: rgb(19, 205, 215);
}

.input {
    width: 80%;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: inherit;
    outline: none;
    padding: 10px;
    min-height: 30px;
    margin-top: 20px;
}

.textarea {
    width: 80%;
    height: auto;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: inherit;
    outline: none;
    padding: 10px;
    min-height: 100px;
    margin-top: 20px;
}

/* TO-DO: differentiate sender and receiver button */
.addrButton {
    width: 15%;
    height: auto;
    border-radius: 10px;
    font-size: inherit;
    padding: 10px;
    margin-top: 20px;
    margin-left: 10px;
    background-color: rgb(19, 205, 215);
}

.addrButton:disabled {
    background-color: rgb(155, 163, 163);
}

.removeReceiverAddrItemButton {
    padding: 0px;
    color: black;
}

.receiverAddressCard {
    margin-top: 10px;
    width: 80%;
}

.receiverAddressCell {
    /* background-color: rgb(103, 106, 107); */
    margin-right: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

</style>