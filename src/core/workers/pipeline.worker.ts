import { applyPipeline } from '../transformations/applyPipeline';

// Web worker to process dataset pipelines asynchronously without blocking the main thread
self.onmessage = (event: MessageEvent) => {
  const { dataset, steps, jobId } = event.data;
  
  try {
    const result = applyPipeline(dataset, steps);
    self.postMessage({ success: true, result, jobId });
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message, jobId });
  }
};
