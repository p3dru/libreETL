import Dexie, { Table } from 'dexie';
import { Dataset } from '@/types/dataset';
import { PipelineTemplate } from '@/types/pipeline';

export class LibreETLDB extends Dexie {
  datasets!: Table<Dataset, string>;
  pipelineTemplates!: Table<PipelineTemplate, string>;

  constructor() {
    super('LibreETLDatabase');
    this.version(2).stores({
      datasets: 'id, name, createdAt',
      pipelineTemplates: 'id, name, createdAt'
    });
  }
}

export const db = new LibreETLDB();
