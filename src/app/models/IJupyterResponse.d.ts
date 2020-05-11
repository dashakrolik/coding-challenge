interface JupyterResponse {
  msgId: string;
  msgType: string;
  contentType: string;
  contentValue: string;
  errorType: string;
  stackTrace: string[];
  errorValue: string;
}
