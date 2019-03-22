# winston-transport-logstash-udp
Transport for `winston` logger to write logs via UDP to logStash

# Usage 

``` javascript
import { logStashTransport } from 'winston-transport-logstash-udp';

...

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'AppNodeName' },
  transports: [
    new logStashTransport({ 
        host: <host>,
        port: <port>,
        udpType: "udp4" | "udp5" (default "udp4"),
        application: <your_app_name>
    }))
  ]
})


logger.info('My First Log');

```

#LogEntry Object Structure

``` javascript
{
  level: level,
  message: msg,
  meta: {
    application: this.application,
    serverName: this.serverName,
  },
  timestamp: new Date()
};
```