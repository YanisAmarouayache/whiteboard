import { Injectable } from '@angular/core';
import { DataSource, DataSourceConfig } from './data-source.interface';
import { FunctionDataSource } from './sources/function-data-source';
import { GraphqlDataSource } from './sources/graphql-data-source';
import { RestDataSource } from './sources/rest-data-source';
import { StaticDataSource } from './sources/static-data-source';
import { WebsocketDataSource } from './sources/websocket-data-source';

@Injectable({ providedIn: 'root' })
export class DataSourceFactoryService {
  create(config: DataSourceConfig): DataSource {
    switch (config.type) {
      case 'static':
        return new StaticDataSource(config.staticData);
      case 'rest':
        return new RestDataSource(config);
      case 'websocket':
        return new WebsocketDataSource(config.endpoint ?? '');
      case 'graphql':
        return new GraphqlDataSource(config);
      case 'function':
        return new FunctionDataSource(config.compute ?? (() => null));
      default:
        throw new Error(`Unsupported data source type: ${config.type}`);
    }
  }
}
