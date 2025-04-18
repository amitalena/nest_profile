/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Connection } from 'mongoose';

import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(@InjectConnection() private readonly connection: Connection) { }

  onApplicationBootstrap() {
    const state = this.connection.readyState;

    if (state === 1) {
      console.log('✅ MongoDB Connected');
    } else if (state === 2) {
      console.log('🟡 MongoDB Connecting...');
    } else if (state === 0) {
      console.log('❌ MongoDB Disconnected');
    } else if (state === 3) {
      console.log('🔴 MongoDB Disconnecting...');
    }
  };

}