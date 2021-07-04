import * as net from 'net';
import * as varint from 'varint';

/*
 *	Server List Ping
 *	https://wiki.vg/Server_List_Ping
 *
 */
export default class MinecraftServerListPing {
  /*
   *	Current
   *	https://wiki.vg/Server_List_Ping#Current
   *
   */
  static ping(
    protocol = 4,
    host: string,
    port = 25565,
    timeout = 3000,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = net.createConnection(port, host);

      client.setTimeout(timeout);

      client.on('timeout', (/* error */) => {
        client.destroy();

        reject(
          new Error(
            'The client timed out while connecting to ' + host + ':' + port,
          ),
        );
      });

      client.on('error', (error) => {
        reject(error);
      });

      client.on('connect', () => {
        // Packet ID
        const packetBuffer = Buffer.from([0x00]);

        // Protocol Version
        const protocolBuffer = Buffer.from(varint.encode(protocol));

        // Server Address
        const hostLengthBuffer = Buffer.from(varint.encode(host.length));
        const hostBuffer = Buffer.from(host);

        // Server Port
        const portBuffer = Buffer.alloc(2);
        portBuffer.writeUInt16BE(port);

        // Next state
        const stateBuffer = Buffer.from([0x01]);

        // Handshake
        const dataBuffer = Buffer.concat([
          packetBuffer,
          protocolBuffer,
          hostLengthBuffer,
          hostBuffer,
          portBuffer,
          stateBuffer,
        ]);
        const dataLengthBuffer = Buffer.from(varint.encode(dataBuffer.length));

        const handshakeBuffer = Buffer.concat([dataLengthBuffer, dataBuffer]);
        client.write(handshakeBuffer);

        // Request
        const requestBuffer = Buffer.from([0x01, 0x00]);
        client.write(requestBuffer);
      });

      // Response
      let responseDataBuffer = Buffer.alloc(0);

      client.on('data', (responseBuffer) => {
        responseDataBuffer = Buffer.concat([
          responseDataBuffer,
          responseBuffer,
        ]);

        let responseDataBufferLength;

        // Error: Invalid
        try {
          responseDataBufferLength = varint.decode(responseDataBuffer);
        } catch (error) {
          return;
        }

        // Error: Too short
        if (
          responseDataBuffer.length <
          responseDataBufferLength - varint.decode.bytes
        )
          return;

        let offset = varint.decode.bytes;

        // Packet ID
        varint.decode(responseDataBuffer, offset);
        offset += varint.decode.bytes;

        // JSON Length
        varint.decode(responseDataBuffer, offset);
        offset += varint.decode.bytes;

        try {
          const response = JSON.parse(
            responseDataBuffer.toString('utf-8', offset),
          );

          resolve(response);
        } catch (error) {
          reject(error);
        }

        client.end();
      });
    });
  }
}
