export type PromiseManyData<T> = Promise<{
  total: number;
  data: T[];
}>;
