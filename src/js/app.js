App = {
  web3Provider: null,
  contracts: {},
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: async function() {
      $.getJSON("carrierOrders.json", function(co) {
      App.contracts.carrierOrders = TruffleContract(co);
      App.contracts.carrierOrders.setProvider(App.web3Provider);
      return App.render();
 });
},

  render: function() {
    var podInstance;
    var loader = $("#loader");
    var content = $("#content");
    var statusList = ("Picked Up", "Pending", "Delivered");
    loader.show();
    content.hide();
    web3.eth.getCoinbase(function(err, account) {
    if (err === null) {
      App.account = account;
      $("#accountAddress").html("Your Account: " + account);
      }
    });
       

    App.contracts.carrierOrders.deployed().then(function(instance) {
      coInstance = instance;
      coInstanceAddress = instance.address;
      $("#contractAddress").html("Contract Address: "+ coInstanceAddress);
      return instance.returnCarrier();
    }).then(function(returnCarrier){  
        var carrierName = returnCarrier[0];
        var carrierAddress = returnCarrier[1];
        var numOrders = returnCarrier[2].c[0];
        $("#carrierName").html(carrierName);
        $("#carrierAddress").html("Owner Address: "+ carrierAddress);
        var podResults = $('#podResults');
        podResults.empty();
        console.log(numOrders);
        for (var i = 1; i <= numOrders; i++) {
          coInstance.getOrder(i).then(function(order) {
          var account = coInstance.address;
          var disabled = "";
          var buttonTemplate = "";
          var selTemplate = "Delivered";

          d2 = new Date(order[3]*1000);
          strDate = d2.getFullYear() + "-" + 
            ("00" + (d2.getMonth() + 1)).slice(-2) + "-" + 
            ("00" + d2.getDate()).slice(-2) + " " + 
            ("00" + d2.getHours()).slice(-2) + ":" + 
            ("00" + d2.getMinutes()).slice(-2) + ":" + 
            ("00" + d2.getSeconds()).slice(-2);
          if (order[2] == "Delivered") {disabled = "disabled";}  
          
          if (order[2] != "Delivered") {
            var buttonTemplate =  "<button onclick=\"App.addStatus("+order[0]+")\" id=\"button"+order[0]+"\" type=\"button\" class=\"btn btn-primary\"" +disabled+">Submit</button>"
            var selTemplate = "<select class=\"form-control\" id=\"select"+order[0]+"\">"
            var selTemplate = selTemplate+` <option value="Created">Created</option>
                                          <option value="Picked Up">Picked Up</option>
                                          <option value="Delivered">Delivered</option>
                                          </select>`
          }
          var podTemplate = "<tr><th>" + order[1]  + "</th><td>" + order[2] +   "</th><td>" +strDate + "</th><td>" + selTemplate + "</td><td>" + buttonTemplate + "</td></tr>"
          podResults.append(podTemplate);
        });
      }
        loader.hide();
        content.show();
    }).catch(function(error) {
      console.warn(error);
    });
},

    addStatus: async function(_lineNo) {
      var selStatus = $('#select'+_lineNo).val();
      strDate = Math.round((new Date()).getTime() / 1000);
      await coInstance.setOrderStatus(_lineNo, selStatus, strDate, { from: App.address });
      location.reload();
    }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});