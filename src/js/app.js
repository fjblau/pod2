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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    // $.getJSON("POD.json", function(pod) {
    //   App.contracts.POD = TruffleContract(pod);
    //   App.contracts.POD.setProvider(App.web3Provider);
    //  }).then(function(reload) {
    $.getJSON("carrierOrders.json", function(co) {
      App.contracts.carrierOrders = TruffleContract(co);
      App.contracts.carrierOrders.setProvider(App.web3Provider);
    }).then(function(instance){  
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

    // Load account data
  web3.eth.getCoinbase(function(err, account) {
    if (err === null) {
      App.account = account;
      $("#accountAddress").html("Your Account: " + account);
    }
  });
   
    

    App.contracts.carrierOrders.deployed().then(function(instance) {
      coInstance = instance;
      return instance.returnCarrierName();
    }).then(function(carrierName){  
        var carrierName = carrierName;
        $("#carrierName").html(carrierName);
      return coInstance.getNumOrders();
    }).then(function(getNumOrders){   
        var podResults = $('#podResults');
        podResults.empty();
        for (var i = 1; i <= getNumOrders; i++) {

          coInstance.getOrder(i).then(function(order) {
          var account = coInstance.address;
          var disabled = "";
          d = order[3]*1000; 
          d2 = new Date(d);
          strDate = d2.getFullYear() + "-" + 
            ("00" + (d2.getMonth() + 1)).slice(-2) + "-" + 
            ("00" + d2.getDate()).slice(-2) + " " + 
            ("00" + d2.getHours()).slice(-2) + ":" + 
            ("00" + d2.getMinutes()).slice(-2) + ":" + 
            ("00" + d2.getSeconds()).slice(-2);
          if (order[2] == "Delivered") {disabled = "disabled";}  
          var buttonTemplate = "";
          var selTemplate = "Delivered";
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

  addStatus: function(_lineNo) {

    App.contracts.carrierOrders.deployed().then(function(instance) {
      coInstance = instance;
      var selStatus = $('#select'+_lineNo).val();
      var today = new Date();
      strDate = Math.round((new Date()).getTime() / 1000);
      console.log(selStatus, strDate);
      return coInstance.setOrderStatus(_lineNo, selStatus, strDate, { from: App.account });
       }).then(function(orderStatus){    
      var selStatus = $('#select'+_lineNo).val();
        location.reload();
      return coInstance.returnCarrierName();
       }).then(function(carrierName){    
          $("#content").hide();
          $("#loader").show();
         
     });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});