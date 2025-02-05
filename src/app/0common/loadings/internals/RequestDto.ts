export class RequestDto {
  public url: string = '';

  public status: 'unstarted' | 'loading' | 'failed' | 'success' = 'unstarted';

  public response: unknown = undefined;

  public error: unknown = undefined;
}
