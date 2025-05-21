declare module "papaparse" {
  export function parse(
    input: string | File,
    config?: any
  ): {
    data: any[];
    errors: any[];
    meta: any;
  };
}
