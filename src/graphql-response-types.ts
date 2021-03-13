export type StatusResponse = { status: number; message: string };

export type StatusType = { status: number; message?: string };

export type ExistsType = { exists: boolean };

export interface GraphQLError {
  message: string;
  path: string[];
  locations: { line: number; column: number }[];
  extensions: {
    exception: StatusResponse & { response: StatusResponse };
    stacktrace: string[];
  };
}
