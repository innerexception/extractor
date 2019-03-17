import Constants from '../Constants'

export default class WebsocketClient {

    constructor(args){
        this.onConnected = args.onConnected
        this.onConnectionError = args.onConnectionError
        this.onWSMessage = args.onWSMessage
        this.launch(Constants.ApiUrl)
    }

    launch = (url) => {
        this.websocket = new ReconnectingWebSocket(url);
        console.log('ws: connecting');
        this.websocket.onopen = this.onConnected
        this.websocket.onerror = this.onConnectionError
        this.websocket.onmessage = (e) => {
            if(e){
                var data = JSON.parse(e.data);
                this.onWSMessage(data);
            }
        }
    }

    disconnect = () => {
        this.websocket.disconnect()
    }

    publishMessage= (msg) => {
      var message = JSON.stringify(msg)
      if(message) {
          this.websocket.send(message);
      }
    }
};

const ReconnectingWebSocket = function (url, protocols) {

  protocols = protocols || [];



  // These can be altered by calling code.

  this.debug = false;

  this.reconnectInterval = 2000;

  this.timeoutInterval = 5000;



  var self = this;

  var ws;

  var forcedClose = false;

  var timedOut = false;



  this.url = url;

  this.protocols = protocols;

  this.readyState = WebSocket.CONNECTING;

  this.URL = url; // Public API



  this.onopen = function (event) {

  };



  this.onclose = function (event) {

  };



  this.onconnecting = function (event) {

  };



  this.onmessage = function (event) {

  };



  this.onerror = function (event) {

  };



  function connect(reconnectAttempt) {

    ws = new WebSocket(url, protocols);



    self.onconnecting();



    var localWs = ws;

    var timeout = setTimeout(function () {

      timedOut = true;

      localWs.close();

      timedOut = false;

    }, self.timeoutInterval);



    ws.onopen = function (event) {

      clearTimeout(timeout);

      self.readyState = WebSocket.OPEN;

      reconnectAttempt = false;

      self.onopen(event);

    };



    ws.onclose = function (event) {

      clearTimeout(timeout);

      ws = null;

      if (forcedClose) {

        self.readyState = WebSocket.CLOSED;

        self.onclose(event);

      } else {

        self.readyState = WebSocket.CONNECTING;

        self.onconnecting();

        if (!reconnectAttempt && !timedOut) {

          self.onclose(event);

        }

        setTimeout(function () {

          connect(true);

        }, self.reconnectInterval);

      }

    };



    ws.onmessage = function (event) {

      self.onmessage(event);

    };



    ws.onerror = function (event) {

      self.onerror(event);

    };

  }



  connect(url);



  this.send = function (data) {

    if (ws) {

      return ws.send(data);

    } else {

      throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';

    }

  };



  this.close = function () {

    forcedClose = true;

    if (ws) {

      ws.close();

    }

  };



  /**

   * Additional public API method to refresh the connection if still open (close, re-open).

   * For example, if the app suspects bad data / missed heart beats, it can try to refresh.

   */

  this.refresh = function () {

    if (ws) {

      ws.close();

    }

  };

}

