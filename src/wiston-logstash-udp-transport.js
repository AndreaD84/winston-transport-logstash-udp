const dgram = require('dgram');
const  os = require('os');
const Transport = require('winston-transport');


module.exports = class LogStashTransports extends Transport {
  constructor(opts) {
    super(opts);
    this.host = opts.host;
    this.port = opts.port;
    this.serverName = opts.node_name || os.hostname();
    this.udpType = opts.udpType === 'udp6' ? 'udp6' : 'udp4';
    this.trailingLineFeed = opts.trailingLineFeed === true;
    this.trailingLineFeedChar = opts.trailingLineFeedChar || os.EOL;
    this.application = opts.appName || process.title;
    this.pid = opts.pid || process.pid;
    this.silent = opts.silent;
    this.client = null;

    this.connect()
  }

  connect() {
    this.client = dgram.createSocket(this.udpType)
    this.client.unref()
  }

  log(level, msg, meta, callback) {
    if (this.silent) {
      return callback(null, true);
    }

    let logEntry;

    meta.pid = this.pid;
    logEntry = {
      level: level,
      message: msg,
      meta: {
        application: this.application,
        serverName: this.serverName,
      },
      timestamp: new Date()
    };

    logEntry = JSON.stringify(logEntry);

    this.sendUdpLog(logEntry, (err) => {
      this.emit('logged', !err)
      callback(err, !err)
    });
  }

  sendUdpLog(message, callback) {
    if (this.trailingLineFeed === true) {
      message = message.replace(/\s+$/, '') + this.trailingLineFeedChar;
    }

    const buf = Buffer.from(message);
    this.client.send(buf, 0, buf.length, this.port, this.host, (callback || noop));
  }
};

